# OptiGuard - AI-Powered Eye Disease Detection

OptiGuard is a comprehensive solution for early detection of eye diseases such as Diabetic Retinopathy (DR) and Glaucoma using advanced Deep Learning models. The system consists of a FastAPI backend for inference, a Node.js backend for user management, and a modern React/Next.js frontend.

## Features

## Key Features

- **Advanced AI Diagnosis**:
    - **Disease Detection**: Accurately detects Diabetic Retinopathy (DR) and Glaucoma.
    - **Smart Filtering**: Uses **SigLIP (Sigmoid Loss for Language Image Pre-training)** to automatically filter out non-fundus images, ensuring only valid eye scans are processed.
    - **High Accuracy**: Achieves **98.61% Test Accuracy** and **98.53% Validation Accuracy** on the test dataset.

- **Comprehensive User System**:
    - **Dual Authentication**: Secure login via Email/Password or Google OAuth.
    - **Profile Management**: Easy profile updates and password management (Forgot/Reset Password flows).

- **Powerful Workflow**:
    - **Bulk Processing**: Upload and process multiple fundus images simultaneously.
    - **History & Tracking**: Automatically saves all diagnosis reports for future reference.
    - **Interactive Feedback**: Users can provide feedback on general system usage or specific prediction results to help improve the model over time.

- **Modern UI/UX**:
    - **Dark & Light Mode**: Fully supported themes for comfortable viewing in any environment.
    - **Responsive Design**: Optimized for desktops, tablets, and mobile devices.

## Model Performance

Our VGG16-based model has been rigorously trained and tested:
- **Final Test Accuracy**: 98.61%
- **Validation Accuracy**: 98.53%
- **Test Loss**: 0.0409

![Model Training Results](Website%20Demo%20Images/VGG16Accuracy.png)

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend (API)**: Node.js, Express, MongoDB
- **AI Engine**: Python, FastAPI, TensorFlow/Keras
- **Database**: MongoDB Atlas

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Python](https://www.python.org/) (v3.9+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas connection string)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/optiguard.git
cd optiguard
```

### 2. FastAPI Backend (AI Engine)

Navigate to the `fastapi-backend` directory:

```bash
cd fastapi-backend
```

Create a virtual environment (optional but recommended):

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

**Note**: You need to place your trained model file `new_vgg16_model.keras` in the `fastapi-backend/app/` directory. This file is not included in the repository due to size constraints.

Run the server:

```bash
cd app
uvicorn main:app --reload
```
The AI service will run on `http://localhost:8000`.

### 3. Node.js Backend (API)

Navigate to the `node-backend` directory:

```bash
cd ../node-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in `node-backend/` with your configuration (example):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run the server:

```bash
npm run dev
```
The API server will run on `http://localhost:5000`.

### 4. Frontend

Navigate to the `frontend` directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## Demo

Check out the `Website Demo Images` folder for screenshots of the application in action.

## License

This project is licensed under the MIT License.
