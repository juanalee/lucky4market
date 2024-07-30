import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../services/AuthContext';
import ModalPopup from '../../modalPopup/ModalPopup';

const KakaoAuthCallback = () => {
  const { handleOAuthCallback } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const accessToken = query.get('access_token');

    console.log('엑세스 토큰:', accessToken);

    const processOAuthCallback = async (accessToken) => {
      try {
        await handleOAuthCallback(accessToken, 'kakao');
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
      setModalMessage('액세스 토큰 발급받기 실패');
      setShowModal(true);
    }
  }, [handleOAuthCallback, navigate, location]);

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

export default KakaoAuthCallback;
