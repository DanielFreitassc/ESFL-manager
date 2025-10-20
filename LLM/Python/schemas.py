from marshmallow import Schema, fields

class CostCenterSchema(Schema):
    id = fields.UUID()
    name = fields.Str()
    type = fields.Str(attribute="type.name")