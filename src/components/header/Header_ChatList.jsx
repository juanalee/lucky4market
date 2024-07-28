import React, { useEffect, useState } from 'react';
import styles from '../../css/headerCss/header_chatList.module.css';
import Backdrop from '../sub_page/Sub_overlay';
import axios from 'axios';
import Sub_chat from '../sub_page/Sub_chat';

const Chat = ({ isChatOpen, onClose }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [otherIds, setOtherIds] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [productImg, setProductImg] = useState(null); // 초기값을 null로 설정
  const [productInfo, setProductInfo] = useState(null); // 초기값을 null로 설정
  const [activeMemberId, setActiveMemberId] = useState('');
  const [activeChatNo, setActiveChatNo] = useState('');
  const [activeProductNo, setActiveProductNo] = useState(''); // 추가된 상태
  const chatSideClass = isChatOpen ? styles.open : '';

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const responseChatRoom = await axios.get('http://localhost:9999/selectChatRoom?memberId=member3');
        setChatRooms(responseChatRoom.data); // 채팅방 정보로 상태 업데이트
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };
    fetchChatRooms();
  }, []); // 빈 배열로 초기 렌더링 시 한 번만 실행

  useEffect(() => {
    if (chatRooms.length > 0) {
      const otherIds = chatRooms.flatMap(room =>
        [room.receiverId, room.senderId]
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

  const [isMainChatOpen, setIsMainChatOpen] = useState(false);

  const mainChatOpen = async (chatNo, productNo, profileId) => {
    setActiveChatNo(chatNo);
    setActiveMemberId(profileId)
    setActiveProductNo(productNo);
    setIsMainChatOpen(true);

    try {
      const productResponse = await axios.get(`http://localhost:9999/productInfo?productNo=${productNo}`);
      setProductInfo(productResponse.data);
      const imageResponse = await axios.get(`http://localhost:9999/productImage?productNo=${productNo}`);
      setProductImg(imageResponse.data[0]);
    } catch (error) {
      console.error(error);
    }
  };


  const mainChatClose = () => {
    setIsMainChatOpen(false);
  };
  return (
    <>
      <Backdrop
        show={isChatOpen}
        onClick={onClose}
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
          const profileId = room.senderId === 'member3' ? room.receiverId : room.senderId;
          // 프로필 이미지를 찾기
          const profile = profiles.find(profile => profile.MEMBERID === profileId);
          const profileImage = profile ? profile.PROFILEPATH : '/img/basic.png';
          const chatDate = room.chatDate ? new Date(room.chatDate).toLocaleDateString('ko-KR') : '날짜 없음';
          
          return (
            <>
              <div 
                className={styles.chat_list} 
                onClick={() => mainChatOpen(room.chatNo, room.productNo, profileId)} // 채팅방 클릭 시 상품 번호도 전달
              >
                <img src={profileImage} alt='profile' />
                <div>
                  <div className={styles.chat_list_sub}>
                    <h2>{profileId}</h2>
                    <span>{chatDate}</span>
                  </div>
                  <p>{room.chatContent.startsWith('/file/ajax/down/') && room.chatContent.match(/\.(jpg|jpeg|png|gif)$/) ? '이미지' : room.chatContent}</p> 
                </div>
              </div>
              <Sub_chat 
                isChatOpen={isMainChatOpen} 
                onClose={mainChatClose} 
                memberId={activeMemberId} 
                productImage={productImg} 
                productInfo={productInfo}
                roomId = {activeChatNo}
              />
            </>
          );
        })}
      </div>
    </>
  );
};

export default Chat;
