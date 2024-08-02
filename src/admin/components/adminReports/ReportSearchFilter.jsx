import React, { useRef } from 'react';
import styles from './AdminReports.module.css';

const ReportSearchFilter = ({
  searchTerm,
  searchDateTerm,
  selectedSearchOption,
  selectedProcessStatusOption,
  setSearchTerm,
  setSearchDateTerm,
  handleSearchOptionChange,
  handleProcessStatusOptionChange,
  handleSearch,
  handleReset,
  handleKeyDown,
  notification
}) => {

  const processStatusRef = useRef(null);

  const handleProcessStatusChange = (event) => {
    handleProcessStatusOptionChange(event);
    if (processStatusRef.current) {
      processStatusRef.current.blur();
    }
  };

  return (
    <div className={styles.adminReportsSearchFilterSection}>
      <div className={styles.adminReportsSearchCondition}>
        <label className={styles.adminReportsLabelMargin}>검색조건</label>
        <div className={styles.adminReportsSearchBox}>
          <select
            className={styles.adminReportsSelectInput1}
            value={selectedSearchOption}
            onChange={handleSearchOptionChange}
            onKeyDown={handleKeyDown}
          >
            <option value="productNo">상품번호</option>
            <option value="sellerId">판매자 아이디</option>
            <option value="claimerId">신고자 아이디</option>
          </select>
          <input
            className={styles.adminReportsSearchInput}
            type="text"
            placeholder="검색어 입력"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown} // Add onKeyDown handler
          />
          <span className={styles.adminReportsSearchlabel}>신고일자: </span>
          <div>
            <input
              className={styles.adminReportsSearchDateInput1}
              type="date"
              placeholder="시작일"
              value={searchDateTerm.startDate}
              onChange={(e) => setSearchDateTerm({ ...searchDateTerm, startDate: e.target.value })}
              onKeyDown={handleKeyDown} // Add onKeyDown handler
            />
            <span className={styles.adminReportsSearchlabel}>~</span>
            <input
              className={styles.adminReportsSearchDateInput2}
              type="date"
              placeholder="종료일"
              value={searchDateTerm.endDate}
              onChange={(e) => setSearchDateTerm({ ...searchDateTerm, endDate: e.target.value })}
              onKeyDown={handleKeyDown} // Add onKeyDown handler
            />
            <span className={styles.adminReportsSearchlabel}>처리 상태: </span>
            <select
              ref={processStatusRef}
              className={styles.adminReportsSelectInput2}
              value={selectedProcessStatusOption}
              onChange={handleProcessStatusChange}
              onKeyDown={handleKeyDown} // Add onKeyDown handler
            >
              <option value="">-----</option>
              <option value="N">신규</option>
              <option value="P">처리중</option>
              <option value="C">완료</option>
            </select>
          </div>
        </div>
        {notification && <div className={styles.adminReportsNotification}>{notification}</div>}
      </div>
      <div className={styles.adminReportsButtonGroup}>
        <button className={styles.adminReportsSearchButton} onClick={handleSearch}>검색</button>
        <button className={styles.adminReportsResetButton} onClick={handleReset}>초기화</button>
      </div>
    </div>
  );
};

export default ReportSearchFilter;
