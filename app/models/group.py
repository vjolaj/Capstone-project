from .db import db, environment, SCHEMA, add_prefix_for_prod

class Group(db.Model):
    __tablename__ = 'groups'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=False)
    imageUrl = db.Column(db.String(255), nullable=False)
    
    expenses = db.relationship('Expense', back_populates='group')
    group_members = db.relationship('GroupMember', back_populates='group', cascade='all, delete-orphan')

    def to_dict(self):
        members = [member.user.username for member in self.group_members]
        return {
            'id': self.id,
            'group_name': self.group_name,
            'description': self.description,
            'imageUrl': self.imageUrl,
            'members': members
        }
    
    
    
    