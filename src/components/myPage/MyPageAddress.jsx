import React, { useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import styles from "./css/MyPageAddress.module.css";

export default function MyPageAddress({ postalCode, address, detailAddress, onAddressChange }) {
  const [myPostalCode, setMyPostalCode] = useState(postalCode);
  const [myAddress, setMyAddress] = useState(address);
  const [myDetailAddress, setMyDetailAddress] = useState(detailAddress);

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

    setMyPostalCode(data.zonecode); // 우편번호 설정
    setMyAddress(fullAddress); // 주소 설정

    // 부모 컴포넌트에 주소 변경 통지
    onAddressChange(data.zonecode, fullAddress, myDetailAddress);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  const handleDetailAddressChange = (e) => {
    setMyDetailAddress(e.target.value);
    onAddressChange(myPostalCode, myAddress, e.target.value);
  };

  return (
    <div className={styles.my_page_address_container}>
      <div className={styles.my_page_postal_code_container}>
        <input
          className={styles.my_page_postal_code}
          type="text"
          placeholder="우편번호"
          value={myPostalCode}
          readOnly
        />
        <button
          className={styles.my_page_postal_code_button}
          type="button"
          onClick={handleClick}
        >
          우편번호 찾기
        </button>
      </div>
      <input
        className={styles.my_page_address}
        type="text"
        placeholder="주소"
        value={myAddress}
        readOnly
      />
      <input
        className={styles.my_page_detail_address}
        type="text"
        placeholder="상세 주소"
        value={myDetailAddress}
        onChange={handleDetailAddressChange} // 상세 주소 업데이트
      />
    </div>
  );
}
