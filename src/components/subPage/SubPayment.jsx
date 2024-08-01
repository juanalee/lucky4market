// Payment.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const SubPayment = ({buyMethod, productNo ,addressInfo, productInfo}) => {
  const [mainAddressInfo, setMainAddressInfo] = useState();
  useEffect(() => {
    // addressInfo를 필터링하여 mainAddress가 1인 항목만 가져옵니다.
    const filteredAddress = addressInfo.filter(item => item.mainAddress === 1);
    setMainAddressInfo(filteredAddress);
  }, [addressInfo]); // addressInfo가 변경될 때마다 useEffect가 실행됩니다.

  const onClickPayment = async () => {
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP.init('imp51217870');
    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: buyMethod,                           // PG사
      pay_method: 'card',                           // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`,   // 주문번호
      amount: 100,                                 // 결제금액
      name: productInfo.productTitle,                  // 주문명
      buyer_name: mainAddressInfo.memberName,                           // 구매자 이름
      buyer_tel: mainAddressInfo.memberPhoneNumber,                     // 구매자 전화번호
      buyer_addr: mainAddressInfo.address,                    // 구매자 주소
      buyer_postcode: mainAddressInfo.postalCode                    // 구매자 우편번호
    };
    /* 4. 결제 창 호출하기 */
    IMP.request_pay(data, async function(response){
      if ( response.success ) { //결제 성공
        try {
          await axios.put(`http://localhost:9999/updateProductSaleSatus?productNo=${productNo}`);
          await axios.post(`http://localhost:9999/updateTransaction`,{
            params:{
              productNo : productNo,
              memberId : mainAddressInfo.memberId
            }
          });
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
        console.log(response);
      } else {
        window.location.reload();
      }
    });
  };

  return (
    <button onClick={onClickPayment}>결제하기</button>
  );
};

export default SubPayment;
