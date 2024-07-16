import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../css/headerCss/header.css';

export default () => {
  const chat = useRef();
  const chatArea = useRef();

  const chatWidth = () => {
      chatArea.current.style.width = '600px';
  };

  const closeChat = () => {
      chatArea.current.style.width = '0';
  };

  return (
    <>
      <div className='header_container'>
        <div className='header'>
          <div className='link_container'>
            <Link to="#">로그인/회원가입</Link>
            <Link to="#">내상점</Link>
          </div>
          <div className='search_container'>
            <input type='text' name='search' placeholder='검색어를 입력하세요' />
          </div>
          <nav className='nav_container'>
            <ul className='main_category_container'>
              <li className='first_category'>
                <div className='menu_container'></div>
                <div className='menu'>
                  <img src='/img/menu.png' className='menu_bar' alt='menu' />
                  <p>카테고리</p>
                </div>
                <div className='category_container'>
                  <ul className='category'>
                    <li className='main_category'>
                      <a href='#'>수입명품</a>
                      <div className='sub_category_container'>
                        <div className='sub_category_block'>
                          <ul className='sub_category'>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                          <ul className='sub_category'>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                          <ul className='sub_category'>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
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
                    <li className='main_category'>
                      <a href='#'>수입명품</a>
                      <div className='sub_category_container'>
                        <div className='sub_category_block'>
                          <ul className='sub_category'>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                          <ul className='sub_category'>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                          <ul className='sub_category'>
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
                    <li className='main_category'>
                      <a href='#'>수입명품</a>
                      <div className='sub_category_container'>
                        <div className='sub_category_block'>
                          <ul className='sub_category'>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                          <ul className='sub_category'>
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
                    <li className='main_category'>
                      <a href='#'>수입명품</a>
                      <div className='sub_category_container'>
                        <div className='sub_category_block'>
                          <ul className='sub_category'>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                          <ul className='sub_category'>
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
                    <li className='main_category'>
                      <a href='#'>수입명품</a>
                      <div className='sub_category_container'>
                        <div className='sub_category_block'>
                          <ul className='sub_category'>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                          <ul className='sub_category'>
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
                    <li className='main_category'>
                      <a href='#'>수입명품</a>
                      <div className='sub_category_container'>
                        <div className='sub_category_block'>
                          <ul className='sub_category'>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                          <ul className='sub_category'>
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
                    <li className='main_category'>
                      <a href='#'>수입명품</a>
                      <div className='sub_category_container'>
                        <div className='sub_category_block'>
                          <ul className='sub_category'>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                          <ul className='sub_category'>
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
                    <li className='main_category'>
                      <a href='#'>수입명품</a>
                      <div className='sub_category_container'>
                        <div className='sub_category_block'>
                          <ul className='sub_category'>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                          <ul className='sub_category'>
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
                    <li className='main_category'>
                      <a href='#'>수입명품</a>
                      <div className='sub_category_container'>
                        <div className='sub_category_block'>
                          <ul className='sub_category'>
                            <li><a href='#'>남성신발</a></li>
                            <li><a href='#'>여성신발</a></li>
                            <li><a href='#'>가방</a></li>
                            <li><a href='#'>지갑</a></li>
                            <li><a href='#'>액세서리</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                            <li><a href='#'>기타</a></li>
                          </ul>
                          <ul className='sub_category'>
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
              <li className='menu'><Link to='#'>무료 나눔</Link></li>
              <li className='menu'><Link to='#'>찜한 상품</Link></li>
              <li className='menu'><Link to='#'>실시간 시세</Link></li>
            </ul>
            <ul className='menu_item_container'>
              <div className='menu_item'>
                <img src='/img/money.png' alt='money' />
                <li><Link to='#'>판매하기</Link></li>
              </div>
              <div className='menu_item'>
                <img src='/img/profile.png' alt='profile' />
                <li><Link to='#'>내상점</Link></li>
              </div>
              <div className='menu_item'  ref={chat}>
                <img src='/img/chat.png' alt='chat' />
                <li><button onClick={chatWidth}>채팅하기</button></li>
              </div>
            </ul>
          </nav>
        </div>
      </div>
      <div className='chat' ref={chatArea}>
        <span onClick={closeChat}><img src='/img/x.png' alt='close'></img></span>
        <a href='#'>하이</a>
        <a href='#'>하이</a>
        <a href='#'>하이</a>
      </div>
      <hr />
    </>
  );
}
