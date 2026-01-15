import os
# Disable all TensorFlow logging and warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress all logging
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"  # Disable OneDNN custom operations
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'  # Disable GPU

import numpy as np
import sys
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array

# Suppress any remaining TensorFlow warnings
tf.get_logger().setLevel('ERROR')

# Force TensorFlow to use CPU
tf.config.set_visible_devices([], 'GPU')

# Determine the base directory (works for both .py and .exe)
if getattr(sys, 'frozen', False):
    BASE_DIR = os.path.dirname(sys.executable)  # When packaged as .exe
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # When running as script

# Set model path relative to the executable location
model_path = os.path.join(BASE_DIR, "new_vgg16_model.keras")
print(model_path)


try:
    with tf.device('/CPU:0'):
        model = tf.keras.models.load_model(model_path)
except Exception as e:
    print(f"Error loading model: {str(e)}")
    raise

# Define class labels (must match your training labels)
class_labels = ["DR", "Glaucoma", "Normal"]  # Ensure correct order

def preprocess_image(img_path, img_size=(224, 224)):
    with tf.device('/CPU:0'):
        img = load_img(img_path, target_size=img_size)  # Load and resize
        img_array = img_to_array(img) / 255.0  # Normalize
        img_array = np.expand_dims(img_array, axis=0)  # Expand dims for model input
        return img_array

def predict_image(img_path):
    try:
        # Preprocess the image
        img_array = preprocess_image(img_path)
        
        # Get model prediction using CPU
        with tf.device('/CPU:0'):
            prediction = model.predict(img_array, verbose=0)  # Added verbose=0 to reduce output
            predicted_class = np.argmax(prediction)  # Get class with highest probability
            confidence = np.max(prediction) * 100  # Convert to percentage
        
        # Create result dictionary
        result = {
            # "image_path": img_path,
            "predicted_class": class_labels[predicted_class],
            "confidence": round(float(confidence), 2)
        }
        
        # # Print results
        # print(f"🖼 Image: {os.path.basename(img_path)}")
        # print(f"🔍 Predicted Class: {result['predicted_class']}")
        # print(f"📊 Confidence: {result['confidence']}%")
        # print("-" * 40)
        
        return result
        
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return None