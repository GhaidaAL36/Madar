from marshmallow import Schema, fields


class SkillSchema(Schema):
    label = fields.Str()
    value = fields.Int()
    color = fields.Str()


class AnswerReviewItemSchema(Schema):
    text = fields.Str()
    correct = fields.Bool()


class AnswerReviewSchema(Schema):
    title = fields.Str()
    items = fields.List(fields.Nested(AnswerReviewItemSchema))


class ReviewSchema(Schema):
    id = fields.Str()
    score = fields.Int()
    fitPercent = fields.Int(attribute="fit_percent")
    fitSummary = fields.Str(attribute="fit_summary")
    strengths = fields.List(fields.Str())
    improvements = fields.List(fields.Str())
    detailedFeedback = fields.List(fields.Str(), attribute="detailed_feedback")
    skills = fields.List(fields.Nested(SkillSchema), attribute="skills_json")
    answerReview = fields.List(
        fields.Nested(AnswerReviewSchema), attribute="answer_review_json"
    )
