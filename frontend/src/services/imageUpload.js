import { baseURL } from '../config/config';

export const uploadImage = async (image) => {
  const formData = new FormData();
  formData.append('file', image);

  try {
    console.log(localStorage.getItem('token'))
    const response = await fetch(baseURL+'/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Failed to upload image');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
