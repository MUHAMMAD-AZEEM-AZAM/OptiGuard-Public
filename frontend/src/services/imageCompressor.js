/**
 * Compress an image file to under 100KB.
 * @param {File} file - The image file to compress.
 * @param {number} maxSizeKB - Target max size in KB (default: 100).
 * @returns {Promise<Blob>} - A Promise that resolves with the compressed image as a Blob.
 */
export const compressImage = (file, maxSizeKB = 100) => {
  const maxSizeBytes = maxSizeKB * 1024;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const scale = Math.min(1, 800 / img.width); // Resize large images
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let quality = 0.9;

      const compress = () => {
        canvas.toBlob(
          (blob) => {
            if (blob.size <= maxSizeBytes || quality < 0.1) {
              resolve(blob);
            } else {
              quality -= 0.05;
              compress(); // Retry with lower quality
            }
          },
          'image/jpeg',
          quality
        );
      };

      compress();
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
