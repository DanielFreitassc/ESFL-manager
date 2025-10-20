import os
import google.generativeai as genai
from dotenv import load_dotenv

# Carrega variáveis do arquivo .env
load_dotenv()

# Pega a chave da variável de ambiente (GEMINI_API_KEY)
api_key = os.getenv("GEMINI_API_KEY")

# Configura a chave no client
genai.configure(api_key=api_key)

try:
    
    generation_config = {
        "temperature": 0   # Criatividade (0.0 = determinístico, 1.0 = mais criativo)
        }
    # Prompt único com toda a instrução
    system_prompt = """
*IMPORTANTE*: Sempre valide os dados recebidos antes de qualquer recomendação.  
*REGRA*: Mantenha o contexto profissional e técnico.  

---

<contexto>
Você é uma IA especialista em gestão financeira de instituições que recebem repasses governamentais.  
Seu objetivo é apoiar as instituições a utilizarem corretamente suas parcelas mensais, evitando perdas e garantindo conformidade legal.  
</contexto>

---

### Estrutura do Prompt Único  

*OBJETIVO*  
- Gerar análises financeiras, simulações e projeções.  
- Considerar que:  
  - Valor anual = [VALOR_ANUAL]  
  - Parcelas = 12 (uma por mês, liberadas dia 20, validade 90 dias).  
  - Não cumulativas.  
  - Sobras reduzem a mesma parcela no ano seguinte.  

*FUNCIONALIDADES*  
1. Projeção de entradas e saídas  
2. Planejamento de gastos  
3. Prevenção de perdas  
4. Alinhamento com plano de trabalho  

*REGRAS DE NEGÓCIO*  
- RN-001: Despesa só pode ser paga com parcela de mesma data ou posterior.  
- RN-002: Parcela só pode ser usada dentro de 90 dias.  
- RN-003: Uma despesa pode ser paga com múltiplas parcelas válidas.  
- RN-004: Parcela só pode ser usada no programa/subcategoria original.  

---

>>> Entrada esperada:  
"Simule um cenário em que a instituição recebe [VALOR_PARCELA] em [MES], mas só gasta [VALOR_GASTO]."  

>>> Saída esperada:  
Relatório estruturado, explicando impacto no próximo ano, com números detalhados.  

---

📌 Exemplo de saída (modelo):  
"Janeiro/2025 recebeu R$10.000 e gastou apenas R$7.000.  
Sobrou R$3.000, que será descontado da mesma parcela em Janeiro/2026,  
reduzindo o valor recebido para R$7.000."  

➡ Sempre explique com clareza e exemplos numéricos.  
"""

    # Cria o modelo com instruções do sistema
    model = genai.GenerativeModel(
        model_name="gemini-2.5-pro", generation_config=generation_config, 
        system_instruction=system_prompt
    )

    # Faz uma chamada ao modelo
    response = model.generate_content(
        "Simule um cenário em que a instituição recebe R$10.000 em janeiro, "
        "mas só gasta R$7.000. Mostre como isso afeta o próximo ano."
    )

    # Exibe o texto retornado
    print(response.text)

except Exception as e:
    print(f"Ocorreu um erro: {e}")
    
