from .db import db, environment, SCHEMA, add_prefix_for_prod

class GroupMember(db.Model):
    __tablename__ = 'group_members'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("groups.id")), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    
    user = db.relationship('User', back_populates='groups')
    group = db.relationship('Group', back_populates='group_members')

    