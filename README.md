# OptiGuard

OptiGuard is an AI system for glaucoma and diabetic retinopathy detection from retinal fundus images. It includes deep learning models for classification and filtering, along with a web application that supports batch predictions (up to 15 images at once), prediction history, JWT and Google authentication, and user feedback.

---

## Architecture Overview

### Two-Stage Pipeline (Initial Version)
To prevent non-fundus and double-fundus images from reaching the classifier, the initial system used a two-stage pipeline:
1. **Filter (SigLIP2)**: Removes non-fundus and double-fundus images so only valid single-fundus images reach the classifier.
2. **Classifier (VGG-16)**: Classifies single-fundus images for diabetic retinopathy and glaucoma.
   - Test Accuracy: 98.61%
   - Validation Accuracy: 98.53%
   - Test Loss: 0.0409

### Single-Stage Model (EfficientNet-B0)
To remove the need for a separate filter model, non-fundus images were added as a fourth class. A single EfficientNet-B0 model was then trained to classify images into:
- Diabetic Retinopathy (DR)
- Glaucoma
- Normal
- Non-Fundus

This single model reached **99.1% validation accuracy**, handling filtering and disease classification in one step.

---

## Notebooks

| Notebook | Description | Details |
| :--- | :--- | :--- |
| [`Preprocessing.ipynb`](Preprocessing.ipynb) | Image preprocessing and data augmentation | - LAB color space conversion and CLAHE contrast enhancement<br>- Gaussian blur denoising and edge sharpening<br>- Augmentations to handle class imbalance: rotations (-25 to +25 degrees), horizontal flips, brightness and contrast scaling, Gaussian noise, and random cropping/rescaling |
| [`VGGNet.ipynb`](VGGNet.ipynb) | VGG-16 model training | - Trained on augmented dataset<br>- 98.61% test accuracy, 98.53% validation accuracy (Test loss: 0.0409)<br>- Used in the FastAPI backend service |
| [`EfficientNetOptiguard.ipynb`](EfficientNetOptiguard.ipynb) | 4-class EfficientNet-B0 training and inference | - PyTorch implementation with EfficientNet-B0<br>- 4 classes: DR, Glaucoma, Normal, Non-Fundus<br>- 99.1% validation accuracy<br>- Includes checkpoint saving, confusion matrix evaluation, and single-image inference |

---

## Model Comparison

| Feature | Two-Stage Pipeline | Single-Stage Model |
| :--- | :--- | :--- |
| Model | SigLIP2 filter + VGG-16 classifier | EfficientNet-B0 |
| Classes | 3 classes (DR, Glaucoma, Normal) | 4 classes (DR, Glaucoma, Normal, Non-Fundus) |
| Performance | 98.61% test accuracy (VGG-16) | 99.1% validation accuracy |
| Filtering | Handled by upstream SigLIP2 filter | Handled directly by classifier |
| Implementation | [`VGGNet.ipynb`](VGGNet.ipynb), `fastapi-backend/` | [`EfficientNetOptiguard.ipynb`](EfficientNetOptiguard.ipynb) |

### VGG-16 Training Results
![VGG-16 Accuracy](Website%20Demo%20Images/VGG16Accuracy.png)

---

## Web App Features

- **Batch Upload**: Upload up to 15 images at once and view results in a table.
- **Authentication**: Email/password authentication using JWT, plus Google OAuth support.
- **Prediction History**: Stores past predictions and reports per user account.
- **User Feedback**: Feedback form on predictions to collect corrections and improve future iterations.
- **Theme Support**: Dark mode and light mode.

---

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend API**: Node.js, Express, MongoDB Atlas, JWT, Google OAuth
- **Model Serving**: Python, FastAPI, PyTorch, TensorFlow / Keras, OpenCV
- **Notebooks**: Jupyter, Google Colab

---

## Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- MongoDB (local or Atlas)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/MUHAMMAD-AZEEM-AZAM/OptiGuard-Public.git
cd OptiGuard
```

### 2. FastAPI Backend (Model Inference)

```bash
cd fastapi-backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Place `new_vgg16_model.keras` in `fastapi-backend/app/` (not tracked in Git due to file size).

Start the server:

```bash
cd app
uvicorn main:app --reload
```

The service runs at `http://localhost:8000`.

### 3. Node.js Backend (Auth and API)

```bash
cd ../node-backend
npm install
```

Create a `.env` file in `node-backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the API server:

```bash
npm run dev
```

The API server runs at `http://localhost:5000`.

### 4. Next.js Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The application runs at `http://localhost:3000`.

---

## Screenshots

| Batch Upload (Dark Theme) | Prediction Results |
| :---: | :---: |
| ![Bulk Processing](Website%20Demo%20Images/BulkImageProcessingDarkTheme.png) | ![Prediction Results](Website%20Demo%20Images/predictionResultsDark.png) |

| Prediction History | Feedback Form |
| :---: | :---: |
| ![History Page](Website%20Demo%20Images/HistoryPageLightTheme.png) | ![Feedback](Website%20Demo%20Images/Feedback.png) |

---

## License

This project is licensed under the MIT License.
