import React, { useEffect, useState } from 'react';
import styles from '../../css/headerCss/header_chatList.module.css';
import Backdrop from '../sub_page/Sub_overlay';
import axios from 'axios';

const Chat = ({ isChatOpen, onClose }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [otherIds, setOtherIds] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const chatSideClass = isChatOpen ? styles.open : '';

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get('http://localhost:9999/selectChatInfo?memberId=member3');
        setChatRooms(response.data); // 채팅방 정보로 상태 업데이트
      } catch (error) {
        console.error(error);
      }
    };
    fetchChatRooms();
  }, []); // 빈 배열로 초기 렌더링 시 한 번만 실행

  useEffect(() => {
    if (chatRooms.length > 0) {
      const otherIds = chatRooms.flatMap(room =>
        [room.buyerId, room.sellerId]
          .filter(id => id !== 'member3') // 'member3'이 아닌 아이디만 필터링
      );
      setOtherIds(otherIds);
    }
  }, [chatRooms]); // `chatRooms`가 변경될 때마다 실행

  useEffect(() => {
    const fetchChatProfile = async () => {
      try {
        const response = await axios.post('http://localhost:9999/buyerProfile', { memberId: otherIds });
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching chat profile:", error);
      }
    };

    if (otherIds.length > 0) { 
      fetchChatProfile();
    }
  }, [otherIds]); 

  return (
    <>
      <Backdrop
        show={isChatOpen}
        onClick={onClose}
        excludeClasses={['side']} // 사이드 바를 제외하고 클릭을 감지
      />
      <div className={`${styles.chat_side} ${chatSideClass}`}>
        <div className={styles.chat_side_header}>
          <span onClick={onClose}>
            <img src='/img/x.png' alt='close' className={styles.x} />
          </span>
          <h2>채팅방</h2> 
        </div>
        {chatRooms.map((room, index) => {
          // 채팅방에 연결된 상대방의 ID를 찾기
          const profileId = room.buyerId === 'member3' ? room.sellerId : room.buyerId;
          // 프로필 이미지를 찾기
          const profile = profiles.find(profile => profile.MEMBERID === profileId);
          const profileImage = profile ? profile.PROFILEPATH : '/img/basic.png';
          
          return (
            <div key={index} className={styles.chat_list}>
              <img src={profileImage} alt='profile' />
              <div>
                <div className={styles.chat_list_sub}>
                  <h2>{profileId}</h2>
                  <span>{new Date(room.chatDate).toLocaleDateString('ko-KR')}</span>
                </div>
                <p>{room.chatContent}</p> 
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Chat;
