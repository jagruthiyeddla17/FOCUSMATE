# utils.py — STABLE ATTENTION DETECTION (REVIEW SAFE)

import cv2
import numpy as np
from base64 import b64decode
from PIL import Image
from io import BytesIO

FACE_CASCADE = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
EYE_CASCADE = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_eye.xml"
)

def preprocess_frame_b64(b64_img):
    if b64_img.startswith("data:image"):
        b64_img = b64_img.split(",", 1)[1]
    data = b64decode(b64_img)
    img = Image.open(BytesIO(data)).convert("RGB")
    return np.array(img)[:, :, ::-1].copy()

def auto_brightness(frame):
    lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.equalizeHist(l)
    return cv2.cvtColor(cv2.merge((l, a, b)), cv2.COLOR_LAB2BGR)

def heuristic_predict(frame):
    frame = auto_brightness(frame)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = FACE_CASCADE.detectMultiScale(gray, 1.2, 5)

    # -------------------------
    # NO FACE → DISTRACTED
    # -------------------------
    if len(faces) == 0:
        return "distracted", 0.4, gray, None

    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    roi_gray = gray[y:y+h, x:x+w]

    eyes = EYE_CASCADE.detectMultiScale(roi_gray, 1.2, 8)
    brightness = np.mean(roi_gray) / 255.0

    # -------------------------
    # DROWSY LOGIC
    # -------------------------
    if len(eyes) == 0 and brightness < 0.35:
        return "drowsy", 0.75, gray, (0.5, 0.6)

    # -------------------------
    # DISTRACTED LOGIC
    # -------------------------
    if len(eyes) > 0:
        ex, ey, ew, eh = eyes[0]
        eye_center_y = ey + eh / 2
        if eye_center_y > h * 0.7:
            return "distracted", 0.6, gray, (0.5, 0.7)

    # -------------------------
    # DEFAULT → FOCUSED
    # -------------------------
    return "focused", 0.95, gray, (0.5, 0.4)
