import React from 'react';
import styles from './css/ProductRegistration.module.css';

const ProductTradeArea = ({ formData, handleChange }) => {
    return (
        <div className={styles.tradeArea}>
            <label>거래 지역:</label>
            <select
                name="tradeArea"
                value={formData.tradeArea}
                onChange={handleChange}
            >
                <option value="서울">서울</option>
                <option value="경기도">경기도</option>
            </select>
        </div>
    );
};

export default ProductTradeArea;
