import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import anime from 'animejs';
import styles from './css/LoginForm.module.css';
import NaverLoginButton from './NaverLoginButton';
import KakaoLoginButton from './KakaoLoginButton';
import { AuthContext } from '../../../services/AuthContext';
import ModalPopup from '../../modalPopup/ModalPopup';

const LoginForm = () => {
    const [memberId, setMemberId] = useState('');
    const [memberPasswd, setMemberPasswd] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated, setRoles } = useContext(AuthContext);

    useEffect(() => {
        if (isAuthenticated) {
            setModalMessage('이미 로그인한 상태입니다');
            setShowModal(true);
        }
    }, [isAuthenticated]);


    useEffect(() => {
        let current = null;

        const idInput = document.querySelector('#memberId');
        const passwordInput = document.querySelector('#memberPasswd');
        const submitButton = document.querySelector('#submit');
        const hoverPath = document.querySelector('#hoverPath');
        const mainPath = document.querySelector('#mainPath');

        const handleFocus = (offset, dasharray) => {
            if (current) current.pause();
            current = anime({
                targets: mainPath,
                strokeDashoffset: {
                    value: offset,
                    duration: 700,
                    easing: 'easeOutQuart'
                },
                strokeDasharray: {
                    value: dasharray,
                    duration: 700,
                    easing: 'easeOutQuart'
                }
            });
        };

        idInput.addEventListener('focus', () => handleFocus(0, '240 1386'));
        passwordInput.addEventListener('focus', () => handleFocus(-336, '240 1386'));

        submitButton.addEventListener('mouseover', () => {
            hoverPath.classList.add(styles.loginFormShowPath, styles.loginFormPathAnimation);
        });

        submitButton.addEventListener('mouseout', () => {
            hoverPath.classList.remove(styles.loginFormShowPath, styles.loginFormPathAnimation);
        });

        return () => {
            idInput.removeEventListener('focus', () => handleFocus(0, '240 1386'));
            passwordInput.removeEventListener('focus', () => handleFocus(-336, '240 1386'));
            submitButton.removeEventListener('mouseover', () => {
                hoverPath.classList.add(styles.loginFormShowPath, styles.loginFormPathAnimation);
            });
            submitButton.removeEventListener('mouseout', () => {
                hoverPath.classList.remove(styles.loginFormShowPath, styles.loginFormPathAnimation);
            });
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9999/api/auth/login', {
                memberId,
                memberPasswd
            });
            console.log('Login response:', response.data);
            const { token } = response.data;
            localStorage.setItem('token', token);

            const decodedToken = jwtDecode(token);

            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                setError('로그인 유효 시간이 만료됐습니다. 다시 로그인해주세요.');
                localStorage.removeItem('token');
                return;
            }

            setIsAuthenticated(true);
            setRoles(decodedToken.role);

            const userRole = decodedToken.role;
            if (userRole.includes('ROLE_ADMIN')) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('id 또는 비밀번호 오류');
        }
    };

    const goToRegisterForm = () => {
        navigate('/register');
    };

    const handleModalClose = () => {
        setShowModal(false);
        navigate('/productPage');
    };

    return (
        <div className={styles.loginFormPage}>
            <ModalPopup
                show={showModal}
                message={modalMessage}
                onClose={handleModalClose}
                onConfirm={handleModalClose}
                isConfirmation={false}
            />
            <div className={styles.loginFormContainer}>
                <div className={styles.loginFormLeft}>
                    <div className={styles.loginFormLogin}>Login</div>
                    {error && <div className={styles.loginFormErrormessages}>{error}</div>}
                </div>
                <div className={styles.loginFormRight}>
                    <svg className={styles.svgBackground} viewBox="0 0 320 600">
                        <defs>
                            <linearGradient id="linearGradient" x1="13" y1="193.49992" x2="307" y2="193.49992" gradientUnits="userSpaceOnUse">
                                <stop offset="0" style={{ stopColor: '#000000' }} />
                                <stop offset="1" style={{ stopColor: '#ffffff' }} />
                            </linearGradient>
                        </defs>
                        <path id="mainPath" className={styles.loginFormPath} d="m 40,120.00016 239.99984,-3.2e-4 c 0,0 24.99263,0.79932 25.00016,35.00016 0.008,34.20084 -25.00016,35 -25.00016,35 h -239.99984" fill="none" />
                        <path id="hoverPath" className={`${styles.loginFormPath} ${styles.loginFormHiddenPath}`} d="m 65, 320.00032 h 190 c 0,0 20,-0.99604 20,-25 0,-24.00396 -20,-25 -20,-25 h -190 c 0,0 -20,1.71033 -20,25 0,24.00396 20,25 20,25 h 190 c 0,0 20,-0.99604 20,-25 0,-24.00396 -20,-25 -20,-25 h -190" fill="none" />
                    </svg>
                    <div className={styles.loginFormInput}>
                        <form onSubmit={handleLogin}>
                            <label htmlFor="memberId">회원 아이디</label>
                            <input
                                type="text"
                                id="memberId"
                                value={memberId}
                                onChange={(e) => setMemberId(e.target.value)}
                                required
                            />
                            <label htmlFor="memberPasswd">비밀번호</label>
                            <input
                                type="password"
                                id="memberPasswd"
                                value={memberPasswd}
                                onChange={(e) => setMemberPasswd(e.target.value)}
                                required
                            />
                            <div className={styles.idPasswdRecovery}>
                                <button type="button" className={styles.loginRecovery} lang="ko">아이디 찾기</button>
                                <span className={styles.loginSeparator}>|</span>
                                <button type="button" className={styles.loginRecovery} lang="ko">비밀번호 찾기</button>
                            </div>
                            <input
                                type="submit"
                                id="submit"
                                value="로그인"
                                lang="ko"
                                className={styles.loginButton}
                            />
                            <input
                                type="button"
                                id="submit"
                                value="회원가입"
                                lang="ko"
                                className={styles.loginButton}
                                onClick={goToRegisterForm}
                            />
                        </form>
                        <div className={styles.socialLoginButtons}>
                            <NaverLoginButton />
                            <KakaoLoginButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
