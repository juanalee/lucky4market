import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import styles from './AdminHeader.module.css';
import { AuthContext } from '../../../services/AuthContext';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [memberNick, setMemberNick] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken); 
      const memberId = decodedToken.sub;

      const fetchMemberNick = async () => {
        try {
          const response = await axios.get(`http://localhost:9999/admin/adminNickname/${memberId}`);
          console.log('API Response:', response.data);
          setMemberNick(response.data.memberNick);
        } catch (error) {
          console.error('관리자 닉네임 가져오기 실패:', error);
          if (error.response && error.response.status === 403) {
            console.error('403 error 접근 제한');
          }
        }
      };

      fetchMemberNick();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenProvider');
    setIsAuthenticated(false);
  };

  return (
    <div className={styles.adminHeaderContainer}>
      <div className={styles.adminHeader}>
        <div className={styles.adminHeaderTop}>
          <div className={styles.adminHeaderLeftSection}>
            <div className={styles.adminHeaderLogo}>
              <img src="/img/lm_symbol_only.png" alt="symbol" />
            </div>
            <span className={styles.adminHeaderTitle}>관리자</span>
          </div>
          <div className={styles.adminHeaderRightSection}>
          <span className={styles.adminHeaderInfo}>{memberNick}님</span>
            <NavLink to="/" className={styles.adminHeaderLogoutLink} onClick={handleLogout}>로그아웃</NavLink>
          </div>
        </div>
        <div className={styles.adminHeaderBottom}>
          <NavLink to="/admin/members" className={styles.adminHeaderLink}>회원관리</NavLink>
          <NavLink to="/admin/reports" className={styles.adminHeaderLink}>신고관리</NavLink>
          <NavLink to="/admin/products" className={styles.adminHeaderLink}>상품관리</NavLink>
          <NavLink to="/admin/categories" className={styles.adminHeaderLink}>카테고리 관리</NavLink>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;