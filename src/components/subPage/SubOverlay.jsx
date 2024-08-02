import React, { useEffect } from 'react';
import styles from './css/SubOverlay.module.css';

const SubOverlay = ({ show, onClick }) => {
  useEffect(() => {
    if (show) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }

    // Cleanup: 컴포넌트가 언마운트될 때도 클래스 제거
    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className={styles.backdrop} onClick={onClick}></div>
  );
};

export default SubOverlay;
