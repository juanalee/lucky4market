import React, { useState, useRef } from 'react';
import axios from 'axios';
import styles from './IdPasswdRecovery.module.css';

const IdRecoverForm = ({ activeTab }) => {
  const [memberName, setMemberName] = useState('');
  const [memberNameError, setMemberNameError] = useState('');
  const [recPNo1, setRecPNo1] = useState('');
  const [recPNo2, setRecPNo2] = useState('');
  const [recPNo3, setRecPNo3] = useState('');
  const [phoneNoError, setPhoneNoError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const recPNo2Ref = useRef(null);
  const recPNo3Ref = useRef(null);

  const handleMemberNameChange = (e) => {
    const value = e.target.value;
    setMemberName(value);
    if (!value.trim()) {
      setMemberNameError('이름을 입력해 주세요');
    } else {
      setMemberNameError('');
    }
  };

  const handlePNo1Change = (e) => {
    const value = e.target.value;
    if (/^\d{0,3}$/.test(value)) {
      setRecPNo1(value);
      if (value.length === 3) {
        recPNo2Ref.current.focus();
      }
      if (value.length === 3 && recPNo2.length >= 3 && recPNo3.length === 4) {
        setPhoneNoError('');
      }
    }
  };

  const handlePNo2Change = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setRecPNo2(value);
      if (value.length === 4) {
        recPNo3Ref.current.focus();
      }
      if (value.length === 3 && recPNo2.length >= 3 && recPNo3.length === 4) {
        setPhoneNoError('');
      }
    }
  };

  const handlePNo3Change = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setRecPNo3(value);
    }
    if (value.length === 3 && recPNo2.length >= 3 && recPNo3.length === 4) {
      setPhoneNoError('');
    }
  };

  const handleBlurMultipleInputs = (inputs, setError, errorMessage) => {
    const allInputsFilled = inputs.every(input => input.trim() !== '');
    if (!allInputsFilled) {
      setError(errorMessage);
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const memberPhoneNo = `${recPNo1}-${recPNo2}-${recPNo3}`;

    let phoneError = '';
    let nameError = '';

    // 전화번호 입력 확인
    const phoneParts = [recPNo1, recPNo2, recPNo3];
    const totalPhoneLength = phoneParts.join('').length;

    if (phoneParts.some(part => part.length === 0)) {
      phoneError = '전화번호를 정확히 입력해주세요';
    } else if (recPNo3.length < 4) {
      phoneError = '전화번호 마지막 4자리를 입력해 주세요';
    } else if (totalPhoneLength < 10) {
      phoneError = '전화번호 전체 10자리 이상을 입력해 주세요';
    }

    // 이름 입력 확인
    if (!memberName) {
      nameError = '이름을 입력해 주세요';
    }

    setPhoneNoError(phoneError);
    setMemberNameError(nameError);

    // 오류가 있는 경우 진행X
    if (phoneError || nameError) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:9999/api/auth/recoverId', {
        memberName,
        memberPhoneNo
      });

      if (response.status === 200 && response.data.memberId) {
        setResponseMessage(`회원님의 아이디는 <strong>${response.data.memberId}</strong> 입니다`);
      } else {
        setResponseMessage('일치하는 회원 정보가 존재하지 않습니다');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      setResponseMessage('일치하는 회원 정보를 찾을 수 없습니다');
    }
  };

  return (
    <div className={styles.recoveryFormBox} >
      <form onSubmit={handleSubmit}>
        <div className={styles.recoveryFormGroup}>
          <label htmlFor="recName">이름</label>
          <input
            type="text"
            id="recName"
            className={styles.recoveryFormControl}
            value={memberName}
            onChange={handleMemberNameChange}
            onBlur={() => handleBlurMultipleInputs([memberName], setMemberNameError, '이름을 입력해 주세요')}
            required
          />
        </div>
        <p className={`${styles.recoveryFormErrorText} ${memberNameError ? styles.recoveryFormVisible : ''}`}>
          {memberNameError || ' '}
        </p>
        <div className={styles.recoveryFormGroup}>
          <label htmlFor="phone">가입 시 입력한 휴대폰 번호</label>
          <div className={styles.recoveryFormPNo}>
            <input
              className={styles.recoveryFormControl}
              type="text"
              id="recPNo1"
              value={recPNo1}
              onChange={handlePNo1Change}
              onBlur={() => handleBlurMultipleInputs([recPNo1], setPhoneNoError, '전화번호를 정확히 입력해주세요')}
              maxLength="3"
              required
            />
            <span className={styles.recoveryFormDash}>-</span>
            <input
              className={styles.recoveryFormControl}
              type="text"
              id="recPNo2"
              ref={recPNo2Ref}
              value={recPNo2}
              onChange={handlePNo2Change}
              onBlur={() => handleBlurMultipleInputs([recPNo1, recPNo2], setPhoneNoError, '전화번호를 정확히 입력해주세요')}
              maxLength="4"
              required
            />
            <span className={styles.recoveryFormDash}>-</span>
            <input
              className={styles.recoveryFormControl}
              type="text"
              id="recPNo3"
              ref={recPNo3Ref}
              value={recPNo3}
              onChange={handlePNo3Change}
              onBlur={() => handleBlurMultipleInputs([recPNo1, recPNo2, recPNo3], setPhoneNoError, '전화번호를 정확히 입력해주세요')}
              maxLength="4"
              required
            />
          </div>
        </div>
        <p className={`${styles.recoveryFormErrorText} ${phoneNoError ? styles.recoveryFormVisible : ''}`}>
          {phoneNoError || ' '}
        </p>
        <div
          className={`${styles.recoveryResponseMessage} ${!responseMessage ? styles.recoveryFormHidden : ''}`}
          dangerouslySetInnerHTML={{ __html: responseMessage }}
        />
        <button type="submit" className={styles.recoverySubmitButton} lang="ko">
          {activeTab === 'id' ? '아이디 찾기' : '비밀번호 재설정'}
        </button>
      </form>
    </div>
  );
};

export default IdRecoverForm;
