import React from 'react';
import styles from './AdminMembers.module.css';

const MembersSearchFilter = ({
  searchField,
  searchTerm,
  handleSearchFieldChange,
  handleSearchChange,
  handleSearch,
  handleReset,
  handleKeyDown
}) => {
  return (
    <div className={styles.adminMembersSearchFilterSection}>
      <div className={styles.adminMembersSearchCondition}>
        <label className={styles.adminMembersLabelMargin}>검색조건</label>
        <div className={styles.adminMembersSearchBox}>
          <select
            className={styles.adminMembersSelectInput}
            value={searchField}
            onChange={handleSearchFieldChange}
            onKeyDown={handleKeyDown}
          >
            <option value="memberId">아이디</option>
            <option value="memberName">이름</option>
            <option value="memberNick">닉네임</option>
            <option value="memberEmail">이메일주소</option>
            <option value="memberPhoneNo">전화번호</option>
          </select>
          <input
            className={styles.adminMembersSearchInput}
            type="text"
            placeholder="검색어 입력"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className={styles.adminMembersButtonGroup}>
        <button className={styles.adminMembersSearchButton} onClick={handleSearch}>검색</button>
        <button className={styles.adminMembersResetButton} onClick={handleReset}>초기화</button>
      </div>
    </div>
  );
};

export default MembersSearchFilter;
