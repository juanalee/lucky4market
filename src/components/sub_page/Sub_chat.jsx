import React from 'react';
import Backdrop from "./Sub_overlay";
import styles from '../../css/sub_pageCss/sub_chat.module.css';

const Sub_chat = ({ isChatOpen, onClose, productImage, productInfo, memberId, chatInfo }) => {
  const chatSideClass = isChatOpen ? styles.open : '';
  // 날짜가 변경되는 부분을 표시하기 위한 함수
  const renderChatWithDate = () => {
    let lastDate = null;

    return chatInfo.map((item, index) => {
      
      const inputDate = new Date(item.chatDate);
      
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
      <Backdrop show={isChatOpen} onClick={onClose} />
      <div className={`${styles.main_chat_side} ${chatSideClass}`}>
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
          {chatInfo && chatInfo.length > 0 && renderChatWithDate()}
        </div>
        <div className={styles.chat_content_input}>
          {/* 채팅 입력 필드를 여기에 추가 */}
        </div>
      </div>
    </>
  );
};

export default Sub_chat;
