  import React, { useState, useEffect, useRef } from 'react';
  import { Stomp } from '@stomp/stompjs';
  import axios from 'axios';
  import Backdrop from './Sub_overlay';
  import styles from '../../css/sub_pageCss/sub_chat.module.css';

  function ChatComponent({ isChatOpen, onClose, productImage, productInfo, memberId, roomId }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);

    // 채팅 데이터 로드
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
      } else {
        console.error("STOMP 클라이언트가 연결되지 않았습니다.");
      }
    };

    const handleChange = (event) => {
      setMessage(event.target.value);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // 줄바꿈 방지
        sendMessage(event);
      }
    };

    const safeDate = (dateStr) => {
      if (dateStr) {
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? new Date() : date;
      }
      return new Date(); // 기본 날짜를 현재로 설정
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
        return (
          <>
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
                  <p>{item.chatContent}</p>
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
                  <p>{item.chatContent}</p>
                </div>
              </div>
            )}
          </>
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
              />
              <button type="submit"><img src='/img/send.png' alt='Send'/></button>
            </div>
          </form>
        </div>
      </>
    );
  }

  export default ChatComponent;
