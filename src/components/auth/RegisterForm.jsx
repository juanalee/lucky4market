import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import styles from './RegisterForm.module.css';

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
      navigate('/signupSuccess');
    } catch (err) {
      setError('가입 중 오류 발생');
    }
  };

  // Apply SVG path animations
  useEffect(() => {
    let current = null;

    const nameInput = document.querySelector('#memberName');
    const SSNInput = document.querySelector('#memberName');
    const passwordInput = document.querySelector('#memberPasswd');
    const submitButton = document.querySelector('#submit');
    const hoverPath = document.querySelector('#hoverPath');
    const mainPath = document.querySelector('#mainPath');

    const handleFocus = (offset, dasharray) => {
      if (current) current.pause();
      current = anime({
        targets: mainPath,
        strokeDashoffset: {
          value: offset,
          duration: 700,
          easing: 'easeOutQuart'
        },
        strokeDasharray: {
          value: dasharray,
          duration: 700,
          easing: 'easeOutQuart'
        }
      });
    };
  }, []);

  return (
    <div className={styles.registerFormPage}>
      <div className={styles.registerFormContainer}>
        <div className={styles.registerFormLeft}>
          <div className={styles.registerFormTitle}>Join</div>
        </div>
        <div className={styles.registerFormRight}>
          <svg className={styles.svgBackground} viewBox="0 0 320 600">
            {/* SVG paths */}
          </svg>
          <form onSubmit={handleRegister}>
            <div className={styles.registerFormInput}>
              <input
                type="text"
                id="regName"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                required
                placeholder=" "
              />
              <label htmlFor="regName">이름</label>
            </div>
            <div className={`${styles.registerFormInput} ${styles.registerFormSSN}`}>
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
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div className={styles.registerFormButton}>
                <button><span>다음</span></button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
