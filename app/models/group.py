from .db import db, environment, SCHEMA, add_prefix_for_prod

class Group(db.Model):
    __tablename__ = 'groups'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=False)
    imageUrl = db.Column(db.String(255), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False )
    
    expenses = db.relationship('Expense', back_populates='group')
    group_members = db.relationship('GroupMember', back_populates='group', cascade='all, delete-orphan')
    creator = db.relationship('User', back_populates='created_groups')
    settlement_transactions = db.relationship('SettlementTransaction', back_populates='group', foreign_keys='SettlementTransaction.group_id')

    def to_dict(self):
        members = [member.user.username for member in self.group_members]
        return {
            'id': self.id,
            'group_name': self.group_name,
            'description': self.description,
            'imageUrl': self.imageUrl,
            'creator_id': self.creator_id,
            'members': members
        }
    
    
    
    