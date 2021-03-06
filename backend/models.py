from sqlalchemy import Column, String, ForeignKey, Integer, DateTime
from database import Base
import datetime

class User(Base):

    __tablename__ = 'users'
    user_name = Column(String(50), unique=True, primary_key=True)
    password = Column(String(50), nullable = False)
    
    def __init__(self, name = None, password = None):
        self.user_name = name
        self.password = password

# Don't need __init__ as base provides one
# When creating an instance of message call Message(receiver = "", sender = "", message = "")
class Message(Base):
    __tablename__ = 'messages'
    id = Column(Integer, primary_key = True)
    receiver = Column(String(50), ForeignKey("users.user_name"), nullable = False)
    sender = Column(String(50), ForeignKey("users.user_name"), nullable = False)
    message = Column(String, nullable = False)
    time = Column(DateTime, default=datetime.datetime.utcnow)
    encryption = Column(String(50), nullable = False)
    key = Column(String(50), nullable = False)
