# ESFL-manager

---

# Back end
---

# Front end
---

# Python

---

# 📊 Analisador de Despesas com IA

Este projeto realiza a **análise automatizada de despesas e saldos por parcela** usando um modelo de IA (ex: Gemini, GPT).
A aplicação lê dados do banco, gera prompts dinâmicos e retorna respostas estruturadas em **JSON** com decisões e justificativas.

---

## ⚙️ Estrutura Principal

| Função                                                  | Descrição                                                                                            |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **`fetch_data_for_parcel(parcel_number)`**              | Busca no banco os **saldos** e **despesas** referentes à parcela informada.                          |
| **`build_user_input(exp, balance_row, parcel_number)`** | Monta o **prompt de análise** que será enviado ao modelo de IA.                                      |
| **`model.generate_content(user_input_str)`**            | Envia o texto para o modelo de IA e recebe a resposta.                                               |
| **`analyze_and_generate(parcel_number=1)`**             | Coordena todo o processo: busca dados, monta o prompt, chama a IA e retorna o resultado consolidado. |

---

## 🧠 Exemplo de Retorno

```json
[
  {
    "expense_id": 10,
    "autorizado": true,
    "motivo": "Despesa aprovada, dentro do saldo."
  },
  {
    "expense_id": 11,
    "autorizado": false,
    "motivo": "Saldo insuficiente."
  }
]
```

---

## 💻 Execução Local

Rodar direto pelo terminal:

```bash
python analise.py --parcela 3
```

Ou importar em outro script Python:

```python
from analise import analyze_and_generate

resultados = analyze_and_generate(3)
print(resultados)
```

---

## 🌐 Integração com o Front-End (via API Flask)

### Backend (Flask)

```python
from flask import Flask, request, jsonify
from main import analyze_and_generate

app = Flask(__name__)

@app.route("/analisar", methods=["POST"])
def analisar():
    data = request.json
    parcela = data.get("parcela", 1)
    result = analyze_and_generate(parcel_number=parcela)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
```

### Front-End (JavaScript)

```js
async function analisarParcela(parcela) {
  const response = await fetch("http://localhost:5000/analisar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ parcela })
  });
  const data = await response.json();
  console.log(data);
}
```

---

## 📦 Saída Final

A função principal (`analyze_and_generate`) retorna uma lista de objetos JSON, onde cada item representa uma despesa analisada e contém:

* **`expense_id`** — identificador da despesa
* **`autorizado`** — decisão (true/false)
* **`motivo`** — explicação gerada pela IA

---

## 🧾 Resumo

| Etapa | Ação                                      |
| ----- | ----------------------------------------- |
| 1️⃣   | Lê dados de saldos e despesas por parcela |
| 2️⃣   | Gera prompts personalizados               |
| 3️⃣   | Envia ao modelo de IA                     |
| 4️⃣   | Retorna decisão em JSON                   |
| 5️⃣   | Disponibiliza via terminal ou API Flask   |

---
