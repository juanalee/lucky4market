import styles from "./css/SellerPageStarScore.module.css";

export default function SellerPageStarScore({ score }) {
  const totalStar = 5;
  
return (
  <div className={styles.star_score}>
    {[...Array(totalStar)].map((_, index) => (
      <span key={index} className={index < score ? styles.filledStar : styles.emptyStar}>
        ★
      </span>
    ))}
  </div>
  );
};