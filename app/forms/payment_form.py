from flask_wtf import FlaskForm
from wtforms import SelectField
from wtforms.validators import DataRequired

class PaymentForm(FlaskForm):
    method = SelectField('Payment Method', choices=[('Cash', 'Cash'), ('Venmo', 'Venmo'), ('PayPal', 'PayPal')], validators=[DataRequired()])
