import React, { useState } from 'react';
import styles from '../../css/sub_pageCss/sub_productInfo.module.css';
import Backdrop from './Sub_overlay';

const Report = ({ isReportOpen, onClose }) => {
  const [expanded, setExpanded] = useState(null); // 단일 섹션만 열리도록 상태 변경

  // 텍스트 영역 표시 상태를 토글하는 함수
  const toggleExpansion = (type) => {
    setExpanded(prevState => prevState === type ? null : type); // 현재 열려 있는 섹션이 클릭되면 닫기, 그렇지 않으면 새 섹션 열기
  };

  return (
    <>
      <Backdrop
        show={isReportOpen}
        onClick={onClose}
        excludeClasses={['report_container']}
      />
      {isReportOpen && (
        <div className={styles.report_container}>
          <div className={styles.report}>
            <h2>신고하기</h2>
            <span className={styles.close} onClick={onClose}>
              <img src="/img/x.png" alt="close" />
            </span>
            <hr />
            <div className={`${styles.detailReport} ${expanded === 'ad' ? styles.expandable : ''}`}>
              <p>광고성 상점이에요.</p>
              <img
                src={expanded === 'ad' ? '/img/report_click_arrow.png' : '/img/report_arrow.png'}
                alt="arrow"
                className={styles.report_height}
                onClick={() => toggleExpansion('ad')}
              />
              {expanded === 'ad' && (
                <>
                  <textarea></textarea>
                  <button className={styles.reportSubmit}>등록</button>
                </>
              )}
            </div>
            <hr />
            <div className={`${styles.detailReport} ${expanded === 'inaccurate' ? styles.expandable : ''}`}>
              <p>상품 정보가 부정확해요.</p>
              <img
                src={expanded === 'inaccurate' ? '/img/report_click_arrow.png' : '/img/report_arrow.png'}
                alt="arrow"
                className={styles.report_height}
                onClick={() => toggleExpansion('inaccurate')}
              />
              {expanded === 'inaccurate' && (
                <>
                  <textarea></textarea>
                  <button className={styles.reportSubmit}>등록</button>
                </>
              )}
            </div>
            <hr />
            <div className={`${styles.detailReport} ${expanded === 'prohibited' ? styles.expandable : ''}`}>
              <p>거래 금지 품목으로 판단돼요.</p>
              <img
                src={expanded === 'prohibited' ? '/img/report_click_arrow.png' : '/img/report_arrow.png'}
                alt="arrow"
                className={styles.report_height}
                onClick={() => toggleExpansion('prohibited')}
              />
              {expanded === 'prohibited' && (
                <>
                  <textarea></textarea>
                  <button className={styles.reportSubmit}>등록</button>
                </>
              )}
            </div>
            <hr />
            <div className={`${styles.detailReport} ${expanded === 'scam' ? styles.expandable : ''}`}>
              <p>사기가 의심돼요.</p>
              <img
                src={expanded === 'scam' ? '/img/report_click_arrow.png' : '/img/report_arrow.png'}
                alt="arrow"
                className={styles.report_height}
                onClick={() => toggleExpansion('scam')}
              />
              {expanded === 'scam' && (
                <>
                  <textarea></textarea>
                  <button className={styles.reportSubmit}>등록</button>
                </>
              )}
            </div>
            <hr />
            <div className={`${styles.detailReport} ${expanded === 'other' ? styles.expandable : ''}`}>
              <p>기타</p>
              <img
                src={expanded === 'other' ? '/img/report_click_arrow.png' : '/img/report_arrow.png'}
                alt="arrow"
                className={styles.report_height}
                onClick={() => toggleExpansion('other')}
              />
              {expanded === 'other' && (
                <>
                  <textarea></textarea>
                  <button className={styles.reportSubmit}>등록</button>
                </>
              )}
            </div>
            <hr />
          </div>
        </div>
      )}
    </>
  );
};

export default Report;
