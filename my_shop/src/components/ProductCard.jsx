import React from 'react';
import '../css/ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product_card">
      <img src={product.imageUrl} alt={product.name}/>
      <div className="product_info">
        <div className="product_name">{product.name}</div>
        <div className="product_price">{product.price}</div>
        <div className="product_detail">{product.detail}</div>
      </div>
    </div>
  );
};

export default ProductCard;