from sqlalchemy import Column, String
from database import Base

class Message(Base):
    __tablename__ = 'messages'
    reciever = Column(String(50), primary_key=True)
    sender = Column(String(50))
    message = Column(String)

    def __init__(self, reciever, sender, message):
        self.sender = sender
        self.reciever = reciever
        self.message = message