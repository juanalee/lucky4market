import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminHeader.module.css';

const AdminHeader = () => {
  return (
    <div className="admin-header">
      <div className="admin-top">
        <div className="left-section">
          <span className="header-logo">logo</span>
          <span>관리자</span>
        </div>
        <div className="right-section">
          <NavLink to="/admin/info">관리자정보</NavLink>
          <NavLink to="/">로그아웃</NavLink>
        </div>
      </div>
      <div className="admin-bottom">
        <NavLink to="/admin/members">회원관리</NavLink>
        <NavLink to="/admin/reports">신고관리</NavLink>
        <NavLink to="/admin/products">상품관리</NavLink>
        <NavLink to="/admin/categories">카테고리 관리</NavLink>
        <NavLink to="/admin/support">고객센터</NavLink>
      </div>
    </div>
  );
};

export default AdminHeader;