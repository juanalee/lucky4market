import React from 'react';
import styles from './AdminReports.module.css';

const ReportSearchFilter = ({
  searchTerm,
  searchDateTerm,
  selectedSearchOption,
  selectedStatusOption,
  setSearchTerm,
  setSearchDateTerm,
  handleSearchOptionChange,
  handleStatusOptionChange,
  handleSearch,
  handleReset,
  handleKeyDown,
  notification
}) => {

  const handleDateKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
    if (handleKeyDown) {
      handleKeyDown(event);
    }
  };

  return (
    <div className={styles.searchFilterSection}>
      <div className={styles.searchCondition}>
        <label className={styles.labelMargin}>검색조건</label>
        <div className={styles.searchBox}>
          <select className={styles.selectInput1} value={selectedSearchOption} onChange={handleSearchOptionChange}>
            <option value="productNo">상품번호</option>
            <option value="sellerId">판매자 아이디</option>
            <option value="claimerId">신고자 아이디</option>
          </select>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="검색어 입력"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className={styles.searchlabel}>신고일자: </span>
          <div>
            <input
              className={styles.searchDateInput1}
              type="date"
              placeholder="시작일"
              value={searchDateTerm.startDate}
              onChange={(e) => setSearchDateTerm({ ...searchDateTerm, startDate: e.target.value })}
              onKeyDown={handleDateKeyDown}
            />
            <span className={styles.searchlabel}>~</span>
            <input
              className={styles.searchDateInput2}
              type="date"
              placeholder="종료일"
              value={searchDateTerm.endDate}
              onChange={(e) => setSearchDateTerm({ ...searchDateTerm, endDate: e.target.value })}
              onKeyDown={handleDateKeyDown}
            />
            <span className={styles.searchlabel}>처리 상태: </span>
            <select className={styles.selectInput2} value={selectedStatusOption} onChange={handleStatusOptionChange}>
              <option value="">-----</option>
              <option value="N">신규</option>
              <option value="P">처리중</option>
              <option value="C">완료</option>
            </select>
          </div>
        </div>
        {notification && <div className={styles.notification}>{notification}</div>}
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.searchButton} onClick={handleSearch}>검색</button>
        <button className={styles.resetButton} onClick={handleReset}>초기화</button>
      </div>
    </div>
  );
};

export default ReportSearchFilter;
