import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from '../sadminHeader/AdminHeader';
import AdminPopup from '../adminPopup/AdminPopup';
import styles from './AdminMembers.module.css';

const AdminMembers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('memberId');
  const [searchResults, setSearchResults] = useState([]);
  const [members, setMembers] = useState([]);
  const [editMemberId, setEditMemberId] = useState(null);
  const [editedMemberData, setEditedMemberData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [memberToDelete, setMemberToDelete] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.replace('T', '<br />');
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:9999/admin/allMembers');
      setMembers(response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error('회원 목록 가져오기 오류:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  const handleSearch = async () => {
    console.log('Searching for members');
    try {
      const response = await axios.get(`http://localhost:9999/admin/searchMembers?${searchField}=${searchTerm}`);
      console.log('Search results:', response);
      setSearchResults(response.data);
    } catch (error) {
      console.error('회원 검색 오류:', error);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchResults(members);
    console.log('검색 및 필터 초기화');
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
      console.log('저장하려는 회원 정보:', editedMemberData);
      const response = await axios.put('http://localhost:9999/admin/updateMember', editedMemberData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.count === 0) {
        throw new Error(response.data.msg);
      }
      setPopupMessage(response.data.msg);
      setIsConfirmation(false);
      setEditMemberId(null);
      fetchMembers();
    } catch (error) {
      console.error('회원 정보 수정 오류:', error);
      setPopupMessage('회원 정보 수정 실패');
      setIsConfirmation(false);
    }
    setShowModal(true);
  };

  const handleCancel = () => {
    setEditMemberId(null);
    setEditedMemberData({});
  };

  const handleDelete = (memberId) => {
    setMemberToDelete(memberId);
    setPopupMessage('해당 회원 정보를 삭제하시겠습니까?');
    setIsConfirmation(true);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:9999/admin/deleteMember/${memberToDelete}`);
      setPopupMessage(response.data.msg);
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      setPopupMessage('회원 삭제 오류');
    }
    setIsConfirmation(false);
    setShowModal(true);
    setMemberToDelete(null);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const closePopup = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.adminMembersContainer}>
      <AdminHeader />
      <div className={styles.adminMembersContent}>
        <h2 className={styles.adminMembersTitle}>회원 정보관리</h2>
        <hr></hr>
        <div className={styles.adminMembersSearchFilterSection}>
          <div className={styles.adminMembersSearchCondition}>
            <label className={styles.adminMembersLabelMargin}>검색조건</label>
            <div className={styles.adminMembersSearchBox}>
              <select className={styles.adminMembersSelectInput} value={searchField} onChange={handleSearchFieldChange}>
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
        <div className={styles.adminMembersResultInfo}>
          <span>총 회원 수 : {searchResults.length}명</span>
        </div>
        <div className={styles.adminMembersTable}>
          <table>
            <thead>
              <tr>
                <th className={styles.adminMembersId}>아이디</th>
                <th className={styles.adminMembersName}>회원이름</th>
                <th className={styles.adminMembersNick}>닉네임</th>
                <th className={styles.adminMembersEmail}>이메일</th>
                <th className={styles.adminMembersAddr}>주소</th>
                <th className={styles.adminMembersGrade}>회원등급</th>
                <th className={styles.adminMembersPhoneNo}>전화번호</th>
                <th className={styles.adminMembersRegDate}>가입일자</th>
                <th className={styles.adminMembersManage}>관리</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  result && (
                    <tr key={index}>
                      <td className={styles.adminMembersId}>{result.memberId}</td>
                      <td className={styles.adminMembersName}>
                        {editMemberId === result.memberId ? (
                          <input
                            type="text"
                            value={editedMemberData.memberName}
                            onChange={(e) => handleInputChange(e, 'memberName')}
                            className={styles.adminMembersFixedWidthInput}
                          />
                        ) : (
                          result.memberName
                        )}
                      </td>
                      <td className={styles.adminMembersNick}>
                        {editMemberId === result.memberId ? (
                          <input
                            type="text"
                            value={editedMemberData.memberNick}
                            onChange={(e) => handleInputChange(e, 'memberNick')}
                            className={styles.adminMembersFixedWidthInput}
                          />
                        ) : (
                          result.memberNick
                        )}
                      </td>
                      <td className={styles.adminMembersEmail}>
                        {editMemberId === result.memberId ? (
                          <input
                            type="text"
                            value={editedMemberData.memberEmail}
                            onChange={(e) => handleInputChange(e, 'memberEmail')}
                            className={styles.adminMembersFixedWidthInput}
                          />
                        ) : (
                          result.memberEmail
                        )}
                      </td>
                      <td className={styles.adminMembersAddr}>
                        {editMemberId === result.memberId ? (
                          <input
                            type="text"
                            value={editedMemberData.memberAddr}
                            onChange={(e) => handleInputChange(e, 'memberAddr')}
                            className={styles.adminMembersFixedWidthInput}
                          />
                        ) : (
                          result.memberAddr
                        )}
                      </td>
                      <td className={styles.adminMembersGrade}>
                        {editMemberId === result.memberId ? (
                          <select
                            value={editedMemberData.memberGrade}
                            onChange={(e) => handleInputChange(e, 'memberGrade')}
                            className={styles.adminMembersFixedWidthInput}
                          >
                            <option value="1">일반회원</option>
                            <option value="2">차단된회원</option>
                          </select>
                        ) : (
                          result.memberGradeName
                        )}
                      </td>
                      <td className={styles.adminMembersPhoneNo}>
                        {editMemberId === result.memberId ? (
                          <input
                            type="text"
                            value={editedMemberData.memberPhoneNo}
                            onChange={(e) => handleInputChange(e, 'memberPhoneNo')}
                            className={styles.adminMembersFixedWidthInput}
                          />
                        ) : (
                          result.memberPhoneNo
                        )}
                      </td>
                      <td className={styles.adminMembersRegDate} dangerouslySetInnerHTML={{ __html: formatDate(result.memberRegDate) }}></td>
                      <td className={styles.adminMembersManage}>
                        {editMemberId === result.memberId ? (
                          <>
                            <button className={styles.adminMembersSaveButton} onClick={handleSave}>저장</button>
                            <button className={styles.adminMembersCancelButton} onClick={handleCancel}>취소</button>
                          </>
                        ) : (
                          <>
                            <button className={styles.adminMembersEditButton} onClick={() => handleEdit(result)}>수정</button>
                            <button className={styles.adminMembersDeleteButton} onClick={() => handleDelete(result.memberId)}>삭제</button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                ))
              ) : (
                <tr>
                  <td colSpan="9" className={styles.adminMembersNoResults}>일치하는 회원이 없습니다</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AdminPopup
        show={showModal}
        onClose={closePopup}
        onConfirm={isConfirmation ? confirmDelete : closePopup}
        message={popupMessage}
        isConfirmation={isConfirmation}
      />
    </div>
  );
};

export default AdminMembers;
