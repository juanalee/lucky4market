import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/ProductImageUpload.module.css';


const ProductImageUploadUpdate = ({ uploadedImages, setUploadedImages, productNo, deleteImages, setDeleteImages }) => {
    const [imagePreviews, setImagePreviews] = useState([]);
    const [popup, setPopup] = useState({
        show: false,
        message: '',
        isConfirmation: false,
    });

    console.log(deleteImages);

    useEffect(() => {
        const fetchExistingImages = async () => {
            if (productNo) {
                try {
                    const response = await axios.get(`http://localhost:9999/api/product/${productNo}/images`);
                    const existingImages = response.data.map(image => ({
                        src: image.productImagePath,
                        key: image.PRODUCT_IMAGE_NO, // PRODUCT_IMAGE_NO를 key로 사용
                    }));
                    setImagePreviews(existingImages);
                } catch (error) {
                    console.error('Error fetching existing images:', error);
                    setPopup({
                        show: true,
                        message: '기존 이미지를 불러오는 데 실패했습니다.',
                        isConfirmation: false,
                    });
                }
            }
        };

        fetchExistingImages();
    }, [productNo]);

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
                const response = await axios.post('http://localhost:9999/images/productImg/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const { preSignedUrl, objectKey } = response.data;

                // S3 PUT request용으로 axios 인터셉터를 피하기 위한 새로운 axios 인스턴스 생성
                const s3Axios = axios.create();

                // pre-signed URL을 사용해 AWS S3에 파일 업로드
                await s3Axios.put(preSignedUrl, file, {
                    headers: {
                        'Content-Type': file.type,
                    },
                });

                // 새로운 이미지 추가
                newUploadedImages.push({ key: objectKey, file: file });

                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [
                        ...prev,
                        { src: reader.result, key: objectKey } // `key`는 `PRODUCT_IMAGE_NO`처럼 사용
                    ]);
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

    const removeImage = (key) => {
        // 삭제할 이미지 key를 사용하여 삭제
        setImagePreviews(prev => prev.filter(image => image.key !== key));
        setUploadedImages(prev => prev.filter(image => image.key !== key));
        setDeleteImages(prev => [...prev, key]); // 삭제 이미지 배열에 key 추가

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
                {imagePreviews.map((preview) => (
                    <div key={preview.key} className={styles.imagePreview}>
                        <img src={preview.src} alt={`Preview ${preview.key}`} />
                        <span className={styles.removeImage} onClick={() => removeImage(preview.key)}>&times;</span>
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

export default ProductImageUploadUpdate;
