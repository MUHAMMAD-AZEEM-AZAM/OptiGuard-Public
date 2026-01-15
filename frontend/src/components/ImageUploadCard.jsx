import React, { useState } from 'react';
import {
  Card, CardContent, Button, Typography, CardMedia,
  IconButton, Box, LinearProgress, CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { uploadImage } from '../services/api';
import useCustomSnackbar from '../hooks/useCustomSnackbar';
import { compressImage } from '../services/imageCompressor';

const ImageUploadCard = ({ onUploadComplete }) => {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { showSuccess, showError } = useCustomSnackbar();

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // Base64 string
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // convert file to base64
    });

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files).filter((file) => file.type.startsWith('image/'));
    setImages(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
    setProgress(0);
    event.target.value = '';
  };

  const handleDeleteImages = () => {
    setImages([]);
    setPreviewUrls([]);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (images.length === 0) return;
    setLoading(true);
    setProgress(0);

    const finalResults = [];
    let successCount = 0;
    let failureCount = 0;

    try {
      for (let i = 0; i < images.length; i++) {
        try {

          const base64Url = await convertToBase64(images[i]);

          const result = await uploadImage(images[i]);
          console.log(images[i])

          if (result.success === false) {
            const compressedBlob = await compressImage(images[i]);
            const base64Url = await convertToBase64(compressedBlob);
            failureCount++;
            finalResults.push({
              imageName: images[i].name,
              imageUrl: base64Url,
              prediction: "Failed",
              statusMessage: result?.message || "Upload failed",
              date: new Date().toISOString(),
            });
          } else {
            successCount++;
            finalResults.push({
              historyId: result.history.id,
              imageName: images[i].name,
              imageUrl: result.history.imageUrl,
              prediction: result.history.result.predictedClass,
              statusMessage: "Success",
              date: result.history.createdAt,
              recommendations: result.recommendations
            });
          }

        } catch (error) {
          const compressedBlob = await compressImage(images[i]);
          const base64Url = await convertToBase64(compressedBlob);
          failureCount++;
          finalResults.push({
            imageName: images[i].name,
            imageUrl: base64Url,
            prediction: "Failed",
            statusMessage: error.response?.data?.detail || error.message || "Unknown error",
            date: new Date().toISOString(),
          });
        }

        setProgress(((i + 1) / images.length) * 100);
      }
      console.log(finalResults)

      if (successCount > 0) showSuccess(`${successCount} ${successCount > 1 ? 'Images' : 'Image'} processed successfully.`);
      if (failureCount > 0) showError(`${failureCount}  ${failureCount > 1 ? 'Images' : 'Image'} failed to process.`);

      onUploadComplete(finalResults);
      handleDeleteImages();

    } finally {
      setLoading(false);
    }
  };


  return (
    <Card
      id="image-analysis"
      sx={(theme) => ({
        borderRadius: '5px',
        width: { xs: '90%', sm: '70%', md: '50%', lg: '40%', xl: '35%' },
        margin: 'auto',
        backgroundColor: theme.palette.mode === 'dark' ? `${theme.palette.background.paper}` : '#fcfcfc',
        padding: '60px',
        textAlign: 'center',
        position: 'relative',
      })}
    >
      {/* Image Previews */}
      {previewUrls.length > 0 ? (
        <Box sx={{ position: 'relative' }}>
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'center'
          }}>
            {previewUrls.slice(0, 3).map((url, idx) => (
              <Box
                key={idx}
                sx={{
                  width: { xs: '100%', sm: 'calc(33.333% - 8px)' },
                  maxWidth: '100px'
                }}
              >
                <CardMedia
                  component="img"
                  height="100"
                  image={url}
                  alt={`Preview ${idx + 1}`}
                  sx={{ objectFit: 'cover', borderRadius: 1 }}
                />
              </Box>
            ))}
          </Box>
          {previewUrls.length > 3 && (
            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 1, color: 'text.secondary' }}
            >
              +{previewUrls.length - 3} more image(s)
            </Typography>
          )}
          <IconButton
            onClick={handleDeleteImages}
            sx={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
            }}
          >
            <CloseIcon color="error" />
          </IconButton>
        </Box>
      ) : (
        <CardContent>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Image Uploaded
          </Typography>
        </CardContent>
      )}

      {/* Upload Input */}
      <CardContent sx={{ margin: '15px 0px' }}>
        <input
          accept="image/*"
          type="file"
          id="image-upload"
          multiple
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <label htmlFor="image-upload">
          <Button
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Choose Images
          </Button>
        </label>
      </CardContent>

      {loading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2"> {Math.round(progress)}% – {Math.round((progress / 100) * images.length)} of {images.length} processed</Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 5,
              '& .MuiLinearProgress-bar': {
                backgroundImage: 'linear-gradient(to right, #027AF2, #60b0f4)',
              },
            }}
          />
        </Box>
      )}

      {/* Upload Button */}
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        disabled={images.length === 0 || loading}
        onClick={handleUpload}
        sx={{
          mt: 2,
          color: 'white',
          maxWidth: '200px',
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload Images'}
      </Button>
    </Card>
  );
};

export default ImageUploadCard;
