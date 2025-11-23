import os
import psycopg2
import google.generativeai as genai
from dotenv import load_dotenv
import json

# --------------------------------------
# 1) Carrega variáveis de ambiente (.env)
# --------------------------------------
load_dotenv()

DB_HOST = os.getenv("PG_HOST")
DB_NAME = os.getenv("PG_DATABASE")   # corrigido para o nome real
DB_USER = os.getenv("PG_USER")
DB_PASS = os.getenv("PG_PASSWORD")
DB_PORT = os.getenv("PG_PORT")
DB_SSL = os.getenv("PG_SSLMODE")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# --------------------------------------
# 2) Conexão com o banco
# --------------------------------------
conn = psycopg2.connect(
    host=DB_HOST,
    port=DB_PORT,
    sslmode=DB_SSL,
    database=DB_NAME,
    user=DB_USER,
    password=DB_PASS
)
cursor = conn.cursor()


# --------------------------------------
# 3) Função para listar parcelas
# --------------------------------------
def listar_parcelas():
    cursor.execute("""
        SELECT id, amount, available
        FROM parcels
        ORDER BY available DESC
    """)
    return cursor.fetchall()


# --------------------------------------
# 4) Consulta SQL completa de uma parcela
# --------------------------------------
def consultar_dados_parcela(parcel_id):
    query = """
        SELECT 
            p.amount AS parcela_total,
            p.available AS periodo,
            COALESCE(SUM(t.amount), 0) AS total_gasto,
            json_agg(
                json_build_object(
                    'transaction_id', t.id,
                    'amount', t.amount,
                    'due_date', t.due_date,
                    'expense_category', t.expense_category,
                    'supplier', s.name,
                    'supplier_cnpj', s.cnpj,
                    'cost_center', c.name,
                    'cost_center_type', c.type
                )
            ) FILTER (WHERE t.id IS NOT NULL) AS detalhes
        FROM parcels p
        LEFT JOIN transactions t 
            ON t.created_at::date >= p.available
           AND t.created_at::date <  p.available + INTERVAL '90 days'
        LEFT JOIN suppliers s ON s.id = t.supplier_id
        LEFT JOIN cost_centers c ON c.id = t.cost_center_id
        WHERE p.id = %s
        GROUP BY p.id;
    """

    cursor.execute(query, (parcel_id,))
    data = cursor.fetchone()

    if not data:
        return None

    return {
        "parcela_total": float(data[0]),
        "periodo": str(data[1]),
        "total_gasto": float(data[2]),
        "detalhes": data[3] if data[3] else []
    }


# --------------------------------------
# 5) Prompt fixo para a IA
# --------------------------------------
SYSTEM_PROMPT = """
Você é uma IA especialista em gestão financeira de instituições que recebem parcelas governamentais.

Regras:
- Parcela tem validade de 90 dias.
- A despesa só pode ser paga com parcela da mesma data ou posterior.
- Uma despesa pode usar múltiplas parcelas.
- A verba só pode ser usada na destinação correta.

Sua tarefa:
→ Identificar padrões nos dados.
→ Encontrar centros de custo usados, fornecedores e categorias.
→ Avaliar se houve subutilização.
→ Sugerir onde investir o restante da parcela de forma legal e eficiente.
Sempre dê sugestões específicas, baseadas no comportamento da instituição.
"""


# --------------------------------------
# 6) Função para gerar relatório no Gemini
# --------------------------------------
def gerar_relatorio_ia(dados):
    genai.configure(api_key=GEMINI_API_KEY)

    model = genai.GenerativeModel(
        model_name="gemini-2.5-pro",
        system_instruction=SYSTEM_PROMPT,
        generation_config={"temperature": 0.2}
    )

    prompt = f"""
    Analise os seguintes dados financeiros da parcela:

    Parcela total: R$ {dados['parcela_total']}
    Período de liberação: {dados['periodo']}
    Total gasto: R$ {dados['total_gasto']}
    Transações detalhadas: {json.dumps(dados['detalhes'], indent=2, ensure_ascii=False)}

    Gere um relatório técnico contendo:
    1. Resumo da utilização da parcela
    2. Análise dos fornecedores e centros de custo
    3. Identificação de subutilização ou riscos
    4. Sugestão de onde investir o restante da parcela considerando:
        - categoria de despesa mais usada
        - fornecedores mais recorrentes
        - centros de custo ativos
        - regras RN-001 a RN-004
    5. Sugestões práticas e imediatas
    """

    resposta = model.generate_content(prompt)
    return resposta.text


# --------------------------------------
# 7) EXECUÇÃO PRINCIPAL
# --------------------------------------
if __name__ == "__main__":

    print("\n📦 LISTA DE PARCELAS DISPONÍVEIS:\n")
    parcelas = listar_parcelas()

    if len(parcelas) == 0:
        print("❌ Nenhuma parcela encontrada no banco.")
        exit()

    # Exibir lista
    for i, p in enumerate(parcelas, start=1):
        print(f"{i}. ID: {p[0]} | Valor: R${p[1]} | Disponível em: {p[2]}")

    # Selecionar parcela
    escolha = int(input("\nDigite o número da parcela que deseja analisar: "))
    parcela_id = parcelas[escolha - 1][0]

    print(f"\n🔍 Buscando dados da parcela {parcela_id} ...\n")
    dados = consultar_dados_parcela(parcela_id)

    print("📦 Dados encontrados:\n")
    print(json.dumps(dados, indent=2, ensure_ascii=False))

    print("\n🤖 Gerando relatório da IA...\n")
    relatorio = gerar_relatorio_ia(dados)

    print("\n📄 RELATÓRIO GERADO:\n")
    print(relatorio)
