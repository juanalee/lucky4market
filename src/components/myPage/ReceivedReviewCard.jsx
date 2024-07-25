import React from "react";
import styles from "./css/ReceivedReviewCard.module.css";

export default function ReceivedReviewCard({ product }) {
  return (
    <div className={styles.received_review_card}>
      <img src={product.imageUrl} alt={product.name}/>
      <div className={styles.receivced_review_info}>
        <div className={styles.receivced_review_card_name}>{product.name}</div>
        <div className={styles.receivced_review_card_price}>{product.price}</div>
        <div className={styles.receivced_review_card_score}>{product.score}</div>
        <div className={styles.receivced_review_card_review}>{product.review}</div>
      </div>
    </div>
  );
};