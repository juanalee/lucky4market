import React, { useContext, useEffect, useState, useCallback } from 'react';
import styles from './css/header_chatList.module.css';
import Backdrop from '../subPage/SubOverlay';
import axios from 'axios';
import Sub_chat from '../subPage/SubChat';
import { AuthContext } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';

const Chat = ({ isChatOpen, onClose }) => {
  const { isAuthenticated, profile } = useContext(AuthContext);
  const [profileSub, setProfileSub] = useState(null); // 프로필 sub 상태 추가
  const [chatRooms, setChatRooms] = useState([]);
  const [otherIds, setOtherIds] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [productImg, setProductImg] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
  const [activeMemberId, setActiveMemberId] = useState('');
  const [activeChatNo, setActiveChatNo] = useState('');
  const [activeProductNo, setActiveProductNo] = useState('');
  const [isMainChatOpen, setIsMainChatOpen] = useState(false);
  const chatSideClass = isChatOpen ? styles.open : '';

  // 로그인 상태가 변경되면 profile.sub 상태 업데이트
  useEffect(() => {
    if (isAuthenticated && profile?.sub) {
      setProfileSub(profile.sub);
    } else {
      setProfileSub(null);
    }
  }, [isAuthenticated, profile?.sub]);

  const fetchChatRooms = useCallback(async () => {
    if (!profileSub) {
      return;
    }
    try {
      const response = await axios.get(`http://localhost:9999/selectChatRoom?memberId=${profileSub}`);
      setChatRooms(response.data);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  }, [profileSub]);

  useEffect(() => {
    if (profileSub) {
      fetchChatRooms();
    }
  }, [profileSub, fetchChatRooms]);

  useEffect(() => {
    if (!profileSub || chatRooms.length === 0) return;

    const ids = chatRooms.flatMap(room =>
      [room.receiverId, room.senderId]
        .filter(id => id !== profileSub)
    );
    setOtherIds(ids);
  }, [chatRooms, profileSub]);

  const fetchChatProfile = useCallback(async () => {
    if (otherIds.length === 0) return;

    try {
      const response = await axios.post('http://localhost:9999/api/member/buyerProfile', { memberId: otherIds });
      setProfiles(response.data);
    } catch (error) {
      console.error("Error fetching chat profiles:", error);
    }
  }, [otherIds]);

  useEffect(() => {
    if (otherIds.length > 0) {
      fetchChatProfile();
    }
  }, [otherIds, fetchChatProfile]);

  const mainChatOpen = useCallback(async (chatNo, productNo, profileId) => {
    setActiveChatNo(chatNo);
    setActiveMemberId(profileId);
    setActiveProductNo(productNo);
    setIsMainChatOpen(true);
    try {
      const productResponse = await axios.get(`http://localhost:9999/api/product/productInfo?productNo=${productNo}`);
      setProductInfo(productResponse.data);

      const imageResponse = await axios.get(`http://localhost:9999/api/product/productImage?productNo=${productNo}`);
      setProductImg(imageResponse.data[0]);

      console.log(imageResponse);
    } catch (error) {
      console.error("Error fetching product info or image:", error);
    }
  }, []);

  const mainChatClose = useCallback(() => {
    setIsMainChatOpen(false);
  }, []);

  return (
    <>
      <Backdrop show={isChatOpen} onClick={onClose} />
      <div className={`${styles.chat_side} ${chatSideClass}`}>
        <div className={styles.chat_side_header}>
          <span onClick={onClose}>
            <img src='/img/x.png' alt='close' className={styles.x} />
          </span>
          <h2>채팅방</h2>
        </div>
        {chatRooms.length > 0 && (
          chatRooms.filter(room => room.chatContent).map((room, index) => {
            const profileId = room.senderId === profileSub ? room.receiverId : room.senderId;
            const profileSame = profiles.find(profile => profile.MEMBERID === profileId) || {};
            const profileImage = profileSame.PROFILEPATH || '/img/store_basic.png';
            const chatDate = room.chatDate ? new Date(room.chatDate).toLocaleDateString('ko-KR') : '날짜 없음';
            return (
              <div
                key={room.chatNo}
                className={styles.chat_list}
                onClick={() => mainChatOpen(room.chatNo, room.productNo, profileId)}
              >
                <img src={profileImage} alt='profile' />
                <div>
                  <div className={styles.chat_list_sub}>
                    <h2>{profileId}</h2>
                    <span>{chatDate}</span>
                  </div>
                  <p>
                    {room.chatContent && room.chatContent.startsWith('https://lucky4market') ?
                      '이미지' :
                      room.chatContent
                    }
                  </p>
                </div>
              </div>
            );
          })
        )}
        <Sub_chat
          isChatOpen={isMainChatOpen}
          onClose={mainChatClose}
          sellerId={activeMemberId}
          productImage={productImg}
          productInfo={productInfo}
          roomId={activeChatNo}
        />
      </div>
    </>
  );
};

export default Chat;
