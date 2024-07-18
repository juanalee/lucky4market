import React from 'react';
import styles from './css/ProductImageUpload.module.css';

const ProductImageUpload = () => {
    return (
        <div className={styles.productImageUpload}>
            <input type="file" name="file1" />
            <input type="file" name="file2" />
            <input type="file" name="file3" />
        </div>
    );
};

export default ProductImageUpload;