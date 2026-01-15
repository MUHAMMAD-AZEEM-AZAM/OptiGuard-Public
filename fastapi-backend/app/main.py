from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from services import upload_image
import warnings
warnings.filterwarnings('ignore')

app = FastAPI(debug=True)

# Configure CORS to allow requests from the Node.js server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific domain like "http://localhost:5000" for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_image_controller(file: UploadFile = File(...)):
    return await upload_image(file)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)