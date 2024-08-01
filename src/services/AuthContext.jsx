import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [roles, setRoles] = useState([]);

  const checkTokenValidity = async () => {
    const token = localStorage.getItem('token');
    const tokenProvider = localStorage.getItem('tokenProvider');

    // console.log('Checking token validity', { token, tokenProvider });

    if (token) {
      if (tokenProvider === 'naver') {
        await validateNaverToken(token);
      } else if (tokenProvider === 'kakao') {
        await validateKakaoToken(token);
      } else {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          console.log('Decoded token', decodedToken);
          if (decodedToken.exp < currentTime) {
            console.log('Token expired');
            handleLogout();
          } else {
            console.log('Token is valid');
            setIsAuthenticated(true);
            setProfile(decodedToken);
            setRoles(decodedToken.role); // Expecting role to be an array
          }
        } catch (error) {
          console.error('Failed to decode token:', error.message);
          handleLogout();
        }
      }
    } else {
      setIsAuthenticated(false);
      setRoles([]);
    }
    setLoading(false);
  };

  const validateNaverToken = async (token) => {
    try {
      /*const response = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
       setProfile({
          name: response.data.response.name,
          email: response.data.response.email,
        }); */
      setIsAuthenticated(true);
      setRoles(['ROLE_USER']);
    } catch (error) {
      console.error('네이버 토큰 검증 실패:', error.message);
      handleLogout();
    }
  };

  const validateKakaoToken = async (token) => {
    try {
      /* const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile({
        nickname: response.data.properties.nickname,
      }); */
      setIsAuthenticated(true);
      setRoles(['ROLE_USER']);
    } catch (error) {
      console.error('카카오 토큰 검증 실패:', error.message);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenProvider');
    setIsAuthenticated(false);
    setRoles([]);
    setProfile(null);
  };

  useEffect(() => {
    checkTokenValidity();
  }, []);

  const handleOAuthCallback = async (accessToken, provider) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('tokenProvider', provider);
    if (provider === 'naver') {
      await validateNaverToken(accessToken);
    } else if (provider === 'kakao') {
      await validateKakaoToken(accessToken);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile, roles, setRoles, handleOAuthCallback, handleLogout }}>
      {!loading ? children : <div>로딩 중</div>}
    </AuthContext.Provider>
  );
};
