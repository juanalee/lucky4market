import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typed from 'typed.js';
import styles from './css/RegisterSuccess.module.css';

const RegisterSuccess = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isRegistered = localStorage.getItem('isRegistered');
    if (!isRegistered) {
      navigate('/registerMember');
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const options = {
        stringsElement: '#typed-strings',
        loop: true,
        typeSpeed: 60, // Adjusted type speed
        backSpeed: 35, // Adjusted back speed
        startDelay: 1000,
        backDelay: 7000,
      };

      const typed = new Typed('#typed', options);

      return () => {
        typed.destroy();
      };
    }
  }, [loading]);

  if (loading) {
    return (
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.regSuccessPage}>
      <div className={styles.regSuccessHeader}>
        <div className={styles.regSuccessVertText}>
          <div className={styles.regSuccessLogo}>
            <a href="/">
              <img src="/img/lm_logo_default_black.png" alt="logo" />
            </a>
          </div>
          <h1 id="typer-size">
            <span id="typed"></span>
            <div id="typed-strings">
              <p>WELCOME</p>
            </div>
          </h1>
          <h3>행운을 발견하세요!</h3>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;
