import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import styles from './IdPasswdRecovery.module.css';
import IdRecoverForm from './IdRecoverForm';
import PasswdResetForm from './PasswdResetForm';

const IdPasswdRecovery = ({ show, onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'id');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

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
                <h2 className={styles.recoveryModalTitle} lang="ko">아이디 / 비밀번호 찾기</h2>
                <button type="button" className={styles.recoveryClose} onClick={onClose}>&times;</button>
              </div>
              <div className={styles.recoveryTabs}>
                <button
                  className={`${styles.recoveryTab} ${activeTab === 'id' ? styles.active : ''}`}
                  onClick={() => handleTabClick('id')}
                  lang="ko"
                >
                  아이디 찾기
                </button>
                <button
                  className={`${styles.recoveryTab} ${activeTab === 'password' ? styles.active : ''}`}
                  onClick={() => handleTabClick('password')}
                  lang="ko"
                >
                  비밀번호 재설정
                </button>
              </div>
              <div className={styles.recoveryTabContent}>
                {activeTab === 'id' && <IdRecoverForm />}
                {activeTab === 'password' && <PasswdResetForm />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IdPasswdRecovery;
