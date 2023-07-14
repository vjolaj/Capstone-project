from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, SelectField
from wtforms.validators import DataRequired, Length

class MembersForm(FlaskForm):
    username=StringField('Username')
    # description = StringField('Description', validators=[DataRequired(), Length(max=255)])
    # imageUrl = StringField('ImageUrl', validators=[DataRequired()])
