import React from 'react';
import '../css/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">logo</div>
      <input type="text" className="search-input" placeholder="상품명 입력" />
      <nav className="user-menu">
        <a href="#">마이 페이지</a>
        <a href="#">로그아웃</a>
      </nav>
    </header>
  );
};

export default Header;