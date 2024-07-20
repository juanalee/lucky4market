import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PurchaseSide from './Sub_side';
import styles from '../../css/sub_pageCss/sub_productInfo.module.css';
import Backdrop from './Sub_overlay';

const ProductInfo = ({ productImage }) => {
  const reportArea = useRef();

  const [timePassed, setTimePassed] = useState("");
  const [likeImg, setLikeImg] = useState("/img/heart.png");
  const [productInfo, setProductInfo] = useState({
    productTitle: '',
    productPrice: 0,
    productCount: 0,
    productLike: 0,
    productDate: '',
    productStatus: '',
    productContent: '',
    categoryNo: 0 // 기본값 설정
  });

  const [deliveryInfo, setDeliveryInfo] = useState({
    deliveryName: '',
    tradiArea: ''
  });

  const [categoryInfo, setCategoryInfo] = useState([]);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const buyWidth = () => {
    setIsPurchaseOpen(true);
  };

  const reportOpen = () => {
    reportArea.current.style.display = 'block';
    setIsReportOpen(true);
  };

  const reportClose = () => {
    reportArea.current.style.display = 'none';
    setIsReportOpen(false);
  };

  const fetchData = async () => {
    try {
      const productResponse = await axios.get('http://localhost:9999/productInfo?productNo=20');
      setProductInfo(productResponse.data);

      const deliveryResponse = await axios.get('http://localhost:9999/deliveryInfo?productNo=20');
      setDeliveryInfo(deliveryResponse.data);

      const categoryResponse = await axios.get(`http://localhost:9999/categoryInfo?categoryNo=${productResponse.data.categoryNo}`);
      setCategoryInfo(categoryResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const updateTimePassed = () => {
      if (productInfo.productDate) {
        const currentDate = new Date();
        const createDate = new Date(productInfo.productDate); // Using ISO 8601 format

        const second = currentDate - createDate;
        const hour = Math.floor(second / 1000 / 60 / 60);
        const minute = Math.floor(second / 1000 / 60);
        const day = Math.floor(hour / 24);

        if (day > 0) {
          setTimePassed(`${day}일 전`);
        } else if (hour > 0) {
          setTimePassed(`${hour}시간 전`);
        } else {
          setTimePassed(`${minute}분 전`);
        }
      }
    };

    updateTimePassed();
  }, [productInfo, categoryInfo]);

  const likeClick = () => {
    setLikeImg((item) =>
      item === "/img/heart.png" ? "/img/redheart.png" : "/img/heart.png"
    );
  };

  return (
    <>
      <div className={styles.product_information}>
        <div className={styles.product_category}>
          <Link to="#">홈</Link>
          <span>{'>'}</span>
          <Link to="#">{categoryInfo.length > 0 && categoryInfo[1]?.categoryName}</Link>
          <span>{'>'}</span>
          <Link to="#">{categoryInfo.length > 0 && categoryInfo[0]?.categoryName}</Link>
        </div>
        <p className={styles.product_title}>{productInfo.productTitle}</p>
        <p className={styles.product_price}>{productInfo.productPrice.toLocaleString()}원</p>
        <div className={styles.product_sub_information}>
          <div className={styles.product_create}>
            <img src="/img/time.png" alt="time" />
            <span>{timePassed}</span>
          </div>
          <div className={styles.product_count}>
            <img src="/img/find.png" alt="find" />
            <span>{productInfo.productCount}</span>
          </div>
          <div className={styles.product_like}>
            <img src={likeImg} alt="like" onClick={likeClick} />
            <span>{productInfo.productLike}</span>
          </div>
          <div className={styles.product_report}>
            <a href="#" onClick={reportOpen}>
              <img src="/img/report.png" alt="report" />신고하기
            </a>
          </div>
          <Backdrop
            show={isReportOpen}
            onClick={reportClose} // 수정된 부분
            excludeClasses={['report_container']} // 사이드 바를 제외하고 클릭을 감지
          />
          <div className={styles.report_container} ref={reportArea}>
            <div className={styles.report}>
              <h2>신고하기</h2>
              <span className={styles.close} onClick={reportClose}>
                <img src="/img/x.png" alt="close" />
              </span>
              <hr />
              <p>광고성 상점이에요.</p>
              <hr />
              <p>상품 정보가 부정확해요.</p>
              <hr />
              <p>거래 금지 품목으로 판단돼요.</p>
              <hr />
              <p>사기가 의심돼요.</p>
              <hr />
              <p>기타</p>
              <button className={styles.reportSubmit}>등록</button>
            </div>
          </div>
        </div>
        <div className={styles.product_status_information}>
          <div className={styles.product_status}>
            <p>제품상태</p>
            <p>{productInfo.productStatus}</p>
          </div>
          <span className={styles.line}></span>
          <div className={styles.product_delivery}>
            <p>거래방식</p>
            <p>직거래,택배</p>
          </div>
          <span className={styles.line}></span>
          <div className={styles.product_delivery_fee}>
            <p>배송</p>
            <p>{deliveryInfo.deliveryName}</p>
          </div>
        </div>
        <ul className={styles.product_trade_area}>
          <li>거래희망 지역 - {deliveryInfo.tradiArea}</li>
        </ul>
        <div className={styles.product_interaction_area}>
          <button className={styles.like_btn} onClick={likeClick}>
            <img src={likeImg} alt="like" />
          </button>
          <button className={styles.chat_btn}>채팅하기</button>
          <button className={styles.buy_btn} onClick={buyWidth}>구매하기</button>
        </div>
      </div>
      <div className={styles.product_content}>
        <div className={styles.content}>
          <h2>상품 정보</h2>
          <hr />
          <p>{productInfo.productContent}</p>
        </div>
      </div>
      <PurchaseSide isOpen={isPurchaseOpen} onClose={() => setIsPurchaseOpen(false)} productImage={productImage} productInfo={productInfo}/>
    </>
  );
};

export default ProductInfo;
