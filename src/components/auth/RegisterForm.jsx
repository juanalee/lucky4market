import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './css/LoginForm.module.css';
import $ from 'jquery';

const RegisterForm = () => {
  const [memberName, setMemberName] = useState('');
  const [regSSN1, setRegSSN1] = useState('');
  const [regSSN2, setRegSSN2] = useState('');
  const regSSN2Ref = useRef(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSSN1Change = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setRegSSN1(value);
      if (value.length === 6) {
        regSSN2Ref.current.focus();
      }
    }
  };

  const handleSSN2Change = (e) => {
    const value = e.target.value;
    if (/^\d{0,1}$/.test(value)) {
      setRegSSN2(value);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:9999/api/auth/signup', {
        memberName
      });
      navigate('/signup-success');
    } catch (err) {
      setError('가입 중 오류 발생');
    }
  };


  return (
    <div className={styles.loginFormOverbox}>
      <div className={styles.loginFormTitle}>회원가입</div>
      <form onSubmit={handleRegister}>
        <div className={styles.loginFormInput}>
          <input
            type="text"
            id="regName"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            required
            placeholder=" "
          />
          <label htmlFor="regName">이름</label>
          <span className={styles.loginFormSpin}></span>
        </div>
        <div className={`${styles.loginFormInput} ${styles.loginFormSSN}`}>
          <input
            type="text"
            id="regSSN1"
            value={regSSN1}
            onChange={handleSSN1Change}
            maxLength="6"
            required
            placeholder=" "
          />
          <label htmlFor="regpass">생년월일</label>
          <span className={styles.loginFormSpin}></span>
          <span>-</span>
          <input
            type="text"
            id="regSSN2"
            value={regSSN2}
            onChange={handleSSN2Change}
            ref={regSSN2Ref}
            maxLength="1"
            required
          />
          <span className="filled-circles">●●●●●●</span>
          <span className={styles.loginFormSpin}></span>
        </div>
        <div className={styles.loginFormButton}>
          <button><span>다음</span></button>
        </div>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RegisterForm;
