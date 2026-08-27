"""
AgroVision AI Disease Detection Service

FastAPI service that accepts an uploaded plant image and returns a disease
detection prediction in a well-defined JSON structure.

Architecture:
    The service is designed so the prediction logic is fully isolated in the
    `predictor` module. For now `predictor/mock_predictor.py` returns a
    realistic mock prediction so the whole system runs without a trained model.
    To plug in a real TensorFlow/PyTorch model, simply replace the predictor
    used in app.main with a real model wrapper that implements the same
    `predict(image_bytes) -> dict` contract.

Run locally:
    pip install -r requirements.txt
    uvicorn app.main:app --reload --port 8000
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .predictor.mock_predictor import MockPredictor

app = FastAPI(
    title="AgroVision AI Disease Detection API",
    description="Smart fruit & vegetable disease detection service",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Real model can be swapped here, e.g.:
# predictor = TensorFlowPredictor(model_path="models/plant_disease_model.h5")
predictor = MockPredictor()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"}
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}
MAX_SIZE = 10 * 1024 * 1024


@app.get("/")
def read_root():
    return {"service": "AgroVision AI Disease Detection", "status": "running"}


@app.get("/health")
def health():
    return {"status": "ok", "predictor": type(predictor).__name__}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accepts a single plant/leaf image and returns a disease prediction.

    Response JSON:
        {
          "plantName": "Tomato",
          "healthStatus": "Diseased",
          "diseaseName": "Early Blight",
          "confidence": 94.5,
          "severity": "Moderate",
          "description": "...",
          "causes": ["..."],
          "treatment": ["..."],
          "prevention": ["..."]
        }
    """
    content_type = file.content_type or ""
    extension = file.filename.rsplit(".", 1)[-1].lower() if file.filename else ""

    if content_type not in ALLOWED_CONTENT_TYPES and extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail="Unsupported file type. Please upload a JPG, JPEG or PNG image.",
        )

    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="File size exceeds the 10MB limit.")
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file provided.")

    try:
        result = predictor.predict(contents)
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(exc)}")

    return result
