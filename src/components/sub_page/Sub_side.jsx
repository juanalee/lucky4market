import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import Payment from './Sub_payment';
import Backdrop from './Sub_overlay';
import styles from '../../css/sub_pageCss/sub_purchase_side.module.css';
import axios from 'axios';
import Sub_address from './Sub_address';

const Sub_side = ({ isOpen, onClose, productImage, productInfo }) => {
  const [tradeMethod, setTradeMethod] = useState(0);
  const [buyMethod, setBuyMethod] = useState('kakaopay');
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isAddressOpen, setAddressOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isAddAddress, setAddAddressOpen] = useState(false);
  const [addressInfo, setAddressInfo] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [mainAddressInfo, setMainAddressInfo] = useState([]);

  useEffect(() => {
    const fetchAddressInfo = async () => {
      try {
        const response = await axios.get('http://localhost:9999/addressInfo?memberId=member4');
        setAddressInfo(response.data);
      } catch (error) {
        console.error('주소 정보를 가져오는 데 실패했습니다:', error);
      }
    };

    fetchAddressInfo();
  }, []);

  useEffect(() => {
    const filteredMainAddresses = addressInfo.filter(info => info.mainAddress === 1);
    setMainAddressInfo(filteredMainAddresses);
  }, [addressInfo]);

  const tradeMethodClass = isOpen ? styles.open : '';
  const purchaseClass = isPurchaseOpen ? styles.open : '';
  const addressClass = isAddressOpen ? styles.open : '';
  const editClass = isEditOpen ? styles.open : '';
  const addAddressClass = isAddAddress ? styles.open : '';

  const tradeMethodDeliveryClass = tradeMethod === 1 ? styles.selected : '';
  const tradeMethodDirectClass = tradeMethod === 2 ? styles.selected : '';

  const selectTradeMethodDelivery = () => setTradeMethod(1);
  const selectTradeMethodDirect = () => setTradeMethod(2);
  const proceedToPurchase = () => setIsPurchaseOpen(true);
  const closePurchase = () => {
    setIsPurchaseOpen(false);
    onClose();
  };

  const addressOpen = () => setAddressOpen(true);
  const addressClose = () => setAddressOpen(false);
  const editOpen = () => setEditOpen(true);
  const editClose = () => setEditOpen(false);
  const addAddressOpen = () => setAddAddressOpen(true);
  const addAddressClose = () => setAddAddressOpen(false);

  const handleAddressClick = (id) => setSelectedAddressId(id);

  return (
    <>
      <Backdrop
        show={isOpen || isPurchaseOpen}
        onClick={() => {
          if (isPurchaseOpen) {
            closePurchase();
          } else {
            onClose();
          }
        }}
        excludeClasses={['purchase_side', 'tradeMethod_side']}
      />
      <div className={`${styles.tradeMethod_side} ${tradeMethodClass}`}>
        <div className={styles.purchase_tradeMethod_container}>
          <div className={styles.purchase_header}>
            <span onClick={onClose}>
              <img src='/img/x.png' alt='close' className={styles.x} />
            </span>
            <h2>원하시는 거래방법을 선택해주세요.</h2>
          </div>
          <div className={styles.purchase_main}>
            <div
              className={`${styles.direct} ${tradeMethodDeliveryClass}`}
              onClick={selectTradeMethodDelivery}
            >
              <h3>택배거래</h3>
              <p>원하는 주소로 판매자에게 택배로 받을 수 있어요.</p>
            </div>
            <div
              className={`${styles.delivery} ${tradeMethodDirectClass}`}
              onClick={selectTradeMethodDirect}
            >
              <h3>직거래</h3>
              <p>채팅으로 약속을 정하고 현금없이 직접 만나 받을 수 있어요.</p>
            </div>
            <button className={styles.purchase_next} onClick={proceedToPurchase}>다음</button>
          </div>
        </div>
      </div>
      <div className={`${styles.purchase_side} ${purchaseClass}`}>
        <div className={styles.purchase_container}>
          <span onClick={closePurchase}>
            <img src='/img/x.png' alt='close' className={styles.x} />
          </span>
          {tradeMethod === 1 ?
            <h2>택배거래로 구매</h2> :
            <h2>직거래로 구매</h2>
          }
          <div className={styles.purchase_productInfo}>
            {productImage?.productImagePath ? (
              <img src={productImage.productImagePath} alt='Product' />
            ) : (
              <p>상품 이미지를 불러올 수 없습니다.</p>
            )}
            <div>
              <p>{productInfo.productTitle}</p>
              <p className={styles.purchase_price}>{productInfo.productPrice.toLocaleString()}원</p>
            </div>
          </div>
        </div>
        <hr />
        {tradeMethod === 1 && mainAddressInfo.length > 0 && (
          <div className={styles.buyer_address}>
            <h2>배송정보</h2>
            {mainAddressInfo.map(info => (
              <div key={info.memberAddressNo} className={styles.buyer_address_info}>
                <h3>집</h3>
                <p>{info.memberName}</p>
                <p>{info.memberPhoneNumber}</p>
                <p>[{info.postalCode}] {info.address}</p>
              </div>
            ))}
            <button type='button' className={styles.change_address} onClick={addressOpen}>변경</button>
          </div>
        )}
        <hr />
        <div className={styles.buyMethod_container}>
          <h2>결제방법</h2>
          <div className={styles.buyMethod}>
            <span
              className={`${styles.buyMethod} ${buyMethod === 'kakaopay' ? styles.selected : ''}`}
              onClick={() => setBuyMethod('kakaopay')}
            >
              카카오페이
            </span>
            <span
              className={`${styles.buyMethod} ${buyMethod === 'tosspay' ? styles.selected : ''}`}
              onClick={() => setBuyMethod('tosspay')}
            >
              토스페이
            </span>
            <span
              className={`${styles.buyMethod} ${buyMethod === 'payco' ? styles.selected : ''}`}
              onClick={() => setBuyMethod('payco')}
            >
              PAYCO
            </span>
            <span
              className={`${styles.buyMethod} ${buyMethod === 'html5_inicis' ? styles.selected : ''}`}
              onClick={() => setBuyMethod('html5_inicis')}
            >
              카드결제
            </span>
          </div>
        </div>
        <hr />
        <div className={styles.payment_amount}>
          <div className={styles.last_price_container}>
            <h2>최종 결제 금액</h2>
            <p className={styles.last_price}>{productInfo.productPrice.toLocaleString()}원</p>
          </div>
          <Payment buyMethod={buyMethod} />
        </div>
      </div>
      <div className={`${styles.address_side} ${addressClass}`}>
        <img src='/img/back_arrow.png' alt='back' onClick={addressClose} className={styles.addressBack} />
        <h2>배송지 설정</h2>
        <div className={styles.addressEdit} onClick={editOpen}>
          <img src='/img/edit.png' alt='edit' />
          <p>편집</p>
        </div>
        {addressInfo.length > 0 && (
          <>
            {addressInfo.map(info => (
              <div
                key={info.memberAddressNo}
                className={`${styles.addressInfo} ${selectedAddressId === info.memberAddressNo ? styles.selected : ''}`}
                onClick={() => handleAddressClick(info.memberAddressNo)}
              >
                <h3>집</h3>
                {info.mainAddress === 1 && <p className={styles.mainAddress}>대표 배송지</p>}
                <p>{info.memberName}</p>
                <p>{info.memberPhoneNumber}</p>
                <p>[{info.postalCode}] {info.address}</p>
              </div>
            ))}
          </>
        )}
        <button className={styles.addAddress} onClick={addAddressOpen}>+ 배송지 추가</button>
        <button className={styles.editSubmit}>변경</button>
      </div>
      <div className={`${styles.edit_side} ${editClass}`}>
        <img src='/img/back_arrow.png' alt='back' onClick={editClose} className={styles.addressBack} />
        <h2>배송지 편집</h2>
        {addressInfo.length > 0 && (
          <>
            {addressInfo.map(info => (
              <div key={info.memberAddressNo} className={styles.editInfo}>
                <h3>집</h3>
                {info.mainAddress === 1 && <p className={styles.mainAddress}>대표 배송지</p>}
                <p>{info.memberName}</p>
                <p>{info.memberPhoneNumber}</p>
                <p>[{info.postalCode}] {info.address}</p>
                <div className={styles.editBtn}>
                  <button onClick={() => { /* 대표 배송지 설정 로직 */ }}>대표 배송지 설정</button>
                  <span></span>
                  <button>삭제</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className={`${styles.addAddressSide} ${addAddressClass}`}>
        <img src='/img/back_arrow.png' alt='back' onClick={addAddressClose} className={styles.addressBack} />
        <h2>배송지 추가</h2>
        <div className={styles.addAddressInfo}> 
          <input type='text' placeholder='배송지명 (최대 10글자)' maxLength={10} />
          <input type='text' placeholder='이름 입력' />
          <InputMask mask="999-9999-9999" maskChar={null}>
            {(inputProps) => <input type='text' {...inputProps} placeholder='휴대폰 번호' />}
          </InputMask>
          <Sub_address />
          <input type='text' placeholder='상세 주소(예시: 101동 101호)' />
        </div>
        <button className={styles.editSubmit}>완료</button>
      </div>
    </>
  );
};

export default Sub_side;
