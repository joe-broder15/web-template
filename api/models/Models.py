from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, DateTime
import datetime


Base = declarative_base()

# user model
class User(Base):
    #define our table
    __tablename__ = 'user'
    username = Column(String(20), primary_key=True, unique=True)
    email = Column(String(60), default="post text", nullable=False, unique=True)
    # password_salt = Column(String(60), default="post text", nullable=False,unique=True)
    password_hash = Column(String(60), default="post text", nullable=False)
    privilege = Column(Integer, nullable=False, default=1)

# post model
class Post(Base):
    #define our table
    __tablename__ = 'post'
    id = Column(Integer, primary_key=True)
    text = Column(String(20), default="post text", nullable=False)
    title = Column(String(250), default="post title", nullable=False)
    created_date = Column(DateTime, default=datetime.datetime.utcnow)        
    user = Column(String(20), ForeignKey('user.username'), nullable=False)  

# token blacklist
class BlackListToken(Base):
    __tablename__ = 'token_blacklist'
    token = Column(String(60), nullable=False, primary_key=True)

# create session maker
engine = create_engine('sqlite:///sqlalchemy_example.db')
Base.metadata.create_all(engine)
DBSession = sessionmaker(bind=engine)