# ai_analysis.py
import os
import psycopg2
import google.generativeai as genai
import json
from dotenv import load_dotenv

# Carrega variáveis de ambiente (necessário para acesso ao BD e API)
load_dotenv() 

# --- 1) Funções de Conexão com o Banco de Dados ---
def get_db_connection():
    """Retorna uma nova conexão com o PostgreSQL usando variáveis de ambiente."""
    return psycopg2.connect(
        host=os.getenv("PG_HOST"),
        port=os.getenv("PG_PORT"),
        sslmode=os.getenv("PG_SSLMODE", "require"),
        database=os.getenv("PG_DATABASE"),
        user=os.getenv("PG_USER"),
        password=os.getenv("PG_PASSWORD")
    )

# --- 2) Consulta SQL completa de uma parcela e suas transações ---
def consultar_dados_parcela(parcel_id):
    """Busca a parcela e todas as transações que a consumiram dentro do prazo de 90 dias."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT 
                p.amount AS parcela_total,
                p.available AS periodo,
                p.destination AS dest_enum, -- Adicionado o DESTINATION da Parcela
                COALESCE(SUM(t.amount), 0) AS total_gasto,
                json_agg(
                    json_build_object(
                        'transaction_id', t.id,
                        'amount', t.amount,
                        'due_date', t.due_date,
                        'expense_category', t.expense_category,
                        'supplier', s.name,
                        'supplier_cnpj', s.cnpj,
                        'cost_center_id', c.id, -- Adicionado o ID do CC da Transação
                        'cost_center_name', c.name,
                        'cost_center_type', c.type
                    )
                ) FILTER (WHERE t.id IS NOT NULL) AS detalhes
            FROM parcels p
            LEFT JOIN transactions t 
                ON t.created_at::date >= p.available
                AND t.created_at::date < p.available + INTERVAL '90 days'
            LEFT JOIN suppliers s ON s.id = t.supplier_id
            LEFT JOIN cost_centers c ON c.id = t.cost_center_id
            WHERE p.id = %s
            GROUP BY p.id;
        """

        cursor.execute(query, (parcel_id,))
        data = cursor.fetchone()

        if not data:
            return None

        # Estrutura dos dados para a IA
        return {
            "parcela_total": float(data[0]),
            "periodo": str(data[1]),
            "dest_enum": data[2], # Novo campo para o destino da verba (EDUCATION, etc.)
            "total_gasto": float(data[3]),
            "detalhes": data[4] if data[4] else []
        }
    except Exception as e:
        print(f"Erro ao consultar parcela: {e}")
        return None
    finally:
        if conn:
            conn.close()


# --- 3) Função de Consulta de Dados Brutos (Para o endpoint /parcels/<uuid>) ---
def consultar_parcela_basica(parcel_id):
    """Retorna apenas os dados básicos da parcela."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT p.destination, p.amount, p.available
            FROM parcels p
            WHERE p.id = %s;
        """

        cursor.execute(query, (parcel_id,))
        data = cursor.fetchone()

        if not data:
            return None

        return {
            "destination": data[0],
            "amount": float(data[1]),
            "available": str(data[2])
        }
    except Exception as e:
        print(f"Erro ao consultar parcela básica: {e}")
        return None
    finally:
        if conn:
            conn.close()


# --- 4) Prompt de Sistema para Geração de Transações (JSON OBRIGATÓRIO) ---
SYSTEM_PROMPT_TRANSACTION = """
Você é uma IA especialista em alocação de recursos e planejamento financeiro para a AFASC.

Sua tarefa é analisar os dados da parcela (valor total, gasto, saldo e destinação) e gerar uma **lista de transações de despesa ('EXPENSE')** que aloquem o saldo remanescente, evitando a subutilização da verba.

Regras de Alocação:
1.  O valor total das transações sugeridas DEVE ser igual ou ligeiramente menor que o 'Saldo Remanescente'.
2.  A transação deve ter 'dueDate' dentro dos 90 dias de validade da parcela ('periodo' + 90 dias).
3.  A 'expenseCategory' sugerida deve ser coerente com a 'Destinação da Parcela' (ex: 'FOOD' para Merenda, 'PERSONNEL' para verbas de pessoal).
4.  Use o 'transactionStatus': 'PROJECTION'.

Formato de Saída OBRIGATÓRIO:
Retorne APENAS um **array JSON** contendo objetos no formato de transação, sem qualquer texto explicativo ou markdown extra (como ```json).

[
    {
        "type": "EXPENSE",
        "installmentNumber": 1,
        "costCenterId": "{{UUID_DO_CENTRO_DE_CUSTO_DA_PARCELA}}", 
        "expenseCategory": "PERSONNEL|SERVICE|CONSUMPTION|CAPITAL|FOOD|OPERATING",
        "supplierId": "{{UUID_DO_FORNECEDOR_SUGERIDO}}", 
        "notes": "Descrição clara e específica da transação sugerida",
        "amount": 0000.00,
        "dueDate": "DD/MM/YYYY", 
        "transactionStatus": "PROJECTION"
    }
]
"""

# --- 5) Função para Gerar Planejamento de Transações (Chamada Gemini) ---
def gerar_planejamento_ia(dados):
    """Gera um array JSON de transações sugeridas pela IA para o saldo remanescente."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY não configurada.")
        
    genai.configure(api_key=api_key)

    model = genai.GenerativeModel(
        model_name="gemini-2.5-pro",
        system_instruction=SYSTEM_PROMPT_TRANSACTION,
        generation_config={"temperature": 0.2}
    )

    saldo = dados['parcela_total'] - dados['total_gasto']
    destino = dados['dest_enum']
    
    # Tentativa de inferir um ID de CC de uma transação existente, ou usar um placeholder genérico
    # Para fins práticos, o placeholder é mantido como instrução para a IA.
    cost_center_id_placeholder = "{{UUID_DO_CENTRO_DE_CUSTO_DA_PARCELA}}" 

    prompt = f"""
    Gere um array JSON de transações de 'EXPENSE' para alocar o saldo de R$ {saldo:.2f}.

    Dados da Parcela:
    - Valor total: R$ {dados['parcela_total']:.2f}
    - Saldo Remanescente: R$ {saldo:.2f}
    - Período de liberação (available): {dados['periodo']}
    - Destinação da Parcela (Destino de Uso): {destino}
    - Transações existentes: {json.dumps(dados['detalhes'], indent=2, ensure_ascii=False)}

    Instruções Adicionais:
    1. O valor total alocado DEVE cobrir, no máximo, R$ {saldo:.2f}.
    2. Use a 'Destinação da Parcela' ({destino}) para priorizar as 'expenseCategory' mais relevantes.
    3. Use os placeholders '{cost_center_id_placeholder}' e '{{UUID_DO_FORNECEDOR_SUGERIDO}}'.
    """

    resposta = model.generate_content(prompt)
    
    # Tenta extrair e retornar APENAS o JSON
    try:
        # Remoção de markdown e carregamento do array JSON
        json_string = resposta.text.strip().replace('```json', '').replace('```', '')
        return json.loads(json_string)
    except json.JSONDecodeError as e:
        print(f"Erro ao decodificar JSON da IA: {e}")
        # Retorna o erro e a resposta completa da IA para debug
        return {"error": "Falha na geração JSON", "detalhe_ia": resposta.text, "mensagem_erro": str(e)}

# --------------------------------------
# NOTA: O bloco if __name__ == "__main__": original foi removido, 
# pois este arquivo agora é um MÓDULO importado por app.py.
# --------------------------------------