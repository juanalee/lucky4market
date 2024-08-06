import React, { useState, useEffect } from 'react';
import AdminHeader from '../adminHeader/AdminHeader';
import MembersSearchFilter from './MembersSearchFilter';
import MembersTable from './MembersTable';
import AdminPopup from '../adminPopup/AdminPopup';
import styles from './AdminMembers.module.css';
import axios from 'axios';

const AdminMembers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('memberId');
  const [showModal, setShowModal] = useState(false);
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:9999/admin/allMembers');
      setMembers(response.data);
      setFilteredMembers(response.data);
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
    try {
      const response = await axios.get(`http://localhost:9999/admin/searchMembers?${searchField}=${searchTerm}`);
      setFilteredMembers(response.data);
    } catch (error) {
      console.error('회원 검색 오류:', error);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchField('memberId');
    setFilteredMembers(members);
    setFilteredMembers(members);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDelete = (memberId) => {
    setMemberToDelete(memberId);
    setPopupMessage('해당 회원 정보를 삭제하시겠습니까?');
    setIsConfirmation(true);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('삭제하려는 회원 아이디:', memberToDelete);
      setPopupMessage('회원 삭제 성공');
      fetchMembers();
    } catch (error) {
      console.error('회원 삭제 오류:', error);
      setPopupMessage('회원 삭제 오류');
    } finally {
      setIsConfirmation(false);
      setShowModal(true);
      setMemberToDelete(null);
    }
  };

  const closePopup = () => {
    setShowModal(false);
  };

  return (
    <>
      <AdminHeader />
      <div className={styles.adminMembersContainer}>
        <div className={styles.adminMembersContent}>
          <h2 className={styles.adminMembersTitle}>회원 정보관리</h2>
          <hr />
          <MembersSearchFilter
            searchField={searchField}
            searchTerm={searchTerm}
            handleSearchFieldChange={handleSearchFieldChange}
            handleSearchChange={handleSearchChange}
            handleSearch={handleSearch}
            handleReset={handleReset}
            handleKeyDown={handleKeyDown}
          />
          <div className={styles.adminMembersResultInfo}>
            <span>총 회원 수: {filteredMembers.length}명</span>
          </div>
          <MembersTable
            members={filteredMembers}
            onDelete={handleDelete}
            fetchMembers={fetchMembers}
          />
        </div>
        <AdminPopup
          show={showModal}
          onClose={closePopup}
          onConfirm={isConfirmation ? confirmDelete : closePopup}
          message={popupMessage}
          isConfirmation={isConfirmation}
        />
      </div>
    </>
  );
};

export default AdminMembers;
