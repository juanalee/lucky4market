import React, { useState } from 'react';
import styles from './IdPasswdRecovery.module.css';

const NewPasswordForm = ({ onSubmit }) => {
  const [newPasswd, setNewPasswd] = useState('');
  const [confirmPasswd, setConfirmPasswd] = useState('');
  const [newPasswdError, setNewPasswdError] = useState('');
  const [confirmPasswdError, setConfirmPasswdError] = useState('');

  // 입력되는 비밀번호 실시간으로 점검 
  const handleNewPasswdChange = (e) => {
    const value = e.target.value;
    setNewPasswd(value);
    if (!value.trim() || value.length < 8 || !/[A-Za-z]/.test(value) || !/\d/.test(value)) {
      setNewPasswdError('비밀번호는 다음 조건을 만족해야 합니다: 8자리 이상 / 영문자, 숫자 혼합');
    } else {
      setNewPasswdError('');
    }
  };

  // 입력되는 비밀번호 확인 실시간으로 점검
  const handleConfirmPasswdChange = (e) => {
    const value = e.target.value;
    setConfirmPasswd(value);
    if (newPasswd !== value) {
      setConfirmPasswdError('비밀번호가 일치하지 않습니다');
    } else {
      setConfirmPasswdError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    // 폼 제출 전 최종 점검
    if (!newPasswd.trim() || newPasswd.length < 8 || !/[A-Za-z]/.test(newPasswd) || !/\d/.test(newPasswd)) {
      setNewPasswdError('비밀번호는 다음 조건을 만족해야 합니다: 8자리 이상 / 영문자, 숫자 혼합');
      hasError = true;
    }
    if (newPasswd !== confirmPasswd) {
      setConfirmPasswdError('비밀번호가 일치하지 않습니다');
      hasError = true;
    }

    if (!hasError) {
      onSubmit(newPasswd);
    }
  };

  return (
    <form className={styles.recoveryFormNewBox} onSubmit={handleSubmit}>
      <div className={styles.recoveryFormGroup}>
        <label htmlFor="newPasswd">새로운 비밀번호</label>
        <input
          type="password"
          id="newPasswd"
          className={styles.recoveryFormControl}
          value={newPasswd}
          onChange={handleNewPasswdChange}
          required
        />
      </div>
      <p className={`${styles.recoveryFormErrorText} ${newPasswdError ? styles.recoveryFormVisible : ''}`}>
        {newPasswdError || ' '}
      </p>
      <div className={styles.recoveryFormGroup}>
        <label htmlFor="confirmPasswd">새 비밀번호 확인</label>
        <input
          type="password"
          id="confirmPasswd"
          className={styles.recoveryFormControl}
          value={confirmPasswd}
          onChange={handleConfirmPasswdChange}
          required
        />
      </div>
      <p className={`${styles.recoveryFormErrorText} ${confirmPasswdError ? styles.recoveryFormVisible : ''}`}>
        {confirmPasswdError || ' '}
      </p>
      <button type="submit" className={styles.recoverySubmitButton}>
        비밀번호 재설정하기
      </button>
    </form>
  );
};

export default NewPasswordForm;
