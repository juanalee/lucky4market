// Payment.jsx
import React from 'react';

const Payment = ({buyMehod}) => {

  const onClickPayment = () => {
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP.init('imp51217870');
    console.log(buyMehod);
    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: buyMehod,                           // PG사
      pay_method: 'card',                           // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`,   // 주문번호
      amount: 1000,                                 // 결제금액
      name: '아임포트 결제 데이터 분석',                  // 주문명
      buyer_name: '홍길동',                           // 구매자 이름
      buyer_tel: '01012341234',                     // 구매자 전화번호
      buyer_email: 'example@example',               // 구매자 이메일
      buyer_addr: '신사동 661-16',                    // 구매자 주소
      buyer_postcode: '06018',                      // 구매자 우편번호
    };
    
    /* 4. 결제 창 호출하기 */
    IMP.request_pay(data, function(response){
      if ( response.success ) { //결제 성공
        console.log(response);
      } else {
        alert('결제실패 : ' + response.error_msg);
        window.location.reload();
      }
    });
  };

  return (
    <button onClick={onClickPayment}>결제하기</button>
  );
};

export default Payment;
