from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
import os

# Load from .env if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# --- Database URL Configuration ---
# By default uses SQLite (zero config). Set DATABASE_URL in .env to switch to MySQL:
# DATABASE_URL=mysql+pymysql://user:password@localhost:3306/interviewx

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./interviewx.db"
)

# SQLite needs special arg; MySQL does not
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
