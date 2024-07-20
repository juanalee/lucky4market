import React, { useState, useEffect } from 'react';
import Payment from './Sub_payment';
import Backdrop from './Sub_overlay';
import styles from '../../css/sub_pageCss/sub_purchase_side.module.css';

const Sub_side = ({ isOpen, onClose, productImage, productInfo }) => {
  const [tradeMethod, setTradeMethod] = useState(0);
  const [buyMethod, setBuyMethod] = useState('kakaopay');
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

  useEffect(() => {
  }, [tradeMethod]);

  const tradeMethodClass = isOpen ? styles.open : '';
  const purchaseClass = isPurchaseOpen ? styles.open : '';

  const tradeMethodDeliveryClass = tradeMethod === 1 ? styles.selected : '';
  const tradeMethodDirectClass = tradeMethod === 2 ? styles.selected : '';

  const selectTradeMethodDelivery = () => {
    setTradeMethod(1);
  };

  const selectTradeMethodDirect = () => {
    setTradeMethod(2);
  };

  const proceedToPurchase = () => {
    setIsPurchaseOpen(true);
  };

  const closePurchase = () => {
    setIsPurchaseOpen(false);
    onClose();
  };

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
          {tradeMethod == 1 ?
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
        {tradeMethod === 1 &&
        <div className={styles.buyer_address}>
          <h2>배송정보</h2>  
          <p>집</p>
          <span>이름</span>
          <span>전화번호</span>
          <p>주소</p>
          <button type='button' className={styles.change_address}>변경</button>
          </div>
        }
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
          <Payment buyMethod={buyMethod}/>
        </div>
      </div>
    </>
  );
};

export default Sub_side;
