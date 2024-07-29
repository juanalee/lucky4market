import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/ProductImageUpload.module.css';
import ProductinsertPopup from './ProductinsertPopup';

const ProductImageUpload = ({ uploadedImages, setUploadedImages }) => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [popup, setPopup] = useState({
    show: false,
    message: '',
    isConfirmation: false,
  });

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length + imagePreviews.length > 3) {
      setPopup({
        show: true,
        message: "상품 사진은 최대 3개까지 가능합니다.",
        isConfirmation: false,
      });
      return;
    }

    const newUploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        console.log('Uploading file:', file.name);
        const response = await axios.post('http://localhost:9999/images/productImg/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const { preSignedUrl, objectKey } = response.data;
        console.log('Received preSignedUrl:', preSignedUrl);
        console.log('Object Key:', objectKey);

        //S3 PUT request용으로 axios 인터셉터를 피하기 위한 새로운 axios 인스턴스 생성
        const s3Axios = axios.create();

        // pre-signed URL을 사용해 AWS S3에 파일 업로드
        await s3Axios.put(preSignedUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
        });

        newUploadedImages.push({ key: objectKey, file: file, number: imagePreviews.length + i });
        console.log('업로드한 이미지 키:', objectKey);

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, { src: reader.result, name: file.name }]);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('File upload error:', error);
        setPopup({
          show: true,
          message: '파일 업로드에 실패했습니다.',
          isConfirmation: false,
        });
      }
    }

    setUploadedImages(prev => [...prev, ...newUploadedImages]);
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.productImageUpload}>
      {imagePreviews.length < 4 && (
        <div className={styles.productImageUploadimage}>
          <input
            type="file"
            name="file"
            id="fileUpload"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <label htmlFor="fileUpload" className={styles.fileUploadButton}></label>
          <span className={styles.uploadCount}>{imagePreviews.length}/3</span>
        </div>
      )}
      <div className={styles.imagePreviewContainer}>
        {imagePreviews.map((preview, index) => (
          <div key={index} className={styles.imagePreview}>
            <img src={preview.src} alt={`Preview ${index}`} />
            <span className={styles.removeImage} onClick={() => removeImage(index)}>&times;</span>
          </div>
        ))}
      </div>
      <ProductinsertPopup
        show={popup.show}
        onClose={() => setPopup({ ...popup, show: false })}
        message={popup.message}
        isConfirmation={popup.isConfirmation}
      />
    </div>
  );
};

export default ProductImageUpload;
