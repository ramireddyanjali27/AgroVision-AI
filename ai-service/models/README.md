Place trained model files here.

For the mock version, no model is required. To integrate a real model:

1. Add a `TensorFlowPredictor` / `PyTorchPredictor` class in
   `app/predictor/` implementing `predict(image_bytes) -> dict`.
2. Place your `.h5` / `.pt` weights in this directory.
3. Swap the predictor in `app/main.py`.
