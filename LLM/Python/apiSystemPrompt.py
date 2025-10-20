import os
from google import genai
from dotenv import load_dotenv
import uuid 
from promptPadrao import system_prompt
from promptUsuario import new_expense


# Carrega variáveis do arquivo .env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Cria cliente
client = genai.Client(api_key=api_key)

# Prompt de sistema atualizado para AFASC

# ---------- system_prompt -----------------

# Dados da nova requisição
# ------------- new_expense ----------

# Função para gerar UUIDs realistas
def generate_uuid():
    return str(uuid.uuid4())

# Monta o prompt final combinando sistema + entrada do usuário
user_input = f"""
Requisição de nova despesa:

Categoria: {new_expense['category']}
Descrição: {new_expense['notes']}
Valor: R$ {new_expense['amount']:.2f}
"""

prompt = f"{system_prompt}\n\n{user_input}"

try:
    response = client.models.generate_content(
        model="gemini-2.5-pro",
        contents=prompt
    )

    if response.candidates and response.candidates[0].content.parts:
        print(response.text)
    else:
        print("⚠️ Nenhum JSON retornado.")

except Exception as e:
    print(f"Ocorreu um erro: {e}")
