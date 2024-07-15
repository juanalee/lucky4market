import React, { useState } from 'react';
import AdminHeader from '../AdminHeader/AdminHeader';
import styles from './AdminMembers.module.css';

const AdminMembers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([
    { id: '아이디1', name: '회원이름1', nickname: '닉네임1', email: '이메일1', level: '회원등급1', phone: '전화번호1', date: '가입일자1' },
    { id: '아이디2', name: '회원이름2', nickname: '닉네임2', email: '이메일2', level: '회원등급2', phone: '전화번호2', date: '가입일자2' }
  ]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // Implement search logic here
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchResults([]);
    console.log('Filters and search reset');
  };

  return (
    <div>
      <AdminHeader />
      <div className={styles.membersContent}>
        <h2 className={styles.membersTitle}>회원 정보관리</h2>
        <hr></hr>
        <div className={styles.searchFilterSection}>
          <div className={styles.searchCondition}>
            <label className={styles.labelMargin}>검색조건</label>
            <div className={styles.searchBox}>
              <select className={styles.selectInput}>
                <option value="userId">아이디</option>
                <option value="name">이름</option>
                <option value="nickname">닉네임</option>
                <option value="email">이메일주소</option>
                <option value="phone">전화번호</option>
              </select>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="검색어 입력"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.searchButton} onClick={handleSearch}>검색</button>
            <button className={styles.resetButton} onClick={handleReset}>초기화</button>
          </div>
        </div>
        <div className={styles.resultInfo}>
          <span>총 회원 수 : {searchResults.length}명</span>
        </div>
        <div className={styles.membersTable}>
          <table>
            <thead>
              <tr>
                <th>아이디</th>
                <th>회원이름</th>
                <th>닉네임</th>
                <th>이메일</th>
                <th>회원등급</th>
                <th>전화번호</th>
                <th>가입일자</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.id}</td>
                  <td>{result.name}</td>
                  <td>{result.nickname}</td>
                  <td>{result.email}</td>
                  <td>{result.level}</td>
                  <td>{result.phone}</td>
                  <td>{result.date}</td>
                  <td>
                    <button className={styles.editButton}>수정</button>
                    <button className={styles.deleteButton}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMembers;
