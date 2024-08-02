import React from 'react';
import styles from './AdminPopup.module.css';

const AdminPopup = ({ show, onClose, onConfirm, message, isConfirmation }) => {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalDialog}>
        <div className={styles.modalHeader}>
          <h2>확인</h2>
          <button onClick={onClose} className={styles.btnClose} aria-hidden="true">×</button>
        </div>
        <div className={styles.modalBody}>
          <p>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          {isConfirmation ? (
            <>
              <button onClick={onConfirm} className={styles.btnConfirm}>확인</button>
              <button onClick={onClose} className={styles.btnCancel}>취소</button>
            </>
          ) : (
            <button onClick={onClose} className={`${styles.btnConfirm} ${styles.btnSingle}`}>확인</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPopup;