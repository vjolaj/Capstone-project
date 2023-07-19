from .db import db, environment, SCHEMA, add_prefix_for_prod

class SettlementTransaction(db.Model):
    __tablename__ = 'settlement_transactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    payer_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    payee_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("groups.id")), nullable=False)
    amount = db.Column(db.Numeric(4, 2), nullable=False)
    is_settled = db.Column(db.Boolean)
    
    payer = db.relationship('User', back_populates='payments_sent', foreign_keys=[payer_id])
    payee = db.relationship('User', back_populates='payments_received', foreign_keys=[payee_id])
    group = db.relationship('Group', back_populates='settlement_transactions', foreign_keys=[group_id])
    payments = db.relationship('Payment', back_populates='payment_settlement_transaction', foreign_keys='Payment.settlement_transaction_id')

    def to_dict(self):
        return {
            'id': self.id,
            'payer_id': self.payer_id,
            'payee_id': self.payee_id,
            'payee_username': self.payee.username,
            'amount': self.amount,
            'is_settled': self.is_settled
        }
    
    