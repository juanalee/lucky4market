import React, { useState, useEffect } from 'react';
import styles from './IdPasswdRecovery.module.css';
import IdRecoverForm from './IdRecoverForm';
import PasswdResetForm from './PasswdResetForm';

const IdPasswdRecovery = ({ show, onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'id');

  useEffect(() => {
    if (show) {
      setActiveTab(initialTab);
    }
  }, [initialTab, show]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      {show && (
        <div className={styles.recoveryModalBackdrop} onClick={onClose}>
          <div className={styles.recoveryModalDialog} role="document" onClick={(e) => e.stopPropagation()}>
            <div className={styles.recoveryLabModalBody}>
              <div className={styles.recoveryModalHeader}>
                <h2 className={styles.recoveryModalTitle}>아이디 / 비밀번호 찾기</h2>
                <button type="button" className={styles.recoveryClose} onClick={onClose}>&times;</button>
              </div>
              <div className={styles.recoveryTabs}>
                <button
                  className={`${styles.recoveryTab} ${activeTab === 'id' ? styles.active : ''}`}
                  onClick={() => handleTabClick('id')}
                >
                  아이디 찾기
                </button>
                <button
                  className={`${styles.recoveryTab} ${activeTab === 'password' ? styles.active : ''}`}
                  onClick={() => handleTabClick('password')}
                >
                  비밀번호 재설정
                </button>
              </div>
              <div className={styles.recoveryTabContent}>
                {activeTab === 'id' && <IdRecoverForm activeTab={activeTab} />}
                {activeTab === 'password' && <PasswdResetForm activeTab={activeTab} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IdPasswdRecovery;
