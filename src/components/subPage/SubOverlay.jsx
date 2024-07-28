import React from 'react';
import styles from './css/sub_overlay.module.css'

const Backdrop = ({ show, onClick }) => {
  if (!show) return null;

  const handleClick = (e) => {

    onClick();

  };

  return (
    <div className={styles.backdrop} onClick={handleClick}></div>
  );
};


export default Backdrop;
