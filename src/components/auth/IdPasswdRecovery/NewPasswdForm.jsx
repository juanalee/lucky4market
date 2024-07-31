import React, { useState } from 'react';
import styles from './IdPasswdRecovery.module.css';

const NewPasswordForm = ({ onSubmit }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    // 비밀번호 조건 확인
    if (!newPassword.trim() || newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setPasswordError('비밀번호는 다음 조건을 만족해야 합니다:\n8자리 이상 / 영문자, 숫자 혼합');
      hasError = true;
    } else {
      setPasswordError('');
    }

    // 비밀번호 일치 확인
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다');
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }

    // 오류가 있는 경우 진행 안 함
    if (hasError) {
      return;
    }

  
    onSubmit(newPassword);
  };

  return (
    <div className={styles.recoveryFormBox}>
      <form onSubmit={handleSubmit}>
        <div className={styles.recoveryFormGroup}>
          <label htmlFor="newPasswd">새로운 비밀번호</label>
          <input
            type="password"
            id="newPasswd"
            className={styles.recoveryFormControl}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <p className={`${styles.recoveryFormErrorText} ${passwordError ? styles.visible : ''}`}>
          {passwordError || ' '}
        </p>
        <div className={styles.recoveryFormGroup}>
          <label htmlFor="confirmPasswd">새 비밀번호 확인</label>
          <input
            type="password"
            id="confirmPasswd"
            className={styles.recoveryFormControl}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <p className={`${styles.recoveryFormErrorText} ${confirmPasswordError ? styles.visible : ''}`}>
          {confirmPasswordError || ' '}
        </p>
        <button type="submit" className={styles.recoverySubmitButton}>
          Set New Password
        </button>
      </form>
    </div>
  );
};

export default NewPasswordForm;
