import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './IdPasswdRecovery.module.css';
import NewPasswdForm from './NewPasswdForm';
import ModalPopup from '../../modalPopup/ModalPopup';

const PasswdResetForm = ({ activeTab }) => {
  const [memberName, setMemberName] = useState('');
  const [memberNameError, setMemberNameError] = useState('');
  const [memberId, setMemberId] = useState('');
  const [memberIdError, setMemberIdError] = useState('');
  const [recPNo1, setRecPNo1] = useState('');
  const [recPNo2, setRecPNo2] = useState('');
  const [recPNo3, setRecPNo3] = useState('');
  const [phoneNoError, setPhoneNoError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const recPNo2Ref = useRef(null);
  const recPNo3Ref = useRef(null);

  const handleMemberIdChange = (e) => {
    const value = e.target.value;
    setMemberId(value);
    if (!value.trim()) {
      setMemberIdError('회원 아이디를 입력해 주세요');
    } else {
      setMemberIdError('');
    }
  };

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

    let idError = '';
    let nameError = '';
    let phoneError = '';

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

    // 회원 아이디 입력 확인
    if (!memberId) {
      idError = '회원 아이디를 입력해 주세요';
    }

    // 이름 입력 확인
    if (!memberName) {
      nameError = '이름을 입력해 주세요';
    }

    setMemberIdError(idError);
    setMemberNameError(nameError);
    setPhoneNoError(phoneError);

    // 오류가 있는 경우 진행X
    if (phoneError || nameError || idError) {
      return;
    }

    try {
      const response = await axios.post('https://lucky4market.me/api/auth/checkMemberMatch', {
        memberName,
        memberId,
        memberPhoneNo
      });

      if (response.status === 200) {
        setShowNewPasswordForm(true);
      } else {
        setResponseMessage('일치하는 회원 정보가 존재하지 않습니다');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      setResponseMessage('일치하는 회원 정보를 찾을 수 없습니다');
    }
  };

  const handlePasswdReset = async (newPasswd) => {
    console.log('Submitting new password:', newPasswd);
    try {
      const response = await axios.post('https://lucky4market.me/api/auth/resetPassword', {
        memberId,
        memberPasswd: newPasswd
      });

      if (response.data.success) {
        setResponseMessage('비밀번호가 성공적으로 재설정되었습니다.');
        setShowModal(true); // 재설정 성공 시
        navigate('/login');
      } else {
        //일반적인 실패 메시지
        setResponseMessage('비밀번호 재설정에 실패했습니다.');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      if (error.response && error.response.status === 400) {//서버에서 돌아온 메시지가 있는 경우
        setResponseMessage(error.response.data || '비밀번호 재설정에 실패했습니다.');
      } else {
        // 기타 오류
        setResponseMessage('비밀번호 설정 중 오류가 발생했습니다.');
      }
      setShowModal(true);
    }
  };


  return (
    <div className={styles.recoveryFormBox} >
      {showNewPasswordForm ? (
        <NewPasswdForm onSubmit={handlePasswdReset} />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={styles.recoveryFormGroup}>
            <label htmlFor="recId">회원 아이디</label>
            <input
              type="text"
              id="recId"
              className={styles.recoveryFormControl}
              value={memberId}
              onChange={handleMemberIdChange}
              onBlur={() => handleBlurMultipleInputs([memberId], setMemberIdError, '회원 아이디를 입력해 주세요')}
              required
            />
          </div>
          <p className={`${styles.recoveryFormErrorText} ${memberIdError ? styles.recoveryFormVisible : ''}`}>
            {memberIdError || ' '}
          </p>
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
          {responseMessage && (
            <div
              className={styles.recoveryResponseMessage}
              dangerouslySetInnerHTML={{ __html: responseMessage }}
            />
          )}
          <button type="submit" className={styles.recoverySubmitButton} >
            {activeTab === 'id' ? '아이디 찾기' : '비밀번호 재설정'}
          </button>
        </form>
      )}
      <ModalPopup
        show={showModal}
        onClose={() => setShowModal(false)}
        message={responseMessage}
      />
    </div>
  );
};

export default PasswdResetForm;
