import React from 'react';
import styles from './css/SlideAnimation.module.css';

const Slide = ({ children, show }) => {
  return (
    <div className={show ? styles.dissolveText : ''}>
      {children}
    </div>
  );
};

export default Slide;