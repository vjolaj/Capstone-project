from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Payment(db.Model):
    __tablename__ = 'payments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    settlement_transaction_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("settlement_transactions.id")), nullable=False)
    payer_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    payee_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("groups.id")), nullable=False)
    amount = db.Column(db.Numeric, nullable=False)
    method= db.Column(db.String, nullable=False)
    paid_at = db.Column(db.DateTime, default=datetime.now())
    
    payment_payer = db.relationship('User', back_populates='settled_payments_sent', foreign_keys=[payer_id])
    payment_payee = db.relationship('User', back_populates='settled_payments_received', foreign_keys=[payee_id])
    payment_group = db.relationship('Group', back_populates='settled_payments', foreign_keys=[group_id])
    payment_settlement_transaction = db.relationship('SettlementTransaction', back_populates='payments', foreign_keys=[settlement_transaction_id])

    def to_dict(self):
        return {
            'id': self.id,
            'payer_id': self.payer_id,
            'payee_id': self.payee_id,
            "payer_username": self.payment_payer.username,
            'payee_username': self.payment_payee.username,
            'amount': self.amount,
            'method': self.method,
            'paid_at': self.paid_at
        }
    