from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os

app = FastAPI(title="Smart Health ML Service", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "model.pkl"
model = None

if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        print("[ML] Model loaded successfully")
    except Exception:
        print("[ML] Note: Using epidemiological prediction engine (placeholder model)")
else:
    print("[ML] No model.pkl found, using epidemiological prediction engine")


class Features(BaseModel):
    features: dict


@app.get("/")
def root():
    return {"message": "Smart Health ML Service Running", "status": "online"}


@app.post("/predict")
def predict(data: Features):
    features = data.features

    if model is not None:
        try:
            df = pd.DataFrame([features])
            prob = model.predict_proba(df)[:, 1][0]
            return {"probability": float(prob), "source": "model"}
        except Exception as e:
            print("[ML] Model prediction error:", e)

    # Dynamic epidemiological risk score calculation based on symptom cluster
    symptoms = features.get("symptoms", [])
    if isinstance(symptoms, str):
        symptoms = [s.strip().lower() for s in symptoms.split(",")]
    elif isinstance(symptoms, list):
        symptoms = [str(s).lower() for s in symptoms]
    else:
        symptoms = []

    base_score = 0.25
    high_risk_keywords = ["fever", "cough", "breath", "chills", "vomit", "diarrhea", "rash", "joint"]
    for s in symptoms:
        for kw in high_risk_keywords:
            if kw in s:
                base_score += 0.12

    try:
        age = float(features.get("patientAge", 30) or 30)
        if age > 60 or age < 5:
            base_score += 0.10
    except (ValueError, TypeError):
        pass

    prob = min(0.95, max(0.20, base_score))
    return {"probability": round(float(prob), 2), "source": "heuristics"}
