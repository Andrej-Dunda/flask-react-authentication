from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return str(uuid4().hex)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid, unique=True)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)