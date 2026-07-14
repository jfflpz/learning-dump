from sqlalchemy import text
from database import engine
from models import Base
  
def init():
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
        conn.commit()
        
    Base.metadata.create_all(bind=engine)
    print("Database initialized! Tables created successfully.")
  
if __name__ == "__main__":
    init()
