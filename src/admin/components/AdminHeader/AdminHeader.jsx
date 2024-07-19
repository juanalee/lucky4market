import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AdminHeader.module.css';

const AdminHeader = () => {
  return (
    <div className={styles.adminHeaderContainer}>
      <div className={styles.adminHeader}>
        <div className={styles.adminTop}>
          <div className={styles.leftSection}>
            <span className={styles.headerLogo}>logo</span>
            <span>관리자</span>
          </div>
          <div className={styles.rightSection}>
            <NavLink to="/admin/info" className={styles.link}>관리자정보</NavLink>
            <NavLink to="/" className={styles.logoutLink}>로그아웃</NavLink>
          </div>
        </div>
        <div className={styles.adminBottom}>
          <NavLink to="/admin/members" className={styles.link}>회원관리</NavLink>
          <NavLink to="/admin/reports" className={styles.link}>신고관리</NavLink>
          <NavLink to="/admin/products" className={styles.link}>상품관리</NavLink>
          <NavLink to="/admin/categories" className={styles.link}>카테고리 관리</NavLink>
          <NavLink to="/admin/support" className={styles.link}>고객센터</NavLink>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
