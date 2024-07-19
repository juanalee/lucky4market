import React from 'react';
import styles from './css/ProductRegistration.module.css'

const DeliveryOptions = ({ formData, handleChange, errors }) => {
    return (
        <div className={styles.directDeal}>
            <label className={`${styles.radioLabel} ${formData.deliveryNo === '1' ? styles.selected : ''}`}>
                <input
                    type="radio"
                    name="deliveryNo"
                    value="1"
                    checked={formData.deliveryNo === '1'}
                    onChange={handleChange}
                />
                무료배송
            </label>
            <label className={`${styles.radioLabel} ${formData.deliveryNo === '2' ? styles.selected : ''}`}>
                <input
                    type="radio"
                    name="deliveryNo"
                    value="2"
                    checked={formData.deliveryNo === '2'}
                    onChange={handleChange}
                />
                착불
            </label>
            <label className={`${styles.radioLabel} ${formData.deliveryNo === '3' ? styles.selected : ''}`}>
                <input
                    type="radio"
                    name="deliveryNo"
                    value="3"
                    checked={formData.deliveryNo === '3'}
                    onChange={handleChange}
                />
                선불
            </label>
            {(formData.deliveryNo === '2' || formData.deliveryNo === '3') && (
                <input
                    type="text"
                    name="deliveryCharge"
                    placeholder="택배비를 입력하세요"
                    value={formData.deliveryCharge}
                    onChange={handleChange}
                    className={styles.deliveryChargeInput}
                />
            )}
            {errors.deliveryNo && <div className={`${styles.error} ${styles.red}`}>{errors.deliveryNo}</div>}
            {errors.deliveryCharge && <div className={`${styles.error} ${styles.red}`}>{errors.deliveryCharge}</div>}
        </div>
    );
};

export default DeliveryOptions;
