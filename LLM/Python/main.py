import os
import json

from flask import Flask, jsonify, request
from dotenv import load_dotenv

from models import db, CostCenter
from schemas import CostCenterSchema

# IA
import google.generativeai as genai

from promptPadrao import system_prompt
from promptUsuario import new_expense

# --------------------------
# 1. Carregar variáveis de ambiente
# --------------------------
load_dotenv()

app = Flask(__name__)

# Configuração do banco PostgreSQL
db_url = os.getenv("POSTGRES_HOST_URL")
db_user = os.getenv("POSTGRES_USER")
db_pass = os.getenv("POSTGRES_PASSWORD")

# Ajusta a URL se necessário (injeta user:pass quando a URL base não possui credenciais)
if db_url and db_url.startswith("postgresql://") and db_user and db_pass and "@" not in db_url:
    db_url = db_url.replace("postgresql://", f"postgresql://{db_user}:{db_pass}@")

app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

# --------------------------
# 🏠 Rota raiz
# --------------------------
@app.route("/", methods=["GET"])
def home():
    """Exibe mensagem de status da API"""
    return jsonify({
        "message": "🚀 API AFASC está rodando!",
        "available_endpoints": {
            "/cost-centers": "Listar centros de custo aprovados (GET)",
            "/simulate-ai": "Gerar simulação com IA Gemini (POST)"
        }
    }), 200

# --------------------------
# 2. Endpoint para Cost Centers
# --------------------------
@app.route("/cost-centers", methods=["GET"])
def get_cost_centers():
    page = int(request.args.get("page", 0))
    size = int(request.args.get("size", 10))

    query = CostCenter.query.filter_by(approved=True)
    pagination = query.paginate(page=page + 1, per_page=size, error_out=False)

    schema = CostCenterSchema(many=True)
    data = schema.dump(pagination.items)

    return jsonify({
        "content": data,
        "page": page,
        "size": size,
        "totalElements": pagination.total,
        "totalPages": pagination.pages,
    }), 200

# --------------------------
# 3. Endpoint de simulação com IA Gemini
# --------------------------
def _extract_json_text(text: str):
    """Remove cercas de markdown e retorna a string JSON crua."""
    if not isinstance(text, str):
        return None
    t = text.strip()
    fence = "`" * 3  # evita escrever crases literais no código
    if t.startswith(fence):
        lines = t.splitlines()
        if lines and lines.startswith(fence):
            lines = lines[1:]
        if lines and lines[-1].strip() == fence:
            lines = lines[:-1]
        t = "\n".join(lines).strip()
    return t

@app.route("/simulate-ai", methods=["POST"])
def simulate_ai():
    """
    Endpoint para testar a integração com a IA Gemini.
    Envia o prompt padrão + dados do usuário e retorna JSON válido.
    """
    # 1) Força leitura de JSON do body; se não vier, retorna 400
    try:
        user_data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "JSON inválido no corpo da requisição."}), 400

    if not user_data:
        return jsonify({"error": "JSON body obrigatório com campos: category, notes, amount."}), 400

    # 2) Validação mínima dos campos
    missing = [k for k in ["category", "notes", "amount"] if k not in user_data]
    if missing:
        return jsonify({"error": f"Campos ausentes: {', '.join(missing)}"}), 400

    try:
        amount = float(user_data["amount"])
    except Exception:
        return jsonify({"error": "amount deve ser numérico."}), 400

    category = str(user_data["category"]).strip()
    notes = str(user_data["notes"]).strip()

    # 3) Configuração da chave Gemini
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return jsonify({"error": "GEMINI_API_KEY não configurada no ambiente."}), 500

    genai.configure(api_key=api_key)

    # 4) Monta o prompt final
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

        # 5) Tenta fazer o parse do JSON gerado
        try:
            parsed = json.loads(json_text)
        except Exception:
            start = json_text.find("[")
            end = json_text.rfind("]")
            if start != -1 and end != -1 and end > start:
                candidate = json_text[start:end+1]
                parsed = json.loads(candidate)
            else:
                return jsonify({
                    "error": "A resposta da IA não pôde ser interpretada como JSON.",
                    "raw": raw_text
                }), 502

        # 6) Retorna já como JSON válido estruturado
        return jsonify({"items": parsed}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --------------------------
# 4. Inicialização da aplicação
# --------------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)
