import os
import json
import decimal
from datetime import datetime
from dotenv import load_dotenv


import google.generativeai as genai
load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL") or os.getenv("POSTGRES_HOST_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

def fetch_data_for_parcel(parcel_number: int):
    conn = psycopg2.connect(DATABASE_URL)
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # 1) Calcula saldo disponível por centro de custo para a parcela
        cur.execute("""
            SELECT
              cc.id as cost_center_id,
              cc.name as cost_center_name,
              cc.type as cost_center_type,
              COALESCE(SUM(
                CASE WHEN t.type = 'INCOME' THEN t.amount
                     WHEN t.type = 'EXPENSE' THEN -t.amount
                     ELSE 0 END
              ), 0) AS balance_available
            FROM cost_centers cc
            LEFT JOIN transactions t ON t.cost_center_id = cc.id
              AND t.installment_number = %s
            GROUP BY cc.id, cc.name, cc.type
        """, (parcel_number,))
        balances = {row["cost_center_id"]: row for row in cur.fetchall()}

        # 2) Busca despesas para a parcela (projeções/itens a analisar)
        cur.execute("""
            SELECT
              t.id,
              t.expense_category,
              t.notes,
              t.amount,
              t.cost_center_id,
              t.supplier_id,
              t.due_date,
              t.status
            FROM transactions t
            WHERE t.type = 'EXPENSE'
              AND t.installment_number = %s
            ORDER BY t.amount DESC NULLS LAST
        """, (parcel_number,))
        expenses = cur.fetchall()

        return balances, expenses

    finally:
        conn.close()


def safe_decimal(v):
    if v is None:
        return 0.0
    if isinstance(v, decimal.Decimal):
        return float(v)
    try:
        return float(v)
    except:
        return 0.0



SYSTEM_PROMPT = """
**IMPORTANTE**: Sempre valide os dados recebidos. Retorne somente JSON puro (nenhum texto adicional).
**REGRA**: Contexto profissional/fiscal.

Regras de negócio conhecidas:
• Cada parcela tem validade de 90 dias, não cumulativa.
• Sobras reduzem a mesma parcela no próximo ano.
• Categorias: PERSONNEL, SERVICE, CONSUMPTION, CAPITAL, FOOD, OPERATING.
• Status possíveis: PROJECTION, COMPLETED.
• Tipo de transação: INCOME, EXPENSE.

Formato de saída (obrigatório) - para CADA sugestão gerada:
{
  "valor": 8750.00,
  "utilização": "Material escolar e suprimentos pedagógicos",
  "categoria": "Consumo",
  "justificativa_IA": "Texto explicando porque usar esse valor a partir do saldo disponível e necessidade.",
  "centro_de_custo": "Educação",
  "parcela": 3
}

Explicação sobre campos:
- valor: número decimal (valor sugerido a ser utilizado).
- utilização: o que será comprado / finalidade.
- categoria: categoria curta em português (ex: Consumo, Serviço, Pessoal, Alimentação, Capital).
- justificativa_IA: justificativa objetiva baseada no saldo disponível e histórico.
- centro_de_custo: nome legível do centro de custo.
- parcela: número da parcela analisada (inteiro).

Dado de entrada por item (forneça somente um JSON de saída por item):
- expense: categoria, notes, amount, due_date, cost_center_name, balance_available

A IA deve analisar o saldo disponível (balance_available) e indicar, se julgar apropriado, qual valor deve ser utilizado daquela parcela para a despesa, priorizando uso racional do saldo. Não invente números: use valores fornecidos quando fizer sentido. Se indicar redução parcial, explique na justificativa_IA.

Retorne apenas o JSON de saída. Nenhum comentário adicional.
"""


model = genai.GenerativeModel(
    model_name="gemini-2.5-pro",
    system_instruction=SYSTEM_PROMPT,
    generation_config={
        "temperature": 0,
        "max_output_tokens": 512
    }
)


def build_user_input(expense_row, balance_row, parcel_number):
  
    """
    Monta a entrada que será enviada ao modelo com os dados necessários.
    """
  
    cost_center_name = balance_row.get("cost_center_name") if balance_row else "Desconhecido"
    balance_available = safe_decimal(balance_row.get("balance_available") if balance_row else 0.0)

    due_date = expense_row.get("due_date")
    if isinstance(due_date, datetime):
        due_date_str = due_date.strftime("%d/%m/%Y")
    else:
        
        try:
            due_date_obj = datetime.fromisoformat(str(due_date))
            due_date_str = due_date_obj.strftime("%d/%m/%Y")
        except:
            due_date_str = str(due_date) if due_date else ""

    user_input = {
        "expense": {
            "category": expense_row.get("expense_category"),
            "notes": (expense_row.get("notes") or "").strip(),
            "amount": safe_decimal(expense_row.get("amount")),
            "due_date": due_date_str,
            "cost_center_name": cost_center_name,
            "balance_available": round(balance_available, 2)
        },
        "context": {
            "parcela": parcel_number
        }
    }
    
    return json.dumps(user_input, ensure_ascii=False)


def analyze_and_generate(parcel_number=1):
    balances, expenses = fetch_data_for_parcel(parcel_number)

    outputs = []
    for exp in expenses:
        cost_center_id = exp.get("cost_center_id")
        balance_row = balances.get(cost_center_id)
        user_input_str = build_user_input(exp, balance_row, parcel_number)

        
        try:
            response = model.generate_content(user_input_str)
            text = response.text.strip()

            
            try:
                parsed = json.loads(text)
                outputs.append(parsed)
            except json.JSONDecodeError:
                
                outputs.append({"_raw_response": text, "expense_id": exp.get("id")})
        except Exception as err:
            outputs.append({"error": str(err), "expense_id": exp.get("id")})

    return outputs


if __name__ == "__main__":
    
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--parcela", type=int, default=1, help="Número da parcela a analisar")
    args = parser.parse_args()

    results = analyze_and_generate(parcel_number=args.parcela)
    
    for r in results:
        print(json.dumps(r, ensure_ascii=False, indent=2))
        print("---")
