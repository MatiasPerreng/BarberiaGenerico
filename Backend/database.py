from sqlalchemy import create_engine    
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = "mysql+pymysql://root:1234@localhost/barber"

engine = create_engine(DATABASE_URL, pool_recycle=3600, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



        # DATABASE_URL = "mysql+pymysql://root:1234@localhost/barber"


        # DATABASE_URL = "mysql+pymysql://root:T0d050ft!@localhost:3307/barber"
