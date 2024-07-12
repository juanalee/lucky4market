import React from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css';


export default () => {

  return (
    <>
      <div className='header_container'>
        <div className='link_container'>
          <Link to="#">로그인/회원가입</Link>
          <Link to="#">내상점</Link>
        </div>
      </div>
      <div className='search_container'>
        <input type='text' name='search' placeholder='검색어를 입력하세요' />
      </div>
      <nav className='nav_container'>
        <ul className='main_category_container'>
          <li className='first_category'>
            <div className='menu_container'>
              <img src='/img/menu.png' className='menu_bar' alt='menu' />
              <p>카테고리</p>
            </div>
            <div className='category_container'>  
              <ul className='category'>
                <li className='main_category'>
                  <a href='#'>수입명품</a>
                  <div className='sub_category_container'>
                    <ul className='sub_category'>
                      <li><a href='#'>남성신발</a></li>
                      <li><a href='#'>여성신발</a></li>
                      <li><a href='#'>가방</a></li>
                      <li><a href='#'>지갑</a></li>
                      <li><a href='#'>액세서리</a></li>
                      <li><a href='#'>기타</a></li>
                      <li><a href='#'>남성신발</a></li>
                      <li><a href='#'>여성신발</a></li>
                      <li><a href='#'>가방</a></li>
                      <li><a href='#'>지갑</a></li>
                      <li><a href='#'>액세서리</a></li>
                      <li><a href='#'>기타</a></li>
                      <li><a href='#'>남성신발</a></li>
                      <li><a href='#'>여성신발</a></li>
                      <li><a href='#'>가방</a></li>
                      <li><a href='#'>지갑</a></li>
                      <li><a href='#'>액세서리</a></li>
                      <li><a href='#'>기타</a></li>
                    </ul>
                  </div>
                </li>
                <li className='main_category'>
                  <a href='#'>패션의류</a>
                  <div className='sub_category_container'>
                    <ul className='sub_category'>
                      <li><a href='#'>남성의류</a></li>
                      <li><a href='#'>여성의류</a></li>
                      <li><a href='#'>스포츠의류</a></li>
                      <li><a href='#'>아동의류</a></li>
                      <li><a href='#'>기타</a></li>
                      <li><a href='#'>남성의류</a></li>
                      <li><a href='#'>여성의류</a></li>
                      <li><a href='#'>스포츠의류</a></li>
                      <li><a href='#'>아동의류</a></li>
                      <li><a href='#'>기타</a></li>
                    </ul>
                  </div>
                </li>
                <li className='main_category'>
                  <a href='#'>가전제품</a>
                  <div className='sub_category_container'>
                    <ul className='sub_category'>
                      <li><a href='#'>TV</a></li>
                      <li><a href='#'>냉장고</a></li>
                      <li><a href='#'>세탁기</a></li>
                      <li><a href='#'>에어컨</a></li>
                      <li><a href='#'>기타</a></li>
                      <li><a href='#'>TV</a></li>
                      <li><a href='#'>냉장고</a></li>
                      <li><a href='#'>세탁기</a></li>
                      <li><a href='#'>에어컨</a></li>
                      <li><a href='#'>기타</a></li>
                    </ul>
                  </div>
                </li>
                <li className='main_category'>
                  <a href='#'>가전제품</a>
                  <div className='sub_category_container'>
                    <ul className='sub_category'>
                      <li><a href='#'>TV</a></li>
                      <li><a href='#'>냉장고</a></li>
                      <li><a href='#'>세탁기</a></li>
                      <li><a href='#'>에어컨</a></li>
                      <li><a href='#'>기타</a></li>
                      <li><a href='#'>TV</a></li>
                      <li><a href='#'>냉장고</a></li>
                      <li><a href='#'>세탁기</a></li>
                      <li><a href='#'>에어컨</a></li>
                      <li><a href='#'>기타</a></li>
                    </ul>
                  </div>
                </li>
                <li className='main_category'>
                  <a href='#'>가전제품</a>
                  <div className='sub_category_container'>
                    <ul className='sub_category'>
                      <li><a href='#'>TV</a></li>
                      <li><a href='#'>냉장고</a></li>
                      <li><a href='#'>세탁기</a></li>
                      <li><a href='#'>에어컨</a></li>
                      <li><a href='#'>기타</a></li>
                      <li><a href='#'>TV</a></li>
                      <li><a href='#'>냉장고</a></li>
                      <li><a href='#'>세탁기</a></li>
                      <li><a href='#'>에어컨</a></li>
                      <li><a href='#'>기타</a></li>
                    </ul>
                  </div>
                </li>
                <li className='main_category'>
                  <a href='#'>가전제품</a>
                  <div className='sub_category_container'>
                    <ul className='sub_category'>
                      <li><a href='#'>TV</a></li>
                      <li><a href='#'>냉장고</a></li>
                      <li><a href='#'>세탁기</a></li>
                      <li><a href='#'>에어컨</a></li>
                      <li><a href='#'>기타</a></li>
                      <li><a href='#'>TV</a></li>
                      <li><a href='#'>냉장고</a></li>
                      <li><a href='#'>세탁기</a></li>
                      <li><a href='#'>에어컨</a></li>
                      <li><a href='#'>기타</a></li>
                    </ul>
                  </div>
                </li>
                <li className='main_category'>
                  <a href='#'>가전제품</a>
                  <div className='sub_category_container'>
                    <ul className='sub_category'>
                      <li><a href='#'>TV</a></li>
                      <li><a href='#'>냉장고</a></li>
                      <li><a href='#'>세탁기</a></li>
                      <li><a href='#'>에어컨</a></li>
                      <li><a href='#'>기타</a></li>
                      <li><a href='#'>TV</a></li>
                      <li><a href='#'>냉장고</a></li>
                      <li><a href='#'>세탁기</a></li>
                      <li><a href='#'>에어컨</a></li>
                      <li><a href='#'>기타</a></li>
                    </ul>
                  </div>
                </li>
                <li className='main_category'>
                  <a href='#'>가전제품</a>
                  <div className='sub_category_container'>
                    <ul className='sub_category'>
                      <li><a href='#'>TV</a></li>
                      <li><a href='#'>냉장고</a></li>
                      <li><a href='#'>세탁기</a></li>
                      <li><a href='#'>에어컨</a></li>
                      <li><a href='#'>기타</a></li>
                      <li><a href='#'>TV</a></li>
                      <li><a href='#'>냉장고</a></li>
                      <li><a href='#'>세탁기</a></li>
                      <li><a href='#'>에어컨</a></li>
                      <li><a href='#'>기타</a></li>
                    </ul>
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
            <img src='/img/money.png'></img>
            <li><Link to='#'>판매하기</Link></li>
          </div>
          <div className='menu_item'>
            <img src='/img/profile.png'></img>
            <li><Link to='#'>내상점</Link></li>
          </div>
          <div className='menu_item'>
            <img src='/img/chat.png'></img>
            <li><Link to='#'>채팅하기</Link></li>
          </div>
        </ul>
      </nav>
      <hr></hr>
    </>
  );
}
