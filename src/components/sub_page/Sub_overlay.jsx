import React from 'react';
import styles from '../../css/sub_pageCss/sub_overlay.module.css'

const Backdrop = ({ show, onClick, excludeClasses = [] }) => {
  if (!show) return null;

  const handleClick = (e) => {
    const target = e.target;
    const isInsideExcludedClass = excludeClasses.some(className => 
      target.closest(`.${className}`) !== null
    );

    if (!isInsideExcludedClass) {
      onClick();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleClick}></div>
  );
};


export default Backdrop;
