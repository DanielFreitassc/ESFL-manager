import os
import json
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from models import db, CostCenter
from schemas import CostCenterSchema

# IA Gemini
import google.generativeai as genai
from promptPadrao import system_prompt

# --------------------------
# 1. Configuração inicial
# --------------------------
load_dotenv()

app = Flask(__name__)

# Configuração do banco PostgreSQL
db_url = os.getenv("POSTGRES_HOST_URL")
db_user = os.getenv("POSTGRES_USER")
db_pass = os.getenv("POSTGRES_PASSWORD")

if db_url and db_url.startswith("postgresql://") and db_user and db_pass and "@" not in db_url:
    db_url = db_url.replace("postgresql://", f"postgresql://{db_user}:{db_pass}@")

app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

# --------------------------
# Função auxiliar
# --------------------------
def _extract_json_text(text: str):
    """Remove cercas de markdown e retorna a string JSON crua."""
    if not isinstance(text, str):
        return None
    t = text.strip()
    fence = "`" * 3
    if t.startswith(fence):
        lines = t.splitlines()
        if lines and lines[0].strip() == fence:
            lines = lines[1:]
        if lines and lines[-1].strip() == fence:
            lines = lines[:-1]
        t = "\n".join(lines).strip()
    return t

# --------------------------
# 🧠 Endpoint unificado
# --------------------------
@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Endpoint unificado:
    1. Consulta centros de custo aprovados no banco.
    2. Envia dados do usuário para IA Gemini.
    3. Retorna ambos os resultados juntos.
    """
    # --- 1) Leitura e validação do JSON de entrada ---
    try:
        user_data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "JSON inválido no corpo da requisição."}), 400

    if not user_data:
        return jsonify({"error": "JSON body obrigatório com campos: category, notes, amount."}), 400

    missing = [k for k in ["category", "notes", "amount"] if k not in user_data]
    if missing:
        return jsonify({"error": f"Campos ausentes: {', '.join(missing)}"}), 400

    try:
        amount = float(user_data["amount"])
    except Exception:
        return jsonify({"error": "amount deve ser numérico."}), 400

    category = str(user_data["category"]).strip()
    notes = str(user_data["notes"]).strip()

    # --- 2) Consulta ao banco de dados ---
    try:
        cost_centers = CostCenter.query.filter_by(approved=True).all()
        schema = CostCenterSchema(many=True)
        cost_center_data = schema.dump(cost_centers)
    except Exception as e:
        return jsonify({"error": f"Erro ao consultar banco: {e}"}), 500

    # --- 3) Integração com Gemini ---
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return jsonify({"error": "GEMINI_API_KEY não configurada."}), 500

    genai.configure(api_key=api_key)

    user_input = f"""
Requisição de nova despesa:

Categoria: {category}
Descrição: {notes}
Valor: R$ {amount:.2f}
"""

    prompt = (
        f"{system_prompt}\n\n"
        f"{user_input}\n\n"
        "Retorne somente o array JSON válido, sem markdown, sem comentários, sem crases."
    )

    try:
        model = genai.GenerativeModel("gemini-2.5-pro")
        response = model.generate_content(prompt)

        raw_text = response.text or ""
        json_text = _extract_json_text(raw_text)

        try:
            parsed_ai = json.loads(json_text)
        except Exception:
            start = json_text.find("[")
            end = json_text.rfind("]")
            if start != -1 and end != -1:
                parsed_ai = json.loads(json_text[start:end+1])
            else:
                return jsonify({
                    "error": "A resposta da IA não pôde ser interpretada como JSON.",
                    "raw": raw_text
                }), 502
    except Exception as e:
        return jsonify({"error": f"Erro na integração com IA: {e}"}), 500

    # --- 4) Retorno unificado ---
    return jsonify({
        "database_results": cost_center_data,
        "ai_simulation": parsed_ai
    }), 200

# --------------------------
# 🏠 Rota raiz
# --------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "🚀 API AFASC unificada está rodando!",
        "available_endpoints": {
            "/analyze": "Consulta centros de custo + simulação IA (POST)"
        }
    }), 200

# --------------------------
# Inicialização
# --------------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)