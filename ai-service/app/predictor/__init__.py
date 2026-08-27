"""
Prediction provider abstraction.

The real model should implement the `predict(image_bytes) -> dict` contract
so it can be swapped into the FastAPI app without touching the API layer.
"""
