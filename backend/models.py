from sqlalchemy import Column, String
from database import Base

class User(Base):
    __tablename__ = 'users'
    user_name = Column(String(50), unique=True, primary_key=True)
    public_key = Column(String(120))

    def __init__(self, name=None):
        self.user_name = name
        #TODO: replace this with DH or RSA public key generation
        self.public_key = '00112233445566778899aabbccddeeff'