import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Carrega variáveis do arquivo .env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

try:
    system_prompt = """
**IMPORTANTE**: Sempre valide os dados recebidos antes de gerar JSON.
**REGRA**: Mantenha o contexto profissional e fiscal.

### CONTEXTO
Você é uma IA especialista em gestão de parcelas de instituições que recebem repasses governamentais.
• Cada parcela tem validade de 90 dias, não cumulativa.
• Sobras reduzem a mesma parcela no próximo ano.
• Categorias de despesas: PERSONNEL, SERVICE, CONSUMPTION, CAPITAL, FOOD, OPERATING.
• Status possíveis: PROJECTION, COMPLETED.
• Tipo de transação: INCOME, EXPENSE.
• CostType (CostCenterEntity.type): OPERATING, OPERATING_CAPITAL_FOOD, OPERATING_CAPITAL, PERSONNEL_CONSUMPTION_SERVICE_CAPITAL.

### INSTRUÇÃO
Para cada despesa fornecida, retorne um **JSON no estilo de TransactionEntity** com os campos:

{
  "type": "EXPENSE",
  "installment_number": [Número da parcela],
  "costCenterId": "[UUID do cost center]",
  "expenseCategory": "[CATEGORY]",
  "supplierId": "[UUID do fornecedor]",
  "notes": "[Descrição do pagamento]",
  "amount": [valor em decimal],
  "dueDate": "[dd/mm/aaaa]",
  "status": "[PROJECTION ou COMPLETED]"
}

"""

    model = genai.GenerativeModel(
        model_name="gemini-1.5-pro",
        system_instruction=system_prompt,
        generation_config={
            "temperature": 0,
            "max_output_tokens": 512
        }
    )

    # Dados de despesas da Parcela 01 de forma estruturada para facilitar o processamento
    expenses_parcela_01 = [
        {"category": "PERSONNEL", "notes": "Folha mensal", "amount": 30000.00},
        {"category": "SERVICE", "notes": "Conta de água", "amount": 500.00, "supplier": "Casan"},
        {"category": "SERVICE", "notes": "Conta de energia", "amount": 1000.00, "supplier": "Celesc"},
        {"category": "SERVICE", "notes": "Estagiários", "amount": 500.00, "supplier": "CIEE"},
        {"category": "SERVICE", "notes": "Serviço de internet", "amount": 1000.00},
        {"category": "SERVICE", "notes": "Serviço de telefonia", "amount": 1000.00},
        {"category": "SERVICE", "notes": "Sistema de ponto", "amount": 2500.00, "supplier": "Ponto System"},
        {"category": "SERVICE", "notes": "Serviço de vigilância", "amount": 1000.00, "supplier": "Vigilância Radar"},
        {"category": "SERVICE", "notes": "Serviço de vigilância", "amount": 2500.00, "supplier": "Vigilância Triângulo"},
        {"category": "CONSUMPTION", "notes": "Materiais de escritório", "amount": 1500.00, "supplier": "Comercial Barcelos"},
        {"category": "CONSUMPTION", "notes": "Papelaria", "amount": 500.00, "supplier": "Fátima Papelaria"},
        {"category": "CONSUMPTION", "notes": "Combustível", "amount": 3000.00, "supplier": "Nosso Posto"},
        {"category": "FOOD", "notes": "Alimentos e refeições", "amount": 1000.00, "supplier": "Padaria Santa Barbara"},
        {"category": "CONSUMPTION", "notes": "Suprimentos em geral", "amount": 2000.00, "supplier": "Supermercado Giassi"},
        {"category": "CONSUMPTION", "notes": "Suprimentos em geral", "amount": 2000.00, "supplier": "Supermercado Manentti"},
    ]
    
    # Processa cada item e envia para o modelo
    json_outputs = []
    for expense in expenses_parcela_01:
        # Cria uma string de entrada para o modelo com as informações da despesa
        user_input = f"""
        Gere um JSON para a seguinte despesa da Parcela 01:
        Categoria: {expense['category']}
        Descrição: {expense['notes']}
        Valor: R$ {expense['amount']:.2f}
        Fornecedor: {expense.get('supplier', 'Não especificado')}
        """

        # Gera o JSON para a despesa
        response = model.generate_content(user_input)
        json_outputs.append(response.text)

    # Imprime os JSONs gerados
    for json_output in json_outputs:
        print(json_output)
        print("---") # Separador para facilitar a visualização

except Exception as e:
    print(f"Ocorreu um erro: {e}")



# modelo pseudo feito utilizando system_prompt, retornando json com infos do primeiro mês para analise.
# verificar resposta e analisar conjunto de dados

