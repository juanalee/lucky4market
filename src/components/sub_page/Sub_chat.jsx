import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import Backdrop from './Sub_overlay';
import styles from '../../css/sub_pageCss/sub_chat.module.css';

function ChatComponent({ isChatOpen, onClose, productImage, productInfo, memberId, roomId }) {
  const [messages, setMessages] = useState([]);
  const [messageLength, setMessageLength] = useState(0);
  const [message, setMessage] = useState("");
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  // 채팅 데이터 로드 및 STOMP 연결
  useEffect(() => {
    if (isChatOpen) {
      fetchChatHistory();
      connect();
    } else {
      disconnect();
    }
    return () => disconnect();
  }, [isChatOpen, roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 채팅 기록을 서버에서 가져옵니다.
  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:9999/selectChatInfo?chatNo=${roomId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("채팅 히스토리 로드 실패", error);
    }
  };

  // 채팅창 스크롤을 아래로 이동시킵니다.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // STOMP 연결
  const connect = () => {
    const socket = new WebSocket("ws://localhost:9999/ws");
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, (frame) => {
      console.log("STOMP 클라이언트가 연결되었습니다.", frame);
      stompClient.current.subscribe(`/sub/chatroom/${roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }, (error) => {
      console.error("STOMP 클라이언트 연결 실패", error);
    });
  };

  // STOMP 연결 해제
  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect(() => {
        console.log("STOMP 클라이언트가 연결 해제되었습니다.");
      });
    }
  };

  // 메시지 전송
  const sendMessage = (event) => {
    event.preventDefault();
    if (stompClient.current && stompClient.current.connected && message) {
      const messageObj = {
        chatNo: roomId,
        receiverId: memberId,
        senderId: 'member3', // 현재 사용자 ID로 수정
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

  // 파일 메시지 전송
  const sendFileMessage = async (file) => {
    if (stompClient.current && stompClient.current.connected) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatNo', roomId);
      formData.append('receiverId', memberId);
      formData.append('senderId', 'member3'); // 현재 사용자 ID로 수정
      formData.append('productNo', productInfo.productNo);
      try {
        const response = await axios.post('http://localhost:9999/uploadFile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data);
        const messageObj = {
          chatNo: roomId,
          receiverId: memberId,
          senderId: 'member3', // 현재 사용자 ID로 수정
          chatContent: response.data.filePath, // 파일 경로 또는 파일 이름
          productNo: productInfo.productNo
        };
        stompClient.current.send(`/pub/message`, {}, JSON.stringify(messageObj));
        scrollToBottom();
      } catch (error) {
        console.error("파일 메시지 전송 실패", error);
      }
    } else {
      console.error("STOMP 클라이언트가 연결되지 않았습니다.");
    }
  };
  
  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      sendFileMessage(file);
    }
  };

  // 메시지 입력 핸들러
  const handleChange = (event) => {
    setMessage(event.target.value);
    setMessageLength(event.target.value.length);
  };

  // Enter 키로 메시지 전송
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // 줄바꿈 방지
      sendMessage(event);
    }
  };

  // 날짜 포맷 처리
  const safeDate = (dateStr) => {
    if (dateStr) {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    return new Date(); // 기본 날짜를 현재로 설정
  };

  // 채팅 메시지를 날짜와 함께 렌더링
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

      // 메시지가 이미지인지 텍스트인지 확인
      console.log(item.chatContent)
      const chatContent = item.chatContent && item.chatContent || "";
      const isImage = chatContent && chatContent.startsWith('/file/ajax/down/') && chatContent.match(/\.(jpg|jpeg|png|gif)$/); // 이미지 파일 확장자 체크
      const messageContent = isImage ? (
          <img src={`http://localhost:9999${chatContent}`} alt="이미지" className={styles.chatImage} />
      ) : (
          <p className={item.senderId === memberId ? styles.messageReceiverStyle : styles.messageSenderStyle}>{chatContent}</p>
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
          {item.senderId === memberId ? (
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
          <h2>{memberId}</h2>
        </div>
        <div className={styles.main_chat_product_info}>
          <img src={productImage ? productImage.productImagePath : '/img/default_product.png'} alt="Product" />
          <div>
            <h3>{productInfo ? productInfo.productPrice.toLocaleString() : '가격정보 없음'}원</h3>
            <p>{productInfo ? productInfo.productTitle : '제목 없음'}</p>
          </div>
        </div>
        <div className={styles.chat_content_container}>
          {messages && messages.length > 0 && renderChatWithDate()}
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
            <button type="submit"><img src='/img/send.png' alt='Send'/></button>
            <p className={styles.messageLength}>{messageLength} / 1000</p>
          </div>
        </form>
      </div>
    </>
  );
}

export default ChatComponent;
