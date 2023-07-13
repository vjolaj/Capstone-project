from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, SelectField
from wtforms.validators import DataRequired, Length

class GroupForm(FlaskForm):
    group_name=StringField('Name', validators=[DataRequired(), Length(max=255)])
    description = StringField('Description', validators=[DataRequired(), Length(max=255)])
    imageUrl = StringField('ImageUrl', validators=[DataRequired()])
