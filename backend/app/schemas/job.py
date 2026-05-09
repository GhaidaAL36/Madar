from marshmallow import Schema, fields


class JobSchema(Schema):
    id = fields.Str()
    icon = fields.Str()
    titleAr = fields.Str(attribute="title_ar")
    titleEn = fields.Str(attribute="title_en")
    descriptionPrimary = fields.Str(attribute="description_primary")
    descriptionSecondary = fields.Str(attribute="description_secondary")
    skills = fields.List(fields.Str())


class TaskSchema(Schema):
    id = fields.Int()
    type = fields.Str()
    title = fields.Str()
    fullTitle = fields.Str(attribute="full_title")
    duration = fields.Str()
    timeRange = fields.Str(attribute="time_range")
    description = fields.Str()
    willLearn = fields.List(fields.Str(), attribute="will_learn")
    willDo = fields.List(fields.Str(), attribute="will_do")


class JobWithTasksSchema(Schema):
    id = fields.Str()
    icon = fields.Str()
    titleAr = fields.Str(attribute="title_ar")
    titleEn = fields.Str(attribute="title_en")
    descriptionPrimary = fields.Str(attribute="description_primary")
    descriptionSecondary = fields.Str(attribute="description_secondary")
    skills = fields.List(fields.Str())
    tasks = fields.List(fields.Nested(TaskSchema))
