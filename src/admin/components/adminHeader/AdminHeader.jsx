import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './AdminHeader.module.css';

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    // 로그아웃 시 토큰 제거
    localStorage.removeItem('token');

    // 메인으로 돌아가기
    navigate('/');
  };
  return (
    <div className={styles.adminHeaderContainer}>
      <div className={styles.adminHeader}>
        <div className={styles.adminHeaderTop}>
          <div className={styles.adminHeaderLeftSection}>
            <div className={styles.adminHeaderLogo}>
              <img src="/img/lm_symbol_only.png" alt="symbol" />
            </div>
            <span className={styles.adminHeaderTitle}>관리자</span>
          </div>
          <div className={styles.adminHeaderRightSection}>
            <NavLink to="/admin/info" className={styles.adminHeaderInfoLink}>관리자정보</NavLink>
            <NavLink to="/" className={styles.adminHeaderLogoutLink} onClick={handleLogout}>로그아웃</NavLink>
          </div>
        </div>
        <div className={styles.adminHeaderBottom}>
          <NavLink to="/admin/members" className={styles.adminHeaderLink}>회원관리</NavLink>
          <NavLink to="/admin/reports" className={styles.adminHeaderLink}>신고관리</NavLink>
          <NavLink to="/admin/products" className={styles.adminHeaderLink}>상품관리</NavLink>
          <NavLink to="/admin/categories" className={styles.adminHeaderLink}>카테고리 관리</NavLink>
          <NavLink to="/admin/support" className={styles.adminHeaderLink}>고객센터</NavLink>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;