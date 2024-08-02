import React from "react";
import { Link } from "react-router-dom";
import styles from "./css/MypageSideBar.module.css";

export default function MypageSideBar() {
  return (
    <div className={styles.side_bar_container}>
      <div className={styles.side_bar_my_page}>마이 페이지</div>
      <ul className={styles.side_bar_ul}>
        <li className={styles.side_bar_li}>
          <Link to="/myStore" className={`${styles.side_bar_item} ${styles.side_bar_my_store}`}>내 상점</Link>
        </li>
        <li className={styles.side_bar_li}>
          <Link to="/myInfo" className={`${styles.side_bar_item} ${styles.side_bar_my_info}`}>내 정보</Link>
        </li>
        <li className={styles.side_bar_li}>
          <Link to="/interestProduct" className={`${styles.side_bar_item} ${styles.side_bar_interest_product}`}>관심 상품</Link>
        </li>
        <li className={styles.side_bar_li}>
          <Link to="/buy-history" className={`${styles.side_bar_item} ${styles.side_bar_buy_history}`}>구매 내역</Link>
        </li>
        <li className={styles.side_bar_li}>
          <Link to="/sell-history" className={`${styles.side_bar_item} ${styles.side_bar_sell_history}`}>판매 내역</Link>
        </li>
        <li className={styles.side_bar_li}>
          <Link to="/writed-review" className={`${styles.side_bar_item} ${styles.side_bar_writed_review}`}>작성 후기</Link>
        </li>
        <li className={styles.side_bar_li}>
          <Link to="/receivedReview" className={`${styles.side_bar_item} ${styles.side_bar_received_review}`}>받은 후기</Link>
        </li>
        <li className={styles.side_bar_li}>
          <Link to="/" className={`${styles.side_bar_item} ${styles.side_bar_follow_list}`}>팔로우 목록</Link>
        </li>
      </ul>
    </div>
  );
};