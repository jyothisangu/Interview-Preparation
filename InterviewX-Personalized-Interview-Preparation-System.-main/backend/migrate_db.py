import sqlite3

def migrate():
    conn = sqlite3.connect('interviewx.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN readiness_score FLOAT DEFAULT 0.0")
    except sqlite3.OperationalError:
        print("readiness_score already exists")
        
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN previous_readiness_score FLOAT DEFAULT 0.0")
    except sqlite3.OperationalError:
        print("previous_readiness_score already exists")
        
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN weak_areas JSON DEFAULT '[]'")
    except sqlite3.OperationalError:
        print("weak_areas already exists")
        
    conn.commit()
    conn.close()
    print("Migration complete")

if __name__ == "__main__":
    migrate()
