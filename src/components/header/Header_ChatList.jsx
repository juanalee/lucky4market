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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatSideClass = isChatOpen ? styles.open : '';
  const navigate = useNavigate();

  // 로그인 상태가 변경되면 profile.sub 상태 업데이트
  useEffect(() => {
    if (isAuthenticated && profile?.sub) {
      setProfileSub(profile.sub);
    } else {
      setProfileSub(null);
    }
  }, [isAuthenticated, profile?.sub]);

  const navigateLogin = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const fetchChatRooms = useCallback(async () => {
    if (!profileSub) {
      return;
    }
    try {
      const response = await axios.get(`http://localhost:9999/selectChatRoom?memberId=${profileSub}`);
      setChatRooms(response.data);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      setError("채팅방을 불러오는 중 오류가 발생했습니다.");
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
      const response = await axios.post('http://localhost:9999/buyerProfile', { memberId: otherIds });
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
    setIsLoading(true);
    
    try {
      const productResponse = await axios.get(`http://localhost:9999/api/product/productInfo?productNo=${productNo}`);
      setProductInfo(productResponse.data);

      const imageResponse = await axios.get(`http://localhost:9999/api/product/productImage?productNo=${productNo}`);
      setProductImg(imageResponse.data[0]);
    } catch (error) {
      setError("상품 정보를 불러오는 중 오류가 발생했습니다.");
      console.error("Error fetching product info or image:", error);
    } finally {
      setIsLoading(false);
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
        {chatRooms.length === 0 ? (
          <p className={styles.noChatMessage}>채팅방이 없습니다.</p>
        ) : (
          chatRooms.map((room, index) => {
            const profileId = room.senderId === profileSub ? room.receiverId : room.senderId;
            const profileSame = profiles.find(profile => profile.MEMBERID === profileId) || {};
            const profileImage = profileSame.PROFILEPATH || '/img/basic.png';
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
                    {room.chatContent && room.chatContent.startsWith('/file/ajax/down/') && /\.(jpg|jpeg|png|gif)$/.test(room.chatContent) ?
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
