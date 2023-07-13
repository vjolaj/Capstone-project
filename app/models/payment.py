from .db import db, environment, SCHEMA, add_prefix_for_prod

class Payment(db.Model):
    __tablename__ = 'payments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    payer_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    payee_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    expense_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("expenses.id")), nullable=False)
    amount = db.Column(db.Numeric(4, 2), nullable=False)
    method_of_payment = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime)
    
    payer = db.relationship('User', back_populates='payments_sent', foreign_keys=[payer_id])
    payee = db.relationship('User', back_populates='payments_received', foreign_keys=[payee_id])
    expense = db.relationship('Expense', back_populates='payments')

    def to_dict(self):
        return {
            'id': self.id,
            'payer_id': self.payer_id,
            'payee_id': self.payee_id,
            'amount': self.amount,
            'method_of_payment': self.method_of_payment,
            'category': self.category,
            'created_at': self.created_at
        }
    
    