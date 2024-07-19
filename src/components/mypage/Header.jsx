import React from 'react';
import styles from './css/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>logo</div>
      <input type="text" className={styles.search_input} placeholder="상품명 입력"/>
      <nav className={styles.user_menu}>
        <a href="#">마이 페이지</a>
        <a href="#">로그아웃</a>
      </nav>
    </header>
  );
};