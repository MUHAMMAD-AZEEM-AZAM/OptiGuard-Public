from fastapi import File, UploadFile
from fastapi.responses import JSONResponse
import os
import shutil
from model import predict_image
from CheckFundus import is_fundus_image


UPLOAD_DIR = "./uploads"

# Ensure the upload directory exists
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

from fastapi.responses import JSONResponse

async def upload_image(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        # Save the uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Perform validations
        check = is_fundus_image(file_path)
        if not check:
            os.remove(file_path)  # Remove invalid image
            return JSONResponse(
                content={"filename": file.filename, "message": "Not a valid fundus image."},
                status_code=400
            )
        if check == 2:
            os.remove(file_path)  # Remove invalid image
            return JSONResponse(
                content={"filename": file.filename, "message": "Only allowed image with single retina"},
                status_code=400
            )

        # Process the image
        result = predict_image(file_path)
        
        # Prepare success response
        content = {
            "filename": file.filename,
            "status": "Image successfully uploaded"
        }
        content.update(result)
        
        return JSONResponse(content=content, status_code=200)

    except Exception as e:
        # Handle errors and clean up
        if os.path.exists(file_path):
            os.remove(file_path)
        return JSONResponse(
            content={"message": "Image upload failed", "details": str(e)},
            status_code=500
        )
    finally:
        # Ensure file is removed even if other returns are hit
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except:
                pass 
