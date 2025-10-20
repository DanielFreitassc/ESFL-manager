import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from models import db, CostCenter
from schemas import CostCenterSchema

load_dotenv()

app = Flask(__name__)

# Montar URL a partir das variáveis de ambiente
db_url = os.getenv("POSTGRES_HOST_URL")
db_user = os.getenv("POSTGRES_USER")
db_pass = os.getenv("POSTGRES_PASSWORD")

# Ajusta caso a URL já venha sem usuário/senha
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", f"postgresql://{db_user}:{db_pass}@")

app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

@app.route("/cost-centers", methods=["GET"])
def get_cost_centers():
    # paginação estilo Spring Data (page, size)
    page = int(request.args.get("page", 0))
    size = int(request.args.get("size", 10))

    query = CostCenter.query.filter_by(approved=True)
    pagination = query.paginate(page=page + 1, per_page=size, error_out=False)  # Flask usa 1-based

    schema = CostCenterSchema(many=True)
    data = schema.dump(pagination.items)

    return jsonify({
        "content": data,
        "page": page,
        "size": size,
        "totalElements": pagination.total,
        "totalPages": pagination.pages,
    })

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
