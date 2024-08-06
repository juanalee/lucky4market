import React, { useState, useEffect } from 'react';
import MypageSideBar from './MypageSideBar';
import axios from 'axios';
import styles from './css/MypageProductSalesList.module.css';
import MypagReviewWrite from './MyPageReviewWrite';
import MypageMemberId from './MypageMemberId';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import { Link } from 'react-router-dom';

const MypageProductPurchaseHistory = () => {
  const [memberProductList, setMemberProductList] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState({}); // 리뷰 작성 폼 상태
  const buyerId = MypageMemberId(); // 커스텀 훅을 사용

  const readData = async () => {
    if (!buyerId) return; // buyerId가 유효하지 않은 경우 종료
    try {
      const response = await axios.get(`https://lucky4market.me/member/ProductPurchaseHistory/${buyerId}`);
      console.log(response.data); // 응답 데이터 구조 확인
      setMemberProductList(response.data);
    } catch (error) {
      console.error('Error fetching member list:', error);
    }
  };

  useEffect(() => {
    readData();
  }, [buyerId]); // buyerId 변경 시 데이터 새로 읽어오기

  // 숫자를 천 단위로 구분하여 포맷팅하는 함수
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price); // 한국 원화 형식
  };

  // 날짜에 14일을 더한 값을 계산하는 함수
  const addDaysToDate = (dateStr, days) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 반환
  };

  // 현재 날짜와 기한 날짜 사이의 일수 차이를 계산하는 함수
  const calculateDday = (dateStr) => {
    const today = new Date();
    const deadline = new Date(dateStr);
    const timeDiff = deadline - today;
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 밀리초를 일수로 변환
    return dayDiff;
  };

  // 리뷰 작성 가능/불가능 항목 분류
  const [reviewWritable, reviewExpired] = memberProductList.reduce(
    (acc, memberProduct) => {
      const deadline = addDaysToDate(memberProduct.thDate, 14);
      const dDay = calculateDday(deadline);
      if (dDay >= 0) {
        acc[0].push({ ...memberProduct, deadline, dDay });
      } else {
        acc[1].push({ ...memberProduct, deadline });
      }
      return acc;
    },
    [[], []]
  );

  const hasReview = (product) => product.review != null;

  const navigate = useNavigate();
  const gotoreviewList = () => {
    navigate('/writedreview');
  };
  // 구매후기 작성 버튼 클릭 핸들러
  const handleReviewButtonClick = (index) => {
    setShowReviewForm((prev) => ({
      ...prev,
      [index]: !prev[index], // 클릭할 때마다 폼 보이기/숨기기 토글
    }));
  };

  return (
    <div className={styles.MypageProductSalesListHeader}>
      <Header />
      <div className={styles.MypageProductSalesListComponent}>
        <MypageSideBar />
        <div className={styles.MypageProductListMainContainer}>
          <h3 className={styles.MypageProductTitle}>최근구매내역 ({reviewWritable.length})</h3>
          {reviewWritable.map((memberProduct, index) => (
            <div key={index}>
              <div className={styles.MypageProductSalesList}>
                <Link to={`/productPage/${memberProduct.productNo}`}>
                  <img className={styles.ProductSalesimg} src={memberProduct.productImagePath} alt="Product" /> </Link>
                <div className={styles.ProductSalestext}>
                  <p className={styles.ProductSalesthDate}>구매확정일 : {memberProduct.thDate}</p>
                  <p className={styles.productTitle}>{memberProduct.productTitle}</p>
                  <p className={styles.productPrice}>￦{formatPrice(memberProduct.productPrice)}</p>
                </div>
                <div>
                  {hasReview(memberProduct) ? (
                    <button className={styles.productOver} onClick={gotoreviewList}>작성한 후기 보기</button>
                  ) : (
                    <>
                      <button
                        className={styles.reviewWriteButton}
                        onClick={() => handleReviewButtonClick(index)}
                      >
                        구매후기 작성하기
                      </button>
                      <p className={styles.reviewWriteText}>작성기한 : {memberProduct.deadline} ({`D-${memberProduct.dDay}`})</p>
                    </>
                  )}
                </div>

              </div>
              {showReviewForm[index] && <MypagReviewWrite
                productNo={memberProduct.productNo}
                buyerId={buyerId}
                sellerId={memberProduct.memberId}
              />}
            </div>
          ))}
          <div className={styles.ProductBuyItems}>
            <h3 className={styles.MypageProductTitle}>구매내역({reviewExpired.length})</h3>
            {reviewExpired.map((memberProduct, index) => (
              <div key={index} className={styles.MypageProductSalesList}>
                <Link to={`/productPage/${memberProduct.productNo}`}>
                  <img className={styles.ProductSalesimg} src={memberProduct.productImagePath} alt="Product" /> </Link>
                <div className={styles.ProductSalestext}>
                  <p className={styles.ProductSalesthDate}>구매확정일 : {memberProduct.thDate}</p>
                  <p className={styles.productTitle}>{memberProduct.productTitle}</p>
                  <p className={styles.productPrice}>￦{formatPrice(memberProduct.productPrice)}</p>
                </div>
                <div>
                  {hasReview(memberProduct) ? (
                    <button className={styles.productOver}>리뷰 등록 완료</button>
                  ) : (
                    <>
                      <button className={styles.productOver}>기한 만료</button>
                      <p className={styles.productText}>작성기한 : {memberProduct.deadline} (기한 초과)</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MypageProductPurchaseHistory;