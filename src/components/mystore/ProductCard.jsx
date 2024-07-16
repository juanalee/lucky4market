import React from 'react';
import styles from './css/ProductCard.module.css';

const ProductCard = ({ product }) => {
  return (
    <div className={styles.product_card}>
      <img src={product.imageUrl} alt={product.name}/>
      <div className={styles.product_info}>
        <div className={styles.product_name}>{product.name}</div>
        <div className={styles.product_price}>{product.price}</div>
        <div className={styles.product_detail}>{product.detail}</div>
      </div>
    </div>
  );
};

export default ProductCard;