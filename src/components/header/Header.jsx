import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './css/Header.module.css';
import Chat from './Header_ChatList';
import { AuthContext } from '../../services/AuthContext';
import axios from 'axios';

export default function Header() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [categoryAllInfo, setCategoryAllInfo] = useState([]);
  const [productCategoryList, setProductCategoryList] = useState([]);
  const [parentNumber, setParentNumber] = useState(null);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0); // Unread messages count
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const navigateLogin = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const chatWidth = () => {
    if (!isAuthenticated) {
      navigateLogin();
      return;
    }
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get('https://lucky4market.me/api/product/category/list');
        setCategoryAllInfo(categoryResponse.data);
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (parentNumber !== null) {
      const fetchProductCategories = async () => {
        try {
          const response = await axios.get(`https://lucky4market.me/api/product/category/list/${parentNumber}`);
          setProductCategoryList(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchProductCategories();
    } else {
      setProductCategoryList([]);
    }
  }, [parentNumber]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenProvider');
    setIsAuthenticated(false);
    navigate(0);
  };

  const handleSearch = () => {
    navigate(`/search?query=${searchValue}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleHome = () => {
    navigate('/');
  }

  return (
    <>
      <div className={styles.header_container}>
        <div className={styles.header}>
          <div className={styles.link_container}>
            {isAuthenticated ? (
              <Link to="/" onClick={handleLogout} className={styles.logoutButton}>
                로그아웃
              </Link>
            ) : (
              <Link to="/login">로그인/회원가입</Link>
            )}
            <Link to="/myStore">내상점</Link>
          </div>
          <div className={styles.search_container}>
            <div className={styles.headerLogoContainer} onClick={handleHome}>
              <img src='/img/lm_logo_default_black.png' className={styles.logoImg} alt='logo'></img>
              <h1>럭키마켓</h1>
            </div>
            <input
              type="text"
              name="search"
              placeholder="검색어를 입력하세요"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <img src='/img/search.png' className={styles.search_img} onClick={handleSearch} alt='search' />
          </div>
          <nav className={styles.nav_container}>
            <ul className={styles.main_category_container}>
              <li className={styles.first_category}
                onMouseEnter={() => setIsSubCategoryOpen(true)}
                onMouseLeave={() => setIsSubCategoryOpen(false)}
              >
                <div className={styles.menu}>
                  <img src='/img/menu.png' className={styles.menu_bar} alt='menu' />
                  <p>카테고리</p>
                </div>
                <div className={`${styles.category_container} ${isSubCategoryOpen ? styles.open : ''}`}>
                  <ul className={styles.category}>
                    {categoryAllInfo.map((main) => (
                      <li
                        key={main.categoryNo}
                        className={styles.main_category}
                        onMouseEnter={() => setParentNumber(main.categoryNo)}
                        onMouseLeave={() => setParentNumber(null)}
                      >
                        <a href={`/search?parentCategoryNo=${main.categoryNo}`}>{main.categoryName}</a>
                        {parentNumber === main.categoryNo && (
                          <div className={styles.sub_category_container}>
                            <div className={styles.sub_category_block}>
                              <ul className={styles.sub_category}>
                                {productCategoryList.map((sub) => (
                                  <li key={sub.categoryNo}>
                                    <a href={`/search?categoryNo=${sub.categoryNo}`}>{sub.categoryName}</a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className={styles.menu}><Link to={`/search?maxPrice=0`}>무료 나눔</Link></li>
              <li className={styles.menu}><Link to={`/interestProduct`}>찜한 상품</Link></li>
            </ul>
            <ul className={styles.menu_item_container}>
              <div className={styles.menu_item}>
                <img src='/img/money.png' alt='money' />
                <li><Link to='/productRegister'>판매하기</Link></li>
              </div>
              <div className={styles.menu_item}>
                <img src='/img/profile.png' alt='profile' />
                <li><Link to='/myStore'>내상점</Link></li>
              </div>
              <div className={styles.menu_item}>
                <img src='/img/chat.png' alt='chat' />
                <li>
                  <button onClick={chatWidth} className={styles.chatButton}>
                    채팅하기
                    {unreadMessages > 0 && <span className={styles.chatBadge}>{unreadMessages}</span>}
                  </button>
                </li>
              </div>
            </ul>
          </nav>
        </div>
        <Chat isChatOpen={isChatOpen} onClose={closeChat} />
      </div>
      <div className={styles.header_hr}>
        <hr />
      </div>
    </>
  );
}
