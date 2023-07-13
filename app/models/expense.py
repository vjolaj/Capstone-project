from .db import db, environment, SCHEMA, add_prefix_for_prod

class Expense(db.Model):
    __tablename__ = 'expenses'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric(4, 2), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("groups.id")), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime)
    imageUrl = db.Column(db.String(255))
    is_settled = db.Column(db.Boolean, nullable=False)
    
    creator = db.relationship('User', back_populates='expenses')
    group = db.relationship('Group', back_populates='expenses')
    comments = db.relationship('Comment', back_populates='expense')
    payments = db.relationship('Payment', back_populates='expense')

    def to_dict(self):
        return {
            'id': self.id,
            'amount': self.amount,
            'creator_id': self.creator_id,
            'group_id': self.group_id,
            'description': self.description,
            'category': self.category,
            'created_at': self.created_at,
            'imageUrl': self.imageUrl,
            'is_settled': self.is_settled
        }
    
    