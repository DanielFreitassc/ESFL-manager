import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from models import db
from schemas import CostCenterSchema
from ai_analysis import consultar_dados_parcela, gerar_planejamento_ia
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


DB_HOST = os.getenv("PG_HOST")
DB_PORT = os.getenv("PG_PORT")
DB_USER = os.getenv("PG_USER")
DB_PASS = os.getenv("PG_PASSWORD")
DB_NAME = os.getenv("PG_DATABASE")
DB_SSL = os.getenv("PG_SSLMODE", "require")

if not all([DB_HOST, DB_USER, DB_NAME]):
    raise EnvironmentError("As variáveis PG_HOST, PG_USER e PG_DATABASE devem estar definidas.")

SQLALCHEMY_DATABASE_URI = (
    f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}?sslmode={DB_SSL}"
)

app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

@app.route("/cost-centers", methods=["GET"])
def get_cost_centers():
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
        }), 200

    except Exception as e:
        print(f"Erro ao buscar centros de custo: {e}")
        return jsonify({"message": "Erro ao buscar centros de custo.", "error": str(e)}), 500


@app.route("/parcels/<uuid:parcel_id>/planning", methods=["GET"])
def get_parcel_planning(parcel_id):
    with app.app_context():
        dados_parcela = consultar_dados_parcela(str(parcel_id))

    if not dados_parcela:
        return jsonify({"message": f"Parcela com ID {parcel_id} não encontrada."}), 404

    try:
        planejamento = gerar_planejamento_ia(dados_parcela)

        if "error" in planejamento:
            return jsonify(planejamento), 500

        return jsonify(planejamento), 200

    except Exception as e:
        print(f"Erro na IA: {e}")
        return jsonify({"message": "Erro ao gerar planejamento.", "error": str(e)}), 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    port = int(os.getenv("PORT", 5000))

    app.run(host="0.0.0.0", port=port, debug=False)
