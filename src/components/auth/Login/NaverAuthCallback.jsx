import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../services/AuthContext';
import ModalPopup from '../../modalPopup/ModalPopup';

const NaverAuthCallback = () => {
  const { handleOAuthCallback } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');

    console.log('Access token received:', accessToken);

    const processOAuthCallback = async (accessToken) => {
      try {
        await handleOAuthCallback(accessToken, 'naver');
        setLoading(false);
        navigate('/productPage');
      } catch (error) {
        console.error('OAuth 콜백 처리 실패:', error.message);
        setModalMessage('OAuth 콜백 처리 실패');
        setShowModal(true);
      }
    };

    if (accessToken) {
      processOAuthCallback(accessToken);
    } else {
      //토큰이 없을 시
      setModalMessage('토큰 가져오기 실패');
      setShowModal(true);
    }
  }, [handleOAuthCallback, navigate]);

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div>
      {loading ? (
        <p>로그인 처리 중...</p>
      ) : (
        <div>
          <p>로그인 성공</p>
        </div>
      )}
      <ModalPopup
        show={showModal}
        onClose={handleModalClose}
        onConfirm={handleModalClose}
        message={modalMessage}
        isConfirmation={false}
      />
    </div>
  );
};

export default NaverAuthCallback;
