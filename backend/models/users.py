from sqlalchemy import Column, String
from .. import database

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    user_name = Column(String(50), unique=True)
    public_key = Column(String(120))

    def __init__(self, name=None, email=None):
        self.username = name
        #TODO: replace this with DH or RSA public key generation
        self.public_key = '00112233445566778899aabbccddeeff'