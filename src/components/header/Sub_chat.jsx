import React, { useRef } from 'react';
import '../../css/headerCss/header.css';

const Chat = ({ isOpen, onClose }) => {
  const chatArea = useRef();

  const chatWidth = () => {
    chatArea.current.style.width = '600px';
  };

  const closeChat = () => {
    chatArea.current.style.width = '0';
    onClose(); // Notify parent to close chat
  };

  return (
    <div className={`side ${isOpen ? 'open' : ''}`} ref={chatArea}>
      <span onClick={closeChat}>
        <img src='/img/x.png' alt='close' className='x' />
      </span>
      <a href='#'>하이</a>
      <a href='#'>하이</a>
      <a href='#'>하이</a>
    </div>
  );
};

export default Chat;
