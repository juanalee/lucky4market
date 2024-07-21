import React from 'react';
import styles from './css/SideBar.module.css';

export default function SideBar() {
  return (
    <div className={styles.nav_container}>
      <ul className={styles.nav_ul}>
        <li className={styles.nav_li}><div className={styles.my_page}>마이 페이지</div></li>
        <li className={styles.nav_li}>
          <a href="#" className={`${styles.nav_item} ${styles.my_store}`}>내 상점</a>
        </li>
        <li className={styles.nav_li}>
          <a href="#" className={`${styles.nav_item} ${styles.my_info}`}>내 정보</a>
        </li>
        <li className={styles.nav_li}>
          <a href="#" className={`${styles.nav_item} ${styles.like_product}`}>관심 상품</a>
        </li>
        <li className={styles.nav_li}>
          <a href="#" className={`${styles.nav_item} ${styles.buy_history}`}>구매 내역</a>
        </li>
        <li className={styles.nav_li}>
          <a href="#" className={`${styles.nav_item} ${styles.sell_history}`}>판매 내역</a>
        </li>
        <li className={styles.nav_li}>
          <a href="#" className={`${styles.nav_item} ${styles.writed_review}`}>작성 후기</a>
        </li>
        <li className={styles.nav_li}>
          <a href="#" className={`${styles.nav_item} ${styles.received_review}`}>받은 후기</a>
        </li>
        <li className={styles.nav_li}>
          <a href="#" className={`${styles.nav_item} ${styles.follow_list}`}>팔로우 목록</a>
        </li>
      </ul>
    </div>
  );
};