import React from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';

function Sub_address({ setAddressObj }) {
  const open = useDaumPostcodePopup();

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = ''; // 추가될 주소
    let localAddress = data.sido + ' ' + data.sigungu; // 지역주소 (시, 도 + 시, 군, 구)
    
    if (data.addressType === 'R') { // 주소 타입이 도로명 주소일 경우
      if (data.bname !== '') {
        extraAddress += data.bname; // 법정동, 법정리
      }
      if (data.buildingName !== '') { // 건물명
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      // 지역주소 제외 전체주소 치환
      fullAddress = fullAddress.replace(localAddress, '');
    }
    
    // 최종 주소 객체를 생성합니다
    const address = {
      fullAddress,
      extraAddress,
      postalCode: data.zonecode,
    };

    // 상위 컴포넌트로 주소를 전달합니다
    setAddressObj(address);
  }

  // 클릭 시 발생할 이벤트
  const handleClick = () => {
    open({ onComplete: handleComplete });
  }

  return (
    <div>
      <button type="button" onClick={handleClick}>주소찾기</button>
    </div>
  );
}

export default Sub_address;
