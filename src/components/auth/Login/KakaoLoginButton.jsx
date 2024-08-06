import React from 'react';
import styles from './css/LoginButtons.module.css';

const KakaoLoginButton = () => {
  const handleKakaoLogin = () => {
    window.location.href = 'https://lucky4market.me/api/auth/kakao';
  };

  return (
    <img
      src="/img/kakao_btn_r.webp"
      alt="카카오 로그인"
      onClick={handleKakaoLogin}
      className={styles.kakaoLoginIcon}
    />
  );
};

export default KakaoLoginButton;