# import cv2
# import numpy as np

# def is_fundus_image(image):
#     # Convert image to numpy array if it's not already
#     if isinstance(image, str):
#         image = cv2.imread(image)
    
#     if image is None:
#         return 0  # Return 0 if the image cannot be loaded

#     # Convert to grayscale
#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
#     # Check for bright region (optic disc)
#     _, binary = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
#     optic_disc_area = cv2.countNonZero(binary)
    
#     # Check for red/yellow color presence (fundus characteristic)
#     hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
#     lower_red = np.array([0, 20, 20])  # Adjusted to be more inclusive
#     upper_red = np.array([30, 255, 255])
#     red_mask = cv2.inRange(hsv, lower_red, upper_red)
#     red_pixel_count = cv2.countNonZero(red_mask)
    
#     # Determine if the image is fundus
#     return 1 if 0 <= optic_disc_area <= 60000 and red_pixel_count >= 30000 else 0


from transformers import pipeline
from PIL import Image

# Load the model only once
print("Loading model...")
image_classifier = pipeline(
    task="zero-shot-image-classification",
    model="google/siglip2-base-patch16-224",
)
print("Model loaded successfully.")

def is_fundus_image(image_path):
    try:
        image = Image.open(image_path)
        candidate_labels = [
        "image showing only one human retina from a fundus camera",
        "image showing two human retinas captured side by side in a single image"
        ]
        outputs = image_classifier(image, candidate_labels=candidate_labels)
        # Initialize scores
        score_single = 0
        score_multiple = 0

        # Extract scores by matching labels
        for output in outputs:
            if "only one" in output["label"]:
                score_single = output["score"]
            elif "two human retinas" in output["label"]:
                score_multiple = output["score"]
                
        greaterScore=score_single if score_single> score_multiple else score_multiple
        # Determine fundus count
        fundus_detected = 1 if greaterScore > 0.5 else 0
        if fundus_detected == 1 and score_multiple > score_single:
           fundus_detected = 2
           print("🔁 Yes — Multiple fundus detected.")

        # Output results
        print(f"Image: {image}")
        print(f"Fundus Detected: {fundus_detected} | Single Score: {round(score_single, 4)} | Multiple Score: {round(score_multiple, 4)}\n")
        return fundus_detected
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return None

# Example usage: single image
# detect_fundus("C:/Users/YourName/Downloads/fundus_example.png")

# # Example usage: multiple images
# image_paths = [
#     "./uploads/azeem.jpg",
#     "./uploads/dim6482665-fig-0011a-m.png",
#     "./uploads/DR.jpg"
# ]

# for path in image_paths:
#    is_fundus_image(path)