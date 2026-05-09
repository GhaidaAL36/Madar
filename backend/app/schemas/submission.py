from marshmallow import Schema, fields, validate

class CodeSubmissionSchema(Schema):
    code = fields.Str(required=True)

class DataSubmissionSchema(Schema):
    analysis = fields.Str(required=True)
    checkedFindings = fields.List(fields.Str(), load_default=[])

class PMSubmissionSchema(Schema):
    analysis = fields.Str(required=True)