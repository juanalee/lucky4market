import React, { useState, useEffect } from 'react';
import MemberService from '../../../services/MemberService';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminPopup from '../AdminPopup/AdminPopup';
import styles from './AdminMembers.module.css';

const AdminMembers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('memberId');
  const [searchResults, setSearchResults] = useState([]);
  const [members, setMembers] = useState([]);
  const [editMemberId, setEditMemberId] = useState(null);
  const [editedMemberData, setEditedMemberData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await MemberService.getAllMembers();
      setMembers(response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error('회원 정보 가져오기 오류:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  const handleSearch = async () => {
    console.log('검색 버튼 클릭');
    try {
      const response = await MemberService.searchMembers({
        [searchField]: searchTerm,
      });
      console.log('검색 결과:', response);
      setSearchResults(response.data);
    } catch (error) {
      console.error('회원 검색 오류:', error);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchResults(members);
    console.log('조건 및 검색 결과 초기화');
  };

  const handleEdit = (member) => {
    setEditMemberId(member.memberId);
    setEditedMemberData(member);
  };

  const handleInputChange = (event, field) => {
    setEditedMemberData({
      ...editedMemberData,
      [field]: event.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await MemberService.updateMember(editedMemberData);
      alert(response.data.msg);
      setEditMemberId(null);
      fetchMembers();
    } catch (error) {
      console.error('회원 정보 수정 오류:', error);
    }
  };

  const handleCancel = () => {
    setEditMemberId(null);
    setEditedMemberData({});
  };

  const handleDelete = (memberId) => {
    setMemberToDelete(memberId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await MemberService.deleteMember(memberToDelete);
      alert(response.data.msg);
      fetchMembers();
    } catch (error) {
      console.error('회원 삭제 오류:', error);
    }
    setShowModal(false);
    setMemberToDelete(null);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.membersContentContainer}>
      <AdminHeader />
      <div className={styles.membersContent}>
        <h2 className={styles.membersTitle}>회원 정보관리</h2>
        <hr></hr>
        <div className={styles.searchFilterSection}>
          <div className={styles.searchCondition}>
            <label className={styles.labelMargin}>검색조건</label>
            <div className={styles.searchBox}>
              <select className={styles.selectInput} value={searchField} onChange={handleSearchFieldChange}>
                <option value="memberId">아이디</option>
                <option value="memberName">이름</option>
                <option value="memberNick">닉네임</option>
                <option value="memberEmail">이메일주소</option>
                <option value="memberPhoneNo">전화번호</option>
              </select>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="검색어 입력"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
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
              {searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  result && (
                    <tr key={index}>
                      <td className={styles.memberId}>{result.memberId}</td>
                      <td className={styles.memberName}>
                        {editMemberId === result.memberId ? (
                          <input
                            type="text"
                            value={editedMemberData.memberName}
                            onChange={(e) => handleInputChange(e, 'memberName')}
                            className={styles.inputField}
                          />
                        ) : (
                          result.memberName
                        )}
                      </td>
                      <td className={styles.memberNick}>
                        {editMemberId === result.memberId ? (
                          <input
                            type="text"
                            value={editedMemberData.memberNick}
                            onChange={(e) => handleInputChange(e, 'memberNick')}
                            className={styles.inputField}
                          />
                        ) : (
                          result.memberNick
                        )}
                      </td>
                      <td className={styles.memberEmail}>
                        {editMemberId === result.memberId ? (
                          <input
                            type="text"
                            value={editedMemberData.memberEmail}
                            onChange={(e) => handleInputChange(e, 'memberEmail')}
                            className={styles.inputField}
                          />
                        ) : (
                          result.memberEmail
                        )}
                      </td>
                      <td className={styles.memberGrade}>
                        {editMemberId === result.memberId ? (
                          <input
                            type="text"
                            value={editedMemberData.memberGradeName}
                            onChange={(e) => handleInputChange(e, 'memberGradeName')}
                            className={styles.inputField}
                          />
                        ) : (
                          result.memberGradeName
                        )}
                      </td>
                      <td className={styles.memberPhoneNo}>
                        {editMemberId === result.memberId ? (
                          <input
                            type="text"
                            value={editedMemberData.memberPhoneNo}
                            onChange={(e) => handleInputChange(e, 'memberPhoneNo')}
                            className={styles.inputField}
                          />
                        ) : (
                          result.memberPhoneNo
                        )}
                      </td>
                      <td className={styles.memberRegDate}>{result.memberRegDate}</td>
                      <td className={styles.manage}>
                        {editMemberId === result.memberId ? (
                          <>
                            <button className={styles.saveButton} onClick={handleSave}>저장</button>
                            <button className={styles.cancelButton} onClick={handleCancel}>취소</button>
                          </>
                        ) : (
                          <>
                            <button className={styles.editButton} onClick={() => handleEdit(result)}>수정</button>
                            <button className={styles.deleteButton} onClick={() => handleDelete(result.memberId)}>삭제</button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                ))
              ) : (
                <tr>
                  <td colSpan="8" className={styles.noResults}>일치하는 회원이 없습니다</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AdminPopup
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        message="해당 회원 정보를 삭제하시겠습니까?"
      />
    </div>
  );
};

export default AdminMembers;
