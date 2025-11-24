import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from models import db # Assumindo que db está definido em models.py
from schemas import CostCenterSchema # Assumindo que está em schemas.py
from ai_analysis import consultar_dados_parcela, gerar_planejamento_ia 
from flask_cors import CORS
# 1. Carrega variáveis do arquivo .env
load_dotenv()

app = Flask(__name__)
CORS(app)


DB_HOST = os.getenv("PG_HOST")
DB_PORT = os.getenv("PG_PORT")
DB_USER = os.getenv("PG_USER")
DB_PASS = os.getenv("PG_PASSWORD")
DB_NAME = os.getenv("PG_DATABASE")
DB_SSL = os.getenv("PG_SSLMODE", "require") # Padrão: 'require'

# 🚨 Verifica se as chaves cruciais estão preenchidas para evitar a RuntimeError
if not all([DB_HOST, DB_USER, DB_NAME]):
    raise EnvironmentError(
        "As variáveis PG_HOST, PG_USER e PG_DATABASE devem estar definidas no arquivo .env."
    )

# Monta o URI de conexão no formato que o SQLAlchemy espera
SQLALCHEMY_DATABASE_URI = (
    f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}?sslmode={DB_SSL}"
)

# Define a configuração da aplicação
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Inicializa o banco de dados
db.init_app(app)

# --- ENDPOINTS ---

@app.route("/cost-centers", methods=["GET"])
def get_cost_centers():
    # Este é um endpoint de exemplo que você forneceu.
    # A implementação completa para CostCenter.query.filter_by(approved=True) está faltando aqui,
    # mas mantive o retorno da estrutura esperada.
    
    # paginação estilo Spring Data (page, size)
    page = int(request.args.get("page", 0))
    size = int(request.args.get("size", 10))

    try:
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
        })
    except Exception as e:
        print(f"Erro ao buscar centros de custo: {e}")
        return jsonify({"message": "Erro ao buscar centros de custo.", "error": str(e)}), 500


# 🟢 NOVO ENDPOINT: /parcels/{parcel_id}/planning (Integração com IA)
@app.route("/parcels/<uuid:parcel_id>/planning", methods=["GET"])
def get_parcel_planning(parcel_id):
    """
    Busca dados de uma parcela, consulta o Gemini para gerar um planejamento
    de alocação de recursos e retorna o relatório.
    """
    
    # 1. Busca os dados da Parcela no BD (usando ai_analysis.py)
    # A função consultar_dados_parcela precisa do contexto da aplicação para
    # acessar as variáveis de ambiente do BD.
    with app.app_context():
        dados_parcela = consultar_dados_parcela(str(parcel_id))

    if not dados_parcela:
        return jsonify({"message": f"Parcela com ID {parcel_id} não encontrada ou sem dados."}), 404

    # 2. Gera o relatório de planejamento da IA
    try:
        planejamento = gerar_planejamento_ia(dados_parcela)
        
        # 3. Retorna o planejamento da IA (JSON)
        if "error" in planejamento:
             # Retorna o erro gerado pela IA (ex: JSON mal formatado)
             return jsonify(planejamento), 500
             
        return jsonify(planejamento), 200

    except Exception as e:
        print(f"Erro na geração do planejamento com a IA: {e}")
        return jsonify({"message": "Erro interno ao gerar planejamento financeiro.", "error": str(e)}), 500


if __name__ == "__main__":
    with app.app_context():
        # Cria as tabelas do banco de dados, se não existirem
        db.create_all()
    # Inicia o servidor Flask
    app.run(debug=True)