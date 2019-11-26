from sqlalchemy import Column, String
from database import Base

class User(Base):

    __tablename__ = 'users'
    user_name = Column(String(50), unique=True, primary_key=True, nullable = False)
    password = Column(String(50), nullable = False)
    public_key = Column(String(120), nullable = False)
    
    def __init__(self, name = None, password = None):
        self.user_name = name
        self.password = password
        #TODO: replace this with DH or RSA public key generation
        self.public_key = '00112233445566778899aabbccddeeff'

class Message(Base):
    __tablename__ = 'messages'
    receiver = Column(String(50), primary_key=True)
    sender = Column(String(50))
    message = Column(String)

    def __init__(self, receiver, sender, message):
        self.sender = sender
        self.receiver = receiver
        self.message = message