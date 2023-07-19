from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, SelectField, DecimalField
from wtforms.validators import DataRequired, Length

class ExpenseForm(FlaskForm):
    amount=DecimalField('Amount', validators=[DataRequired()])
    description = StringField('Description', validators=[DataRequired(), Length(max=255)])
    category = SelectField('Item Type', choices=[('Transportation', 'Transportation'), ('Housing', 'Housing'), ('Utilities', 'Utilities'), ('Food', 'Food'), ('Entertainment', 'Entertainment')], validators=[DataRequired()])
    imageUrl = StringField('ImageUrl')