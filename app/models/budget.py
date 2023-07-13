from .db import db, environment, SCHEMA, add_prefix_for_prod

class Budget(db.Model):
    __tablename__ = 'budgets'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    category = db.Column(db.String, nullable=False)
    amount = db.Column(db.Numeric(4, 2), nullable=False)
    within_budget = db.Column(db.Boolean)

    
    user = db.relationship('User', back_populates='budgets')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category': self.category,
            'amount': self.amount,
            'within_budget': self.within_budget
        }
    
    