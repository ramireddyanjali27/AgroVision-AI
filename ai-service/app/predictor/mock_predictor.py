"""
MockPredictor - a realistic mock disease detection service.

Since a trained TensorFlow/PyTorch model is not bundled with the initial
version, this class simulates the model output. It:

  * Determines a plant + disease deterministically from the file hash so the
    same image yields a stable result during demos.
  * Returns confidence, severity, description, causes, treatment and
    prevention in the exact JSON shape the frontend expects.

To integrate a real model, create a TensorFlowPredictor (or PyTorchPredictor)
with the same `predict(image_bytes) -> dict` method and swap it into
app.main.
"""

import hashlib
import io
from typing import Dict

try:
    from PIL import Image

    _HAS_PIL = True
except ImportError:  # pragma: no cover
    _HAS_PIL = False

# Each entry: (plant, category, disease, disease_description)
_SAMPLES = [
    ("Tomato", "Vegetable", "Early Blight",
     "A fungal disease caused by Alternaria solani that affects the leaves, stems and fruit of tomato plants, producing dark spots with concentric rings."),
    ("Tomato", "Vegetable", "Late Blight",
     "A serious fungal disease caused by Phytophthora infestans that rapidly destroys tomato foliage and fruit in cool, wet conditions."),
    ("Tomato", "Vegetable", "Leaf Mold",
     "A fungal disease caused by Passalora fulva that affects tomato leaves in humid conditions, causing yellow spots and gray mold."),
    ("Potato", "Vegetable", "Early Blight",
     "A fungal disease caused by Alternaria solani affecting potato leaves and tubers with brown, target-like spots."),
    ("Potato", "Vegetable", "Late Blight",
     "A devastating fungal disease caused by Phytophthora infestans affecting potato plants causing water-soaked spots."),
    ("Apple", "Fruit", "Black Rot",
     "A fungal disease caused by Botryosphaeria obtusa affecting apple fruit and leaves, producing purple spots and shrivelled fruit."),
    ("Apple", "Fruit", "Apple Scab",
     "A fungal disease caused by Venturia inaequalis affecting apple leaves and fruit, producing olive-green to black scabby lesions."),
    ("Corn", "Grain", "Common Rust",
     "A fungal disease caused by Puccinia sorghi affecting corn leaves, producing reddish-brown pustules filled with spores."),
    ("Corn", "Grain", "Northern Leaf Blight",
     "A fungal disease caused by Setosphaeria turcica affecting corn leaves, producing long cigar-shaped gray-green lesions."),
    ("Grape", "Fruit", "Black Rot",
     "A fungal disease caused by Guignardia bidwellii affecting grape leaves and fruit, causing brown spots and mummified berries."),
    ("Strawberry", "Fruit", "Leaf Scorch",
     "A fungal disease caused by Diplocarpon earlianum affecting strawberry leaves, producing purplish spots."),
    ("Bell Pepper", "Vegetable", "Bacterial Spot",
     "A bacterial disease affecting bell pepper leaves and fruit, producing small water-soaked spots that turn brown."),
    ("Citrus", "Fruit", "Citrus Greening",
     "A serious bacterial disease affecting citrus trees, causing yellowing leaves and misshapen, bitter fruit."),
]

_STANDARD_CAUSES = [
    "Fungal infection",
    "High humidity",
    "Poor air circulation",
    "Warm, wet weather",
]

_STANDARD_TREATMENT = [
    "Remove and dispose of infected leaves",
    "Improve air circulation around plants",
    "Avoid overhead watering",
    "Apply appropriate agricultural fungicide",
]

_STANDARD_PREVENTION = [
    "Regular plant inspection",
    "Use disease-resistant seeds",
    "Maintain proper plant spacing",
    "Keep the growing area clean",
]


class MockPredictor:
    """Simulates a plant disease detection model."""

    # A small chance of returning a "Healthy" result gives variety.
    HEALTHY_THRESHOLD = 0.18

    def predict(self, image_bytes: bytes) -> Dict:
        digest = hashlib.sha256(image_bytes).hexdigest()
        # Deterministic seed in [0, 100)
        seed = int(digest[:4], 16) % 100

        # Healthy ~18% of the time (still deterministic per image).
        if seed < self.HEALTHY_THRESHOLD * 100:
            return self._healthy_result(seed)

        plant, category, disease, description = _SAMPLES[seed % len(_SAMPLES)]
        confidence = 70.0 + (seed % 29)  # 70-98 %

        return {
            "plantName": plant,
            "plantCategory": category,
            "healthStatus": "Diseased",
            "diseaseName": disease,
            "confidence": round(confidence, 1),
            "severity": self._severity(confidence),
            "description": description,
            "causes": _STANDARD_CAUSES,
            "treatment": _STANDARD_TREATMENT,
            "prevention": _STANDARD_PREVENTION,
        }

    def _healthy_result(self, seed: int) -> Dict:
        plant = _SAMPLES[seed % len(_SAMPLES)][0]
        category = _SAMPLES[seed % len(_SAMPLES)][1]
        return {
            "plantName": plant,
            "plantCategory": category,
            "healthStatus": "Healthy",
            "diseaseName": "No Disease",
            "confidence": round(88.0 + (seed % 11), 1),
            "severity": "None",
            "description": "The plant appears healthy. No disease symptoms were detected in the uploaded sample.",
            "causes": [],
            "treatment": [],
            "prevention": [
                "Continue regular plant inspection",
                "Maintain proper watering and nutrition",
                "Keep the growing area clean",
                "Use disease-resistant varieties",
            ],
        }

    @staticmethod
    def _severity(confidence: float) -> str:
        if confidence >= 90:
            return "Critical"
        if confidence >= 82:
            return "High"
        if confidence >= 74:
            return "Moderate"
        return "Low"
