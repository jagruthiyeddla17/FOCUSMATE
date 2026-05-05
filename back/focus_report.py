# focus_report.py — FOCUS ANALYTICS & RECOMMENDATIONS

def generate_focus_report(events):
    total = len(events)
    if total == 0:
        return None

    focused = sum(1 for e in events if e["label"] == "focused")
    distracted = sum(1 for e in events if e["label"] == "distracted")
    drowsy = sum(1 for e in events if e["label"] == "drowsy")

    longest_streak = 0
    current = 0
    for e in events:
        if e["label"] == "focused":
            current += 1
            longest_streak = max(longest_streak, current)
        else:
            current = 0

    report = {
        "total_seconds": total,
        "focused_percent": round(focused / total * 100, 1),
        "distracted_percent": round(distracted / total * 100, 1),
        "drowsy_percent": round(drowsy / total * 100, 1),
        "longest_focus_minutes": round(longest_streak / 60, 1),
    }

    report["tips"] = generate_recommendations(report)
    return report


def generate_recommendations(r):
    tips = []

    if r["focused_percent"] < 60:
        tips.append("Use the Pomodoro technique: 25 minutes study, 5 minutes break.")

    if r["drowsy_percent"] > 20:
        tips.append("Fatigue detected. Try hydrating or taking a short walk.")

    if r["longest_focus_minutes"] < 10:
        tips.append("Reduce distractions and maintain a fixed study posture.")

    if not tips:
        tips.append("Excellent focus maintained. Keep up the good study habits!")

    return tips
