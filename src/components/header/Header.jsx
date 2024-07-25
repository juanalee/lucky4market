import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../css/headerCss/header.module.css';
import Backdrop from '../sub_page/Sub_overlay';
import Chat from './Header_ChatList';

export default function Header() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const chatWidth = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      <div className={styles.header_container}>
        <div className={styles.header}>
          <div className={styles.link_container}>
            <Link to="#">로그인/회원가입</Link>
            <Link to="#">내상점</Link>
          </div>
          <div className={styles.search_container}>
            <input type='text' name='search' placeholder='검색어를 입력하세요' />
          </div>
          <nav className={styles.nav_container}>
            <ul className={styles.main_category_container}>
              <li className={styles.first_category}>
                <div className={styles.menu_container}></div>
                <div className={styles.menu}>
                  <img src='/img/menu.png' className={styles.menu_bar} alt='menu' />
                  <p>카테고리</p>
                </div>
                <div className={styles.category_container}>
                  <ul className={styles.category}>
                    <li className={styles.main_category}>
                      <a href='#'>수입명품</a>
                      <div className={styles.sub_category_container}>
                        <div className={styles.sub_category_block}>
                          <ul className={styles.sub_category}>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                          <ul className={styles.sub_category}>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                          <ul className={styles.sub_category}>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li className={styles.main_category}>
                      <a href='#'>수입명품</a>
                      <div className={styles.sub_category_container}>
                        <div className={styles.sub_category_block}>
                          <ul className={styles.sub_category}>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                          <ul className={styles.sub_category}>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                          <ul className={styles.sub_category}>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
              <li className={styles.menu}><Link to='#'>무료 나눔</Link></li>
              <li className={styles.menu}><Link to='#'>찜한 상품</Link></li>
              <li className={styles.menu}><Link to='#'>실시간 시세</Link></li>
            </ul>
            <ul className={styles.menu_item_container}>
              <div className={styles.menu_item}>
                <img src='/img/money.png' alt='money' />
                <li><Link to='#'>판매하기</Link></li>
              </div>
              <div className={styles.menu_item}>
                <img src='/img/profile.png' alt='profile' />
                <li><Link to='#'>내상점</Link></li>
              </div>
              <div className={styles.menu_item}>
                <img src='/img/chat.png' alt='chat' />
                <li><button onClick={chatWidth}>채팅하기</button></li>
              </div>
            </ul>
          </nav>
        </div>
        <Chat isChatOpen={isChatOpen} onClose={closeChat}/>
      </div>
      <div className={styles.header_hr}>
        <hr />
      </div>
    </>
  );
}
