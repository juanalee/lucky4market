import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Login/css/LoginForm.module.css';
import registerStyles from './css/RegisterForm.module.css';
import registerScss from './css/RegisterFormAddon.module.css';
import ModalPopup from '../../modalPopup/ModalPopup';

const RegisterForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [memberName, setMemberName] = useState(state?.memberName || '');
  const [memberPhoneNo, setMemberPhoneNo] = useState(state?.memberPhoneNo || '');
  const [additionalField, setAdditionalField] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!state?.memberName || !state?.memberPhoneNo) {
      // Handle missing state, redirect or show an error
      navigate('/preRegister');
    }
  }, [state, navigate]);

  const handleAdditionalFieldChange = (e) => {
    setAdditionalField(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9999/api/auth/registerMember', {
        memberName,
        memberPhoneNo,
        additionalField
      });

      if (response.status === 200) {
        console.log('회원 등록 성공');
        // Handle successful registration
      }
    } catch (error) {
      console.log('회원 등록 오류:', error);
      setError('회원 등록 중 오류가 발생했습니다');
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={registerStyles.registerFormPage}>
      <div className={registerStyles.registerFormContainer}>
        <div className={registerStyles.registerFormLeft}>
          <div className={registerStyles.registerFormTitle}>Join</div>
        </div>
        <div className={registerStyles.registerFormRight}>
          <div className={registerStyles.registerFormInput}>
            <form onSubmit={handleSubmit}>
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

export default RegisterForm;
