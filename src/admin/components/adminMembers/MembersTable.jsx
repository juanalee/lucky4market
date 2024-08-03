import React, { useState, useEffect } from 'react';
import styles from './AdminMembers.module.css';
import axios from 'axios';

const MembersTable = ({ members, onDelete, fetchMembers }) => {
  const [visibleMembers, setVisibleMembers] = useState([]);
  const [editMemberId, setEditMemberId] = useState(null);
  const [editedMemberData, setEditedMemberData] = useState({});

  useEffect(() => {
    setVisibleMembers(members.slice(0, 5));
  }, [members]);

  const loadMoreMembers = () => {
    const nextIndex = visibleMembers.length;
    const nextBatch = members.slice(nextIndex, nextIndex + 5);

    if (nextBatch.length > 0) {
      setVisibleMembers((prevVisible) => [...prevVisible, ...nextBatch]);
    }
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
      console.log('Saving member:', editedMemberData);
      const response = await axios.put(`http://localhost:9999/admin/updateMember`, editedMemberData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.count === 0) {
        throw new Error(response.data.msg);
      }

      // 수정하려는 특정 회원 정보만 수정
      setVisibleMembers((prevVisibleMembers) =>
        prevVisibleMembers.map((member) =>
          member.memberId === editMemberId ? editedMemberData : member
        )
      );

      setEditMemberId(null);
    } catch (error) {
      console.error('회원 정보 수정 오류:', error);
    }
  };

  const handleCancel = () => {
    setEditMemberId(null);
    setEditedMemberData({});
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.replace('T', '<br />');
  };

  return (
    <div id="tableContainer" className={styles.adminMembersTableContainer}>
      <table className={styles.adminMembersTable}>
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
          {visibleMembers.length > 0 ? (
            visibleMembers.map((result, index) => (
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
                      value={editedMemberData.memberNick || ''}
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
                      value={editedMemberData.memberAddr || ''}
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
                <td
                  className={styles.adminMembersRegDate}
                  dangerouslySetInnerHTML={{ __html: formatDate(result.memberRegDate) }}
                ></td>
                <td className={styles.adminMembersManage}>
                  {editMemberId === result.memberId ? (
                    <>
                      <button
                        className={styles.adminMembersSaveButton}
                        onClick={handleSave}
                      >
                        저장
                      </button>
                      <button
                        className={styles.adminMembersCancelButton}
                        onClick={handleCancel}
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={styles.adminMembersEditButton}
                        onClick={() => handleEdit(result)}
                      >
                        수정
                      </button>
                      <button
                        className={styles.adminMembersDeleteButton}
                        onClick={() => onDelete(result.memberId)}
                      >
                        삭제
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className={styles.adminMembersNoResults}>일치하는 회원이 없습니다</td>
            </tr>
          )}
          {visibleMembers.length < members.length && (
            <tr className={styles.adminMembersLoadMoreRow} onClick={loadMoreMembers}>
              <td colSpan="9" className={styles.adminMembersLoadMore}>
                <span className={styles.loadMoreText}>▼ 더보기</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;
