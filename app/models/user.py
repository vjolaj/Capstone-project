from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    firstName = db.Column(db.String(255), nullable=False)
    lastName = db.Column(db.String(255), nullable=False)
    
    groups = db.relationship('GroupMember', back_populates='user', cascade='all, delete-orphan')
    expenses = db.relationship('Expense', back_populates='creator')
    comments = db.relationship('Comment', back_populates='user')
    budgets = db.relationship('Budget', back_populates='user')
    payments_sent = db.relationship('Payment', back_populates='payer', foreign_keys='Payment.payer_id')
    payments_received = db.relationship('Payment', back_populates='payee', foreign_keys='Payment.payee_id')
    groups = db.relationship('Group', back_populates='users')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'firstName': self.firstName,
            'lastName': self.lastName
        }
