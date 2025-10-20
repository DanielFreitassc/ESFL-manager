import uuid
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
from enum import Enum

db = SQLAlchemy()

class CostType(Enum):
    OPERATING = "custeio"
    OPERATING_CAPITAL_FOOD = "custeio capital e merenda"
    OPERATING_CAPITAL = "custeio capital"
    PERSONNEL_CONSUMPTION_SERVICE_CAPITAL = "pessoal consumo serviço e capital"

class CostCenter(db.Model):
    _tablename_ = "cost_centers"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String, nullable=False)
    type = db.Column(db.Enum(CostType), nullable=False)
    approved = db.Column(db.Boolean, default=False)