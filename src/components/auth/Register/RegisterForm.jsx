import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Login/css/LoginForm.module.css';
import registerStyles from './css/RegisterForm.module.css';
import registerScss from './css/RegisterFormAddon.module.css';
import ModalPopup from '../../modalPopup/ModalPopup';

const RegisterMemberForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [memberName, setMemberName] = useState(state?.memberName || '');
  const [memberPhoneNo, setMemberPhoneNo] = useState(state?.memberPhoneNo || '');
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [memberIdError, setMemberIdError] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [memberPasswd, setMemberPasswd] = useState('');
  const [memberPasswdConfirm, setMemberPasswdConfirm] = useState('');
  const [passwdError, setPasswdError] = useState('');
  const [passwdConfirmError, setPasswdConfirmError] = useState('');
  const [emailId, setEmailId] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailOption, setEmailOption] = useState('');
  const [additionalField, setAdditionalField] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!state?.memberName || !state?.memberPhoneNo) {
      setError('회원 등록 중 오류가 발생했습니다. 본인 인증을 다시 진행해주세요.');
      setShowModal(true);
      setShouldNavigate(true);
    }
  }, [state]);

  const handleMemberIdChange = (e) => {
    const value = e.target.value;
    setMemberId(value);
    setIsIdChecked(false);
    if (!value.trim()) {
      setMemberIdError('아이디를 입력해주세요');
    } else {
      setMemberIdError('');
    }
  };

  const handlePasswdChange = (e) => {
    const value = e.target.value;
    setMemberPasswd(value);
    if (!value.trim() || value.length < 8 || !/[A-Za-z]/.test(value) || !/\d/.test(value)) {
      setPasswdError('비밀번호는 다음 조건을 만족해야 합니다: 8자리 이상 /영문자, 숫자 혼합');
    } else {
      setPasswdError('');
    }
  };

  const handlePasswdConfirmChange = (e) => {
    const value = e.target.value;
    setMemberPasswdConfirm(value);
    if (value !== memberPasswd) {
      setPasswdConfirmError('비밀번호가 일치하지 않습니다');
    } else {
      setPasswdConfirmError('');
    }
  };

  const handleEmailIdChange = (e) => {
    setEmailId(e.target.value);
  };

  const handleEmailDomainChange = (e) => {
    const value = e.target.value;
    setEmailDomain(value);
    if (emailOption === "직접 입력" && !value.includes('.')) {
      setEmailError('도메인 이름이 올바른지 확인해주세요');
    } else {
      setEmailError('');
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailOption(value);
    if (value === "직접 입력") {
      setEmailDomain('');
    } else {
      setEmailDomain(value);
    }
  };

  const handleAdditionalFieldChange = (e) => {
    setAdditionalField(e.target.value);
  };

  const checkDuplicateMemberId = async () => {
    if (!memberId.trim()) {
      setMemberIdError('아이디를 입력해 주세요');
      return;
    }

    try {
      const response = await axios.post('http://localhost:9999/api/auth/checkMemberId', {
        memberId
      });

      if (response.data.exists) {
        setMemberIdError('이미 가입된 아이디입니다');
        setIsIdChecked(false);
      } else {
        setMemberIdError('사용 가능한 아이디입니다');
        setIsIdChecked(true);
      }
    } catch (error) {
      console.log('아이디 중복 확인 오류:', error);
      setMemberIdError('알 수 없는 오류가 발생했습니다');
      setIsIdChecked(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!memberId.trim()) {
      setMemberIdError('아이디를 입력해주세요');
    }
    if (!isIdChecked) {
      setMemberIdError('아이디 중복 확인을 해주세요');
    }
    if (!memberPasswd.trim() || memberPasswd.length < 8 || !/[A-Za-z]/.test(memberPasswd) || !/\d/.test(memberPasswd)) {
      setPasswdError('비밀번호는 다음 조건을 만족해야 합니다: 8자리 이상 /영문자, 숫자 혼합');
    }
    if (memberPasswd !== memberPasswdConfirm) {
      setPasswdConfirmError('비밀번호가 일치하지 않습니다');
    }
    if (!emailId.trim() || !emailDomain.trim()) {
      setEmailError('이메일을 입력해 주세요');
    } else if (emailOption === "직접 입력" && !emailDomain.includes('.')) {
      setEmailError('도메인 이름이 올바른지 확인해주세요');
    }

    if (memberIdError || passwdError || passwdConfirmError || emailError) {
      return;
    }

    const memberEmail = `${emailId}@${emailDomain}`;

    try {
      const response = await axios.post('http://localhost:9999/api/auth/registerMember', {
        memberId,
        memberPasswd,
        memberEmail,
        memberName,
        memberPhoneNo,
        additionalField
      });

      if (response.status === 200) {
        navigate('/success');
      }
    } catch (error) {
      console.log('회원 등록 오류:', error);
      setError('알 수 없는 오류가 발생했습니다');
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (shouldNavigate) {
      navigate('/register');
    }
  };

  return (
    <div className={registerStyles.registerFormPage}>
      <div className={registerStyles.registerFormContainer}>
        <div className={registerStyles.registerFormLeft}>
          <div className={registerStyles.registerFormTitle}>Join</div>
        </div>
        <div className={registerStyles.registerFormRight}>
          <div className={registerStyles.registerFormInput}>
            <form onSubmit={handleRegister}>
              <div className={registerStyles.registerFormInputBox}>
                <label htmlFor="memberId">아이디</label>
                <div className={registerStyles.registerFormInputWithButton}>
                  <input
                    className={registerStyles.registerFormInputField}
                    type="text"
                    id="memberId"
                    value={memberId}
                    onChange={handleMemberIdChange}
                    onBlur={() => {
                      if (!isIdChecked) setMemberIdError('아이디 중복 확인을 해주세요');
                    }}
                    required
                    placeholder="아이디"
                  />
                  <button
                    type="button"
                    className={registerStyles.checkButton}
                    onClick={checkDuplicateMemberId}
                  >
                    중복확인
                  </button>
                </div>
              </div>
              <p className={`${registerStyles.registerFormErrorText} ${memberIdError ? registerStyles.visible : ''}`}
                style={{ visibility: memberIdError ? 'visible' : 'hidden' }}>
                {memberIdError || ' '}
              </p>
              <div className={registerStyles.registerFormInputBox}>
                <label htmlFor="memberPasswd">비밀번호</label>
                <input
                  className={registerStyles.registerFormInputField}
                  type="password"
                  id="memberPasswd"
                  value={memberPasswd}
                  onChange={handlePasswdChange}
                  required
                  placeholder="비밀번호"
                />
              </div>
              <p className={`${registerStyles.registerFormErrorText} ${passwdError ? registerStyles.visible : ''}`}
                style={{ visibility: passwdError ? 'visible' : 'hidden' }}>
                {passwdError || ' '}
              </p>
              <div className={registerStyles.registerFormInputBox}>
                <label htmlFor="memberPasswdConfirm">비밀번호 확인</label>
                <input
                  className={registerStyles.registerFormInputField}
                  type="password"
                  id="memberPasswdConfirm"
                  value={memberPasswdConfirm}
                  onChange={handlePasswdConfirmChange}
                  required
                  placeholder="비밀번호 확인"
                />
              </div>
              <p className={`${registerStyles.registerFormErrorText} ${passwdConfirmError ? registerStyles.visible : ''}`}
                style={{ visibility: passwdConfirmError ? 'visible' : 'hidden' }}>
                {passwdConfirmError || ' '}
              </p>
              <div className={registerStyles.registerFormInputBox}>
                <label htmlFor="email">이메일</label>
                <div className={styles.my_info_content}>
                  <input
                    className={styles.my_info_email_item}
                    type="text"
                    name="email"
                    value={emailId}
                    onChange={handleEmailIdChange}
                    required
                    placeholder="이메일 아이디"
                  />@
                  <input
                    className={styles.my_info_email_item}
                    type="text"
                    name="email_domain"
                    value={emailDomain}
                    onChange={handleEmailDomainChange}
                    readOnly={emailOption !== "직접 입력"}
                    required
                  />
                  <select className={styles.my_info_select_email} onChange={handleEmailChange}>
                    <option value="">선택하세요</option>
                    <option value="naver.com">naver.com</option>
                    <option value="daum.net">daum.net</option>
                    <option value="gmail.com">gmail.com</option>
                    <option value="nate.com">nate.com</option>
                    <option value="직접 입력">직접 입력</option>
                  </select>
                </div>
              </div>
              <p className={`${registerStyles.registerFormErrorText} ${emailError ? registerStyles.visible : ''}`}
                style={{ visibility: emailError ? 'visible' : 'hidden' }}>
                {emailError || ' '}
              </p>
              <div className={registerStyles.registerFormInputBox}>
                <label htmlFor="additionalField">추가 필드</label>
                <input
                  className={registerStyles.registerFormInputField}
                  type="text"
                  id="additionalField"
                  value={additionalField}
                  onChange={handleAdditionalFieldChange}
                  required
                  placeholder=" "
                />
              </div>
              <div className={registerScss.buttonWrapper}>
                <input
                  type="submit"
                  id="submit"
                  value="등록"
                  lang="ko"
                  className={styles.loginFormButton}
                />
              </div>
            </form>
          </div>
        </div >
      </div >
      {showModal && (
        <ModalPopup
          show={showModal}
          message={error}
          onClose={closeModal}
        />
      )}
    </div >
  );
};

export default RegisterMemberForm;
