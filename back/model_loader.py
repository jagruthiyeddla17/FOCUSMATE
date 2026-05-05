# model_loader.py
import os
def load_model_if_present(path="model.h5"):
    # placeholder - if you place a Keras model here, main will attempt to use it
    if os.path.exists(path):
        try:
            from tensorflow.keras.models import load_model
            m = load_model(path)
            print("[Model Loader] loaded keras model")
            return ("keras", m)
        except Exception as e:
            print("model load error", e)
    return (None, None)
