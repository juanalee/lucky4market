import React, { useState } from 'react';
import styles from './css/ProductImageUpload.module.css';

const ProductImageUpload = () => {
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length + imagePreviews.length > 3) {
            alert('상품 사진은 최대 3개까지 가능합니다.');
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, { src: reader.result, name: file.name }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className={styles.productImageUpload}>
            {imagePreviews.length < 3 && (
                <>
                    <input
                        type="file"
                        id="fileUpload"
                        multiple
                        onChange={handleFileChange}
                        className={styles.fileInput}
                    />
                    <label htmlFor="fileUpload" className={styles.fileUploadButton}></label>
                    <span className={styles.uploadCount}>{imagePreviews.length}/3</span>
                </>
            )}
            <div className={styles.imagePreviewContainer}>
                {imagePreviews.map((preview, index) => (
                    <div key={index} className={styles.imagePreview}>
                        <img src={preview.src} alt={`Preview ${index}`} />
                        <span className={styles.removeImage} onClick={() => removeImage(index)}>&times;</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductImageUpload;