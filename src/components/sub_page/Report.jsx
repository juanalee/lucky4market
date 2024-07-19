import React from 'react';
import '../../css/headerCss/header.css';
import Backdrop from './Sub_overlay';

const Report = ({ isOpen, onClose }) => {
  return (
    <>
      <Backdrop 
        show={isOpen} 
        onClick={onClose} 
        excludeClasses={['report']}
      />
      <div className={`report_container ${isOpen ? 'open' : ''}`}>
        <div className="report">
          <h2>신고하기</h2>
          <span className="close" onClick={onClose}>
            <img src="/img/x.png" alt="close" />
          </span>
          <hr />
          <p>광고성 상점이에요.</p>
          <hr />
          <p>상품 정보가 부정확해요.</p>
          <hr />
          <p>거래 금지 품목으로 판단돼요.</p>
          <hr />
          <p>사기가 의심돼요.</p>
          <hr />
          <p>기타</p>
          <button className="reportSubmit">등록</button>
        </div>
      </div>
    </>
  );
};

export default Report;
