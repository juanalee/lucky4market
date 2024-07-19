import React, { useState, useEffect, useRef } from 'react';
import Payment from './Sub_payment';

const Sub_side = ({ isOpen, onClose, productImage , productInfo }) => {
  const tradeMethodContainer = useRef();
  const purchaseContainer = useRef();
  const purchaseDirect = useRef();
  const purchaseDelivery = useRef();
  const tradeMethodArea = useRef();
  const purchaseArea = useRef(null);
  const [tradeMethod, setTradeMethod] = useState(0);
  const [buyMehod, setBuyMethod] = useState('kakaopay');
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

  useEffect(() => {
    tradeMethodArea.current.style.width = isOpen ? '600px' : '0';
    if (isOpen) {
      resetTradeMethodSelection();
    }
  }, [isOpen]);

  useEffect(() => {
    purchaseArea.current.style.width = isPurchaseOpen ? '600px' : '0';
  }, [isPurchaseOpen]);

  const nextPurchase = () => {
    tradeMethodArea.current.style.width = '0';
    setIsPurchaseOpen(true);
  };

  const closePurchase = () => {
    setIsPurchaseOpen(false); 
    onClose();
  };

  const tradeMethodDirect = () => {
    purchaseDirect.current.style.borderColor = 'red';
    purchaseDelivery.current.style.borderColor = '#ccc';
    setTradeMethod(1);
  };

  const tradeMethodDelivery = () => {
    purchaseDelivery.current.style.borderColor = 'red';
    purchaseDirect.current.style.borderColor = '#ccc';
    setTradeMethod(2);
  };

  const resetTradeMethodSelection = () => {
    setTradeMethod(0);
    purchaseDirect.current.style.borderColor = '#ccc';
    purchaseDelivery.current.style.borderColor = '#ccc';
  };

  return (
    <>
      <div className='tradeMethod_side' ref={tradeMethodArea}>
        <div className='purchase_tradeMethod_container' ref={tradeMethodContainer}>
          <div className='purchase_header'>
            <span onClick={onClose}><img src='/img/x.png' alt='close' className='x' /></span>
            <h2>원하시는 거래방법을 선택해주세요.</h2>
          </div>
          <div className='purchase_main'>
            <div className='direct' ref={purchaseDirect} onClick={tradeMethodDirect}>
              <h3>택배거래</h3>
              <p>원하는 주소로 판매자에게 택배로 받을 수 있어요.</p>
            </div>
            <div className='delivery' ref={purchaseDelivery} onClick={tradeMethodDelivery}>
              <h3>직거래</h3>
              <p>채팅으로 약속을 정하고 현금없이 직접 만나 받을 수 있어요.</p>
            </div>
            <button className='purchase_next' onClick={nextPurchase}>다음</button>
          </div>
        </div>
      </div>
      <div className='purchase_side' ref={purchaseArea}>
        <div className='purchase_container' ref={purchaseContainer}>
          <span onClick={closePurchase}><img src='/img/x.png' alt='close' className='x' /></span>
          <h2>택배거래로 구매</h2>
          <div className='purchase_productInfo'>
            {productImage && productImage.productImagePath ? (
              <img src={productImage.productImagePath} alt='Product' />
            ) : (
              <p>상품 이미지를 불러올 수 없습니다.</p>
            )}
            <div>
              <p>{productInfo.productTitle}</p>
              <p className='purchase_price'>{productInfo.productPrice.toLocaleString()}원</p>
            </div>
          </div>
        </div>
        <hr />
        <div className='buyer_address'>
          <h2>배송정보</h2>  
          <p>집</p>
          <span>이름</span>
          <span>전화번호</span>
          <p>주소</p>
        <button type='button' className='change_address'>변경</button>
        </div>
        <hr />
        <div className='buyMethod_container'>
          <h2>결제방법</h2>
          <div className='buyMethod'>
          <span className={buyMehod === 'kakaopay' ? 'selected' : ''} onClick={() => setBuyMethod('kakaopay')}>카카오페이</span>
          <span className={buyMehod === 'tosspay' ? 'selected' : ''} onClick={() => setBuyMethod('tosspay')}>토스페이</span>
          <span className={buyMehod === 'payco' ? 'selected' : ''} onClick={() => setBuyMethod('payco')}>PAYCO</span>
          <span className={buyMehod === 'html5_inicis' ? 'selected' : ''} onClick={() => setBuyMethod('html5_inicis')}>카드결제</span>
        </div>
        </div>
        <hr />
        <div className='Payment_amount'>
          <div className='last_price_container'>
            <h2>최종 결제 금액</h2>
            <p className='last_price'>{productInfo.productPrice.toLocaleString()}원</p>
          </div>
          <Payment buyMehod={buyMehod}/>
        </div>
      </div>
    </>
  );
};

export default Sub_side;
