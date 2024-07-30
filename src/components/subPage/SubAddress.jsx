import React, { useEffect, useState } from 'react';
import Postcode from 'react-daum-postcode';
import styles from './css/sub_purchase_side.module.css';

function SubAddress({ setAddressMainInfo, resetAddress }) {
  const [showPostcode, setShowPostcode] = useState(false);
  const [selectAddress, setSelectAddress] = useState({});

  useEffect(() => {
    if (resetAddress) {
      setSelectAddress({});
    }
  }, [resetAddress]);


  const handleComplete = (data) => {
    console.log(data);
    const fullAddress = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
    const address = {
      fullAddress,
      postalCode: data.zonecode
    };
    setSelectAddress(address);
    setAddressMainInfo(address);
    setShowPostcode(false);
  };

  const sidebarClass = showPostcode ? `${styles.postcode_side} ${styles.open}` : styles.postcode_side;

  const postcodeStyle = {
    width: '100%',
    height: '100%',
    marginTop : '70px',
    borderTop : '1px solid black',
  };
  
  return (
    <>
        <input
          type='text'
          placeholder='주소찾기'
          value={selectAddress.fullAddress || ''}
          onClick={() => setShowPostcode(true)}
          readOnly
        />

      {showPostcode && (
        <div className={sidebarClass}>
          <Postcode
          onComplete={handleComplete}
          autoClose={false}
          style={postcodeStyle}
          />
          <button
            onClick={() => setShowPostcode(false)}
            className={styles.close_button}
          >
            <img src='/img/back_arrow.png' alt='back'></img>
          </button>
        </div>
      )}
    </>
  );
}

export default SubAddress;
