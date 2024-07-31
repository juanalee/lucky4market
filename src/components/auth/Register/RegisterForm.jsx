import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Login/css/LoginForm.module.css';
import registerStyles from './css/RegisterForm.module.css';
import ModalPopup from '../../modalPopup/ModalPopup';

const RegisterMemberForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [memberName] = useState(state?.memberName || '');
  const [memberPhoneNo] = useState(state?.memberPhoneNo || '');
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
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [consentError, setConsentError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!state?.memberName || !state?.memberPhoneNo) {
      setError('회원 등록 중 오류가 발생했습니다. 본인 인증을 다시 진행해주세요.');
      setShowModal(true);
      setShouldNavigate(true);
    }
  }, [state]);


  useEffect(() => {
    if (shouldNavigate) {
      navigate('/register');
    }
  }, [shouldNavigate, navigate]);

  const handleMemberIdChange = (e) => {
    const value = e.target.value;
    setMemberId(value);
    setIsIdChecked(false);
    setMemberIdError(''); // 값이 바뀌면 오류 메시지 클리어
  };

  const handlePasswdChange = (e) => {
    const value = e.target.value;
    setMemberPasswd(value);
    setPasswdError(''); // 값이 바뀌면 오류 메시지 클리어
  };

  const handlePasswdConfirmChange = (e) => {
    const value = e.target.value;
    setMemberPasswdConfirm(value);
    setPasswdConfirmError(''); // 값이 바뀌면 오류 메시지 클리어
  };

  const handleEmailIdChange = (e) => {
    setEmailId(e.target.value);
    if (e.target.value.trim() && emailDomain.trim()) {
      setEmailError('');
    }
  };

  const handleEmailDomainChange = (e) => {
    const value = e.target.value;
    setEmailDomain(value);
    if (emailOption === "직접 입력") {
      if (!value.trim()) {
        setEmailError('도메인 이름을 입력해 주세요');
      } else if (!value.includes('.')) {
        setEmailError('도메인 이름이 올바른지 확인해주세요');
      } else {
        setEmailError('');
      }
    } else {
      setEmailError('');
    }
    if (emailId.trim() && value.trim()) {
      setEmailError('');
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailOption(value);
    if (value !== '직접 입력') {
      setEmailDomain(value);
    } else {
      setEmailDomain('');
    }
    if (emailId.trim() && emailDomain.trim()) {
      setEmailError('');
    }
  };
  const checkDuplicateMemberId = async () => {
    if (!memberId.trim()) {
      setMemberIdError('사용하려는 아이디를 입력해 주세요');
      return;
    }

    try {
      const response = await axios.post('http://localhost:9999/api/auth/checkIdAvailability', {
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

  const handleCheckboxChange = () => {
    const newCheckedStatus = !isChecked;
    setIsChecked(newCheckedStatus);
    if (newCheckedStatus) {
      setConsentError('');
    }
    console.log('체크박스 상태 변화됨:', newCheckedStatus);
  };

  const toggleAgreementSection = () => {
    setIsAgreementOpen(!isAgreementOpen);
  };

  const handleRegister = async (e) => {
    e.preventDefault()

    console.log('Register button clicked');
    if (!state?.memberName || !state?.memberPhoneNo) {
      setError('이름, 전화번호 정보가 없습니다');
      setShowModal(true);
      return;
    }

    if (!isChecked) {
      setConsentError('약관에 동의해야 합니다');
      console.log('Consent not given');
      return;
    }

    console.log('Consent given');

    let hasError = false;

    if (!memberId.trim()) {
      setMemberIdError('아이디를 입력해주세요');
      hasError = true;
    } else {
      setMemberIdError('');
    }

    if (!isIdChecked) {
      setMemberIdError('아이디 중복 확인을 해주세요');
      hasError = true;
    }

    if (!memberPasswd.trim() || memberPasswd.length < 8 || !/[A-Za-z]/.test(memberPasswd) || !/\d/.test(memberPasswd)) {
      setPasswdError('비밀번호는 다음 조건을 만족해야 합니다:\n8자리 이상 / 영문자, 숫자 혼합');
      hasError = true;
    } else {
      setPasswdError('');
    }

    if (memberPasswd !== memberPasswdConfirm) {
      setPasswdConfirmError('비밀번호가 일치하지 않습니다');
      hasError = true;
    } else {
      setPasswdConfirmError('');
    }

    if (!emailId.trim() || !emailDomain.trim()) {
      setEmailError('이메일을 입력해 주세요');
      hasError = true;
    } else if (emailOption === "직접 입력" && !emailDomain.includes('.')) {
      setEmailError('도메인 이름이 올바른지 확인해주세요');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (hasError) {
      console.log('Validation errors:', {
        memberIdError,
        passwdError,
        passwdConfirmError,
        emailError,
      });
      return;
    }

    const memberEmail = `${emailId}@${emailDomain}`;

    try {
      const response = await axios.post('http://localhost:9999/api/auth/registerMember', {
        memberId,
        memberName,
        memberPasswd,
        memberEmail,
        memberPhoneNo
      });

      if (response.status === 200) {
        localStorage.setItem('isRegistered', 'true');
        console.log('Registration successful');
        navigate('/registerSuccess');
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
          {loading ? (
            <div className={registerStyles.registerFormLoadingSpinner}>
              <div className={registerStyles.registerFormSpinner}></div>
            </div>
          ) : (
            <div className={registerStyles.registerFormInput}>
              <form className={registerStyles.registerFormFadeIn}>
                <div className={registerStyles.registerFormInputBox}>
                  <label htmlFor="memberId">회원 아이디</label>
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
                    />
                    <button
                      type="button"
                      className={registerStyles.checkIdButton}
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
                  />
                </div>
                <p
                  className={`${registerStyles.registerFormErrorText} ${passwdError ? registerStyles.visible : ''}`}
                  style={{ visibility: passwdError ? 'visible' : 'hidden' }}
                >
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
                  />
                </div>
                <p className={`${registerStyles.registerFormErrorText} ${passwdConfirmError ? registerStyles.visible : ''}`}
                  style={{ visibility: passwdConfirmError ? 'visible' : 'hidden' }}>
                  {passwdConfirmError || ' '}
                </p>
                <div className={registerStyles.registerFormInputBox}>
                  <label htmlFor="email">이메일</label>
                  <div className={registerStyles.registerFormEmail}>
                    <input
                      className={registerStyles.registerFormEmailInputField}
                      type="text"
                      name="email"
                      value={emailId}
                      onChange={handleEmailIdChange}
                      required
                    />@
                    <input
                      className={registerStyles.registerFormEmailInputField}
                      type="text"
                      name="email_domain"
                      value={emailDomain}
                      onChange={handleEmailDomainChange}
                      readOnly={emailOption !== "직접 입력"}
                      required
                    />
                    <select
                      className={`${registerStyles.registerFormEmailInputField} ${emailOption ? registerStyles.shrink : ''}`}
                      onChange={handleEmailChange}
                      value={emailOption}
                    >
                      <option value="">선택</option>
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
                <div className={`${registerStyles.consentContainer} ${isChecked ? registerStyles.consentChecked : ''}`} onClick={toggleAgreementSection}>
                  <label className={registerStyles.consentCheckbox}>
                    <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                    <span className={registerStyles.consentCheckmark}></span>
                  </label>
                  <span>개인정보 수집 이용 동의 (필수)</span>
                  <div className={registerStyles.agreementArrow}><img src="/img/down_arrow.png" alt="Toggle agreement section" /></div>
                </div>
                <div className={`${registerStyles.agreementSection} ${isAgreementOpen ? registerStyles.open : ''}`}>
                  <div className={registerStyles.agreementText}>
                    <p>럭키마켓은 건전한 거래를 지향합니다.</p>
                  </div>
                </div>
                {consentError && (
                  <p className={registerStyles.consentErrorMessage}>{consentError}</p>
                )}
                <div>
                  <button
                    type="submit"
                    id="submit"
                    lang="ko"
                    className={styles.loginFormButton}
                    onClick={handleRegister}
                  >
                    등록
                  </button>
                </div>
              </form>
            </div>
          )}
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
