import styles from "./css/MyPageStarScore.module.css";

export default function MyPageStarScore({ score }) {
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