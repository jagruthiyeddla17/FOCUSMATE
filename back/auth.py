import sqlite3
import time
import jwt
from passlib.hash import pbkdf2_sha256

SECRET_KEY = "FOCUSMATE_SECRET_123"
DB_PATH = "fm_db.sqlite"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # users table
    c.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password_hash TEXT
    )
    """)

    # session logs table
    c.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        timestamp REAL,
        label TEXT,
        score REAL,
        gaze_x REAL,
        gaze_y REAL
    )
    """)

    conn.commit()
    conn.close()


def create_user(username, password):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    hashed = pbkdf2_sha256.hash(password)

    try:
        c.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username, hashed))
        conn.commit()
        conn.close()
        return True
    except Exception:
        conn.close()
        return False


def verify_user(username, password):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute("SELECT id, password_hash FROM users WHERE username=?", (username,))
    row = c.fetchone()
    conn.close()

    if not row:
        return None

    user_id, stored_hash = row

    if not pbkdf2_sha256.verify(password, stored_hash):
        return None

    payload = {
        "uid": user_id,
        "exp": time.time() + 3600 * 12
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token


def decode_token(token):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded["uid"]
    except:
        return None


def log_event(user_id, label, score, gaze):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    gx = gaze[0] if gaze else None
    gy = gaze[1] if gaze else None

    c.execute(
        "INSERT INTO sessions(user_id, timestamp, label, score, gaze_x, gaze_y) VALUES (?, ?, ?, ?, ?, ?)",
        (user_id, time.time(), label, score, gx, gy)
    )

    conn.commit()
    conn.close()
