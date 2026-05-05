# main.py — FINAL REVIEW-STABLE VERSION (FocusMate++ Backend)

import os
import time
import pandas as pd
from typing import Optional

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Internal imports
from model_loader import load_model_if_present
from utils import preprocess_frame_b64, heuristic_predict, auto_brightness
from auth import init_db, create_user, verify_user, decode_token, log_event
from study_ai import answer_question_from_document
from focus_report import generate_focus_report   # ✅ NEW

# -------------------------------------------------
# INIT
# -------------------------------------------------
BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "fm_db.sqlite")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)
init_db()

app = FastAPI(title="FocusMate++ Backend")

# -------------------------------------------------
# CORS — FIXED (NO FRONTEND ERRORS)
# -------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # OK for demo & review
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_TYPE, MODEL = load_model_if_present()

# -------------------------------------------------
# REQUEST MODELS
# -------------------------------------------------
class RegisterIn(BaseModel):
    username: str
    password: str


class LoginIn(BaseModel):
    username: str
    password: str


class FrameIn(BaseModel):
    image_b64: str
    token: Optional[str] = None
    task_mode: Optional[str] = None


class AskIn(BaseModel):
    question: str
    path: Optional[str] = None


# -------------------------------------------------
# AUTH ROUTES
# -------------------------------------------------
@app.post("/register")
def register(data: RegisterIn):
    if not create_user(data.username, data.password):
        raise HTTPException(status_code=400, detail="Username already exists")
    return {"status": "ok"}


@app.post("/login")
def login(data: LoginIn):
    token = verify_user(data.username, data.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"token": token}


# -------------------------------------------------
# REAL-TIME FOCUS DETECTION
# -------------------------------------------------
@app.post("/predict")
async def predict(frame_in: FrameIn):
    try:
        frame = preprocess_frame_b64(frame_in.image_b64)
        frame = auto_brightness(frame)

        label, score, _, gaze = heuristic_predict(frame)

        uid = decode_token(frame_in.token) if frame_in.token else None
        if uid:
            log_event(
                uid,
                label,
                score,
                gaze_x=float(gaze[0]) if gaze else None,
                gaze_y=float(gaze[1]) if gaze else None,
            )

        reason = (
            "looking away or posture change"
            if label == "distracted"
            else "signs of fatigue or eye closure"
            if label == "drowsy"
            else "stable attention detected"
        )

        return {
            "label": label,
            "score": round(score, 2),
            "reason": reason,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------
# DAILY FOCUS SUMMARY
# -------------------------------------------------
@app.get("/summary/daily/{user_id}")
def daily_summary(user_id: int):
    import sqlite3

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT timestamp, label FROM sessions WHERE user_id=?", (user_id,))
    rows = c.fetchall()
    conn.close()

    if not rows:
        return {"daily": {}}

    df = pd.DataFrame(rows, columns=["ts", "label"])
    df["date"] = pd.to_datetime(df["ts"], unit="s").dt.date

    grouped = df.groupby("date")["label"].value_counts().unstack(fill_value=0)

    results = {}
    for day, row in grouped.iterrows():
        total = row.sum()
        focused = row.get("focused", 0)
        results[str(day)] = {
            "total": int(total),
            "focused": int(focused),
            "percentage": round((focused / total) * 100, 1),
        }

    return {"daily": results}


# -------------------------------------------------
# DETAILED FOCUS REPORT + RECOMMENDATIONS
# -------------------------------------------------
@app.get("/focus/report/{user_id}")
def focus_report(user_id: int):
    import sqlite3

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "SELECT label FROM sessions WHERE user_id=? ORDER BY timestamp DESC LIMIT 3600",
        (user_id,),
    )
    rows = c.fetchall()
    conn.close()

    events = [{"label": r[0]} for r in rows]
    report = generate_focus_report(events)

    if not report:
        return {"message": "No sufficient focus data available"}

    return report


# -------------------------------------------------
# STUDY ASSISTANT — CHATBOT MODE
# -------------------------------------------------
@app.post("/upload_pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    path = os.path.join(UPLOAD_DIR, f"{int(time.time())}_{file.filename}")

    with open(path, "wb") as f:
        f.write(await file.read())

    return {"path": path}


@app.post("/ask")
def ask(data: AskIn):
    if not data.question:
        raise HTTPException(status_code=400, detail="Question is required")

    answer = answer_question_from_document(
        question=data.question,
        path=data.path,
    )

    return {"answer": answer}


# -------------------------------------------------
# HEALTH CHECK
# -------------------------------------------------
@app.get("/health")
def health():
    return {
        "status": "running",
        "model": MODEL_TYPE or "heuristic",
    }
