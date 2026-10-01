# OptiGuard - AI-Powered Eye Disease Detection

OptiGuard is a comprehensive, production-ready AI solution designed for early detection of ocular diseases, specifically **Diabetic Retinopathy (DR)** and **Glaucoma**, from retinal fundus images. 

The system pairs state-of-the-art Deep Learning models with a robust full-stack web application featuring bulk image diagnostics (up to 15 images at once), prediction history tracking, dual authentication (JWT and Google OAuth), and an active feedback loop.

---

## 📌 Project Overview & Model Architecture

### 1. Two-Stage Pipeline (Initial Architecture)
In clinical and real-world deployment, non-fundus images (e.g., random photos, blurred captures) or improper scans (double-fundus images) can corrupt diagnostic results. To address this, a **two-stage pipeline** was designed:
* **Stage 1 (Smart Quality Filter)**: A **SigLIP2 (Sigmoid Loss for Language Image Pre-training)** vision model filters out non-fundus and double-fundus images, ensuring only valid, single-fundus images reach the diagnostic engine.
* **Stage 2 (Disease Classifier)**: Valid single-fundus images are passed to a fine-tuned **VGG-16** classifier for DR and Glaucoma detection.
  * **Test Accuracy**: **98.61%**
  * **Validation Accuracy**: **98.53%**
  * **Test Loss**: **0.0409**

### 2. Single-Stage Unified Model (Post-Graduation Extension)
To streamline inference and eliminate the need for a separate upstream filter model, the system was extended into an end-to-end single-stage architecture:
* Integrated **Non-Fundus** directly as a 4th target class alongside **Diabetic Retinopathy (DR)**, **Glaucoma**, and **Normal**.
* Trained an **EfficientNet-B0** convolutional neural network with automated checkpointing and learning rate scheduling.
* **Validation Accuracy**: **99.1%**, achieving faster end-to-end inference while maintaining high reliability in distinguishing non-fundus artifacts and diagnosing diseases.

---

## 🔬 Included Jupyter Notebooks

This repository includes the complete research and model development notebooks:

| Notebook | Description | Key Highlights |
| :--- | :--- | :--- |
| [`Preprocessing.ipynb`](Preprocessing.ipynb) | End-to-end dataset preprocessing and augmentation pipeline | • **CLAHE** (Contrast Limited Adaptive Histogram Equalization) in LAB color space for retinal vessel clarity<br>• **Denoising & Sharpening**: Gaussian blur noise reduction with adaptive thresholding & weighted edge enhancement<br>• **Data Augmentation**: Multi-angle rotations (-25° to +25°), horizontal flips, brightness & contrast scaling, Gaussian noise injection, and random cropping/rescaling to address class imbalance across severity grades |
| [`VGGNet.ipynb`](VGGNet.ipynb) | VGG-16 Deep Learning training & evaluation | • Trained on augmented multi-class dataset<br>• Achieves **98.61% test accuracy** and **98.53% validation accuracy** (Test loss: 0.0409)<br>• Powers the core diagnostic engine of the two-stage FastAPI service |
| [`EfficientNetOptiguard.ipynb`](EfficientNetOptiguard.ipynb) | 4-Class Ocular Disease Classification Pipeline | • **EfficientNet-B0** transfer learning architecture (PyTorch)<br>• 4 target classes: `DR`, `Glaucoma`, `Normal`, and `NonFundus`<br>• Achieves **99.1% validation accuracy**<br>• Automated best-model saving, confusion matrix evaluation, and single-image inference helper |

---

## 📊 Model Performance Comparison

| Metric / Feature | Two-Stage Pipeline (VGG-16 + SigLIP2) | Single-Stage Model (EfficientNet-B0) |
| :--- | :--- | :--- |
| **Primary Backbone** | VGG-16 (with SigLIP2 filter) | EfficientNet-B0 |
| **Classes** | 3 Classes (`DR`, `Glaucoma`, `Normal`) + Upstream Filter | 4 Classes (`DR`, `Glaucoma`, `Normal`, `Non-Fundus`) |
| **Validation / Test Accuracy** | 98.61% Test Acc (98.53% Val Acc) | **99.1% Validation Acc** |
| **Pipeline Complexity** | Two-stage (filtering + classification) | Single unified model (direct classification & rejection) |
| **Notebook / Implementation** | [`VGGNet.ipynb`](VGGNet.ipynb) & FastAPI Backend (`fastapi-backend/`) | [`EfficientNetOptiguard.ipynb`](EfficientNetOptiguard.ipynb) |

### VGG-16 Model Training Results
![VGG-16 Accuracy](Website%20Demo%20Images/VGG16Accuracy.png)

---

## 🚀 Key Features

* **High-Accuracy AI Diagnostics**:
  * Accurate detection and classification of Diabetic Retinopathy and Glaucoma.
  * Real-world filtering of non-fundus / invalid scans.
* **Batch Processing & Workflow**:
  * **Bulk Image Upload**: Upload and analyze up to **15 images** simultaneously with results organized in a clean, interactive table.
  * **Prediction History**: Automatically stores diagnostic reports for clinicians and patients for future tracking.
  * **User Feedback Loop**: Allows users to submit feedback on predictions to facilitate dataset expansion and continuous model improvement.
* **Authentication & Profile Management**:
  * Secure dual authentication via Email/Password (JWT) and Google OAuth.
  * Profile updates and password recovery flows (Forgot/Reset password).
* **Modern Responsive UI/UX**:
  * Built with Next.js and Tailwind CSS.
  * Full **Dark & Light Mode** support optimized for clinical and personal environments.

---

## 🛠 Tech Stack

* **Frontend**: Next.js, React, Tailwind CSS
* **API Backend**: Node.js, Express, MongoDB Atlas, Mongoose, JWT, Google OAuth
* **AI Backend**: Python, FastAPI, PyTorch, TensorFlow/Keras, OpenCV, torchvision
* **Research & Notebooks**: Jupyter Notebook, Google Colab

---

## 💻 Prerequisites

Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [Python](https://www.python.org/) (v3.9+)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection URI)

---

## ⚙️ Setup & Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/MUHAMMAD-AZEEM-AZAM/OptiGuard-Public.git
cd OptiGuard
```

### 2. FastAPI Backend (AI Inference Engine)

Navigate to the `fastapi-backend` directory:

```bash
cd fastapi-backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

> **Note**: Place your trained model file `new_vgg16_model.keras` in the `fastapi-backend/app/` directory (excluded from Git tracking due to file size).

Start the FastAPI service:

```bash
cd app
uvicorn main:app --reload
```
The AI service will run at `http://localhost:8000`.

### 3. Node.js Backend (Authentication & Management API)

Navigate to the `node-backend` directory:

```bash
cd ../node-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in `node-backend/` with your configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the API server:

```bash
npm run dev
```
The API server will run at `http://localhost:5000`.

### 4. Next.js Frontend

Navigate to the `frontend` directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 📸 Application Demos

| Bulk Processing (Dark Theme) | Prediction Results (Table View) |
| :---: | :---: |
| ![Bulk Processing](Website%20Demo%20Images/BulkImageProcessingDarkTheme.png) | ![Prediction Results](Website%20Demo%20Images/predictionResultsDark.png) |

| Patient Diagnostic History | User Feedback System |
| :---: | :---: |
| ![History Page](Website%20Demo%20Images/HistoryPageLightTheme.png) | ![Feedback](Website%20Demo%20Images/Feedback.png) |

---

## 📄 License

This project is licensed under the MIT License.
