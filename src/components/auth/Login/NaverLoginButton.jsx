import React from 'react';
import styles from './css/LoginButtons.module.css';

const NaverLoginButton = () => {
  const handleNaverLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenProvider');
    window.location.href = 'https://lucky4market.me/api/auth/naver';
  };

  return (
    <img
      src="/img/naver_btn_r.png"
      alt="네이버 로그인"
      onClick={handleNaverLogin}
      className={styles.naverLoginIcon}
    />
  );
};

export default NaverLoginButton;