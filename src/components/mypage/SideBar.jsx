import React from 'react';
import styles from './css/SideBar.module.css';

export default function SideBar() {
  return (
    <div className={styles.side_bar}>
      <tr className={styles.tr_container}>
        <td>
          <div className={styles.my_page}>마이 페이지</div>
        </td>
        <td>
          <a href="#" className={styles.my_store}>내 상점</a>
        </td>
        <td>
          <a href="#" className={styles.my_info}>내 정보</a>
        </td>
        <td>
          <a href="#" className={styles.like_product}>관심 상품</a>
        </td>
        <td>
          <a href="#" className={styles.buy_history}>구매 내역</a>
        </td>
        <td>
          <a href="#" className={styles.sell_history}>판매 내역</a>
        </td>
        <td>
          <a href="#" className={styles.writed_review}>작성 후기</a>
        </td>
        <td>
          <a href="#" className={styles.received_review}>받은 후기</a>
        </td>
        <td>
          <a href="#" className={styles.follow_list}>팔로우 목록</a>
        </td>
      </tr>
    </div>
  );
};