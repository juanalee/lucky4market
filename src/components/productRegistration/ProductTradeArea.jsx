import React from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import styles from './css/ProductTradeArea.module.css'

const ProductTradeArea = ({ formData, handleChange }) => {
    // DaumPostcodePopup 훅을 사용하여 팝업을 여는 함수 정의
    const open = useDaumPostcodePopup();

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = ''; // 추가될 주소
        let localAddress = data.sido + ' ' + data.sigungu; // 지역주소 (시, 도 + 시, 군, 구)

        if (data.addressType === 'R') { // 주소타입이 도로명주소일 경우
            if (data.bname !== '') {
                extraAddress += data.bname; // 법정동, 법정리
            }
            if (data.buildingName !== '') { // 건물명
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            // 지역주소 제외 전체주소 치환
            fullAddress = fullAddress.replace(localAddress, '');
            // 상태 업데이트
            handleChange({
                target: {
                    name: 'tradeArea',
                    value: localAddress + ' ' + fullAddress + (extraAddress !== '' ? ` (${extraAddress})` : '')
                }
            });
        }
    }

    // 클릭 시 발생할 이벤트
    const handleClick = () => {
        // 주소 검색이 완료되고, 결과 주소를 클릭 시 해당 함수 수행
        open({ onComplete: handleComplete });
    }

    return (
        <div>
            <button type="button" onClick={handleClick}  className={styles.ProductTradeArea}>
               직거래 주소 등록
            </button>
            <input
                type="text"
                name="tradeArea"
                value={formData.tradeArea || ''} // formData.tradeArea가 undefined일 때 빈 문자열로 설정
                readOnly // 입력 불가, 주소 찾기 결과만 표시
                className={styles.tradeAreaInput} // CSS 클래스 추가 (필요에 따라 스타일 조정)
            />
        </div>
    );
};

export default ProductTradeArea;
