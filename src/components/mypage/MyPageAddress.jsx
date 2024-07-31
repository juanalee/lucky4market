import React, { useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import styles from "./css/MyPageAddress.module.css";

export default function MyPageAddress() {
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  const open = useDaumPostcodePopup();

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.userSelectedType === 'R') { // 도로명 주소인 경우
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    } else { // 지번 주소인 경우
      fullAddress = data.jibunAddress;
    }

    setPostalCode(data.zonecode); // 우편번호 설정
    setAddress(fullAddress); // 주소 설정
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <div className={styles.my_page_address_container}>
      <div className={styles.my_page_postal_code_container}>
        <input
          className={styles.my_page_postal_code}
          type="text"
          placeholder="우편번호"
          value={postalCode}
          readOnly
        />
        <button
          className={styles.my_page_postal_code_button}
          type='button'
          onClick={handleClick}
        >
          우편번호 찾기
        </button>
      </div>
      <input
        className={styles.my_page_address}
        type="text"
        placeholder="주소"
        value={address}
        readOnly
      />
      <input
        className={styles.my_page_detail_address}
        type="text"
        placeholder="상세 주소"
        value={detailAddress}
        onChange={(e) => setDetailAddress(e.target.value)} // 상세 주소 업데이트
      />
    </div>
  );
};