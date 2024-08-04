import React, { useState, useEffect, useRef, useContext } from 'react';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import Backdrop from './SubOverlay';
import styles from './css/SubChat.module.css';
import { AuthContext } from '../../services/AuthContext';

function SubChat({ isChatOpen, onClose, productImage, productInfo, sellerId, roomId }) {
  const [messages, setMessages] = useState([]);
  const [messageLength, setMessageLength] = useState(0);
  const [message, setMessage] = useState("");
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const { profile } = useContext(AuthContext);
  const [profileSub, setProfileSub] = useState(profile?.sub || null);

  useEffect(() => {
    if (profile?.sub !== profileSub) {
      setProfileSub(profile?.sub || null);
    }
  }, [profile?.sub, profileSub]);

  useEffect(() => {
    if (isChatOpen) {
      fetchChatHistory();
      connect();
      markMessagesAsRead(); // 채팅방 열릴 때 메시지 읽음 처리
    } else {
      disconnect();
    }
    return () => disconnect();
  }, [isChatOpen, roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:9999/selectChatInfo?chatNo=${roomId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("채팅 히스토리 로드 실패", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const connect = () => {
    const socket = new WebSocket("ws://localhost:9999/ws");
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, (frame) => {
      console.log("STOMP 클라이언트가 연결되었습니다.", frame);
      stompClient.current.subscribe(`/sub/chatroom/${roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        markSingleMessageAsRead(newMessage.messageNo); // 새 메시지를 읽음 처리
      });
    }, (error) => {
      console.error("STOMP 클라이언트 연결 실패", error);
    });
  };

  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect(() => {
        console.log("STOMP 클라이언트가 연결 해제되었습니다.");
      });
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await axios.post('http://localhost:9999/markMessagesAsRead', { chatNo: roomId, memberId: profileSub });
    } catch (error) {
      console.error("메시지 읽음 처리 실패", error);
    }
  };

  const markSingleMessageAsRead = async (messageNo) => {
    try {
      await axios.post('http://localhost:9999/markSingleMessageAsRead', { messageNo, memberId: profileSub });
    } catch (error) {
      console.error("단일 메시지 읽음 처리 실패", error);
    }
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (stompClient.current && stompClient.current.connected && message) {
      const messageObj = {
        chatNo: roomId,
        receiverId: sellerId,
        senderId: profileSub,
        chatContent: message,
        productNo: productInfo.productNo
      };
      console.log(messageObj);
      stompClient.current.send(`/pub/message`, {}, JSON.stringify(messageObj));
      setMessage("");
      setMessageLength(0);
    } else {
      console.error("STOMP 클라이언트가 연결되지 않았습니다.");
    }
  };

  const sendFileMessage = async (file) => {
    if (stompClient.current && stompClient.current.connected) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:9999/images/productImg/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        const { preSignedUrl, objectKey } = response.data;
        console.log('Received preSignedUrl:', preSignedUrl);
        console.log('Object Key:', objectKey);

        // S3 PUT request용으로 axios 인터셉터를 피하기 위한 새로운 axios 인스턴스 생성
        const s3Axios = axios.create();

        // pre-signed URL을 사용해 AWS S3에 파일 업로드
        console.log(file);
        await s3Axios.put(preSignedUrl, file, {
          headers: {
            'Content-Type': file.type
          },
        });
        const baseUrl = preSignedUrl.split("?")[0];
        console.log(baseUrl);
        const messageObj = {
          chatNo: roomId,
          receiverId: sellerId,
          senderId: profileSub,
          chatContent: baseUrl,
          productNo: productInfo.productNo
        };
        setMessages((prevMessages) => [...prevMessages, messageObj]);
        stompClient.current.send(`/pub/message`, {}, JSON.stringify(messageObj));
        scrollToBottom();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("STOMP 클라이언트가 연결되지 않았습니다.");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      sendFileMessage(file);
    }
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
    setMessageLength(event.target.value.length);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(event);
    }
  };

  const safeDate = (dateStr) => {
    if (dateStr) {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    return new Date();
  };

  const renderChatWithDate = () => {
    let lastDate = null;
    return messages.map((item, index) => {
      const inputDate = safeDate(item.chatDate);
      const year = inputDate.getFullYear();
      const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
      const day = inputDate.getDate().toString().padStart(2, '0');
      const hour = inputDate.getHours();
      const minute = inputDate.getMinutes();
      const period = hour >= 12 ? '오후' : '오전';
      const formattedHour = (hour % 12).toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const chatDateEqual = `${year}-${month}-${day}`;
      const isDateChanged = lastDate !== chatDateEqual;
      lastDate = chatDateEqual;
      const chatDateHeader = `${year}년 ${month}월 ${day}일`;
      const chatDateMain = `${period} ${formattedHour}시 ${formattedMinute}분`;

      const chatContent = item.chatContent && item.chatContent || "";
      const isImage = chatContent && chatContent.startsWith('https://lucky4market');

      if (!chatContent) {
        return null;
      }

      const messageContent = isImage ? (
        <img src={chatContent} alt="이미지" className={styles.chatImage} />
      ) : (
        <p className={item.senderId === sellerId ? styles.messageReceiverStyle : styles.messageSenderStyle}>{chatContent}</p>
      );

      return (
        <React.Fragment key={index}>
          {isDateChanged && (
            <div className={styles.chatDateHeader}>
              <span className={styles.dateLine}></span>
              <span>{chatDateHeader}</span>
              <span className={styles.dateLine}></span>
            </div>
          )}
          {item.senderId === sellerId ? (
            <div className={styles.chatBoxOpponent}>
              <div className={styles.chatContentOpponent}>
                {messageContent}
              </div>
              <div className={styles.chatDateBox}>
                <span>{chatDateMain}</span>
              </div>
            </div>
          ) : (
            <div className={styles.chatBoxMe}>
              <div className={styles.chatDateMeBox}>
                <span>{chatDateMain}</span>
              </div>
              <div className={styles.chatContentMe}>
                {messageContent}
              </div>
            </div>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      <Backdrop
        show={isChatOpen}
        onClick={onClose}
      />
      <div className={`${styles.main_chat_side} ${isChatOpen ? styles.open : ''}`}>
        <div className={styles.main_chat_header}>
          <img src="/img/back_arrow.png" onClick={onClose} alt="Back" />
          <h2>{sellerId}</h2>
        </div>
        <div className={styles.main_chat_product_info}>
          <a href={`/productPage/${productInfo && productInfo.productNo}`}>
            <img src={productImage ? productImage.productImagePath : '/img/product_basic.png'} alt="Product" />
          </a>
          <div>
            <h3>{productInfo ? productInfo.productPrice.toLocaleString() : '가격정보 없음'}원</h3>
            <p>{productInfo ? productInfo.productTitle : '제목 없음'}</p>
          </div>
        </div>
        <div className={styles.chat_content_container}>
          {messages.length > 0 && renderChatWithDate()}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage}>
          <div className={styles.messageSendContainer}>
            <textarea
              type="text"
              name="chatInput"
              onChange={handleChange}
              value={message}
              onKeyDown={handleKeyDown}
              placeholder='메세지를 입력해주세요'
              maxLength={1000}
            />
            <label className={styles.chatFileLabel}>
              <input type='file' name='file' className={styles.chatFile} onChange={handleFileChange} />
              <img src='/img/chatFile.png' alt='File' />
            </label>
            <button type="submit"><img src='/img/send.png' alt='Send' /></button>
            <p className={styles.messageLength}>{messageLength} / 1000</p>
          </div>
        </form>
      </div>
    </>
  );
}

export default SubChat;
