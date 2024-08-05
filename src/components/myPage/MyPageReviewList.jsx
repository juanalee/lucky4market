import React, { useState, useEffect } from 'react';
import MyPageSideBar from './MypageSideBar';
import axios from 'axios';
import styles from './css/MypageReviewList.module.css';
import MyPageMemberId from './MypageMemberId'; // 커스텀 훅을 import

const MyPageReviewList = () => {
  const [memberProductList, setMemberProductList] = useState([]);
  const [reviewList, setReviewList] = useState({}); // 리뷰 목록을 객체로 변경
  const [editReviewState, setEditReviewState] = useState({}); // 수정 상태를 객체로 변경
  const [tempReviewData, setTempReviewData] = useState({});

  const memberId = MyPageMemberId(); // 커스텀 훅을 사용

  const readData = async (memberId) => {
    try {
      const response = await axios.get(`http://localhost:9999/review/productWroteList/${memberId}`);
      console.log(response.data); // 응답 데이터 구조 확인
      setMemberProductList(response.data);
    } catch (error) {
      console.error('Error fetching member product list:', error);
    }
  };

  const readReviewData = async (productNo) => {
    try {
      const response = await axios.get(`http://localhost:9999/review/wroteList/${productNo}`);
      console.log(response.data); // 응답 데이터 구조 확인
      setReviewList(prevState => ({ ...prevState, [productNo]: response.data })); // 리뷰 데이터를 객체에 저장
    } catch (error) {
      console.error('Error fetching review list:', error);
    }
  };

  const reviewDelete = async (productNo) => {
    try {
      await axios.delete(`http://localhost:9999/review/delete/${productNo}`);
      // 리뷰 삭제 후 상태에서 해당 리뷰 제거
      setReviewList(prevState => ({
        ...prevState,
        [productNo]: []
      }));
      alert("삭제가 완료됐습니다."); // alert 창으로 메시지 표시
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error('Error deleting reviews:', error);
    }
  };

  const reviewUpdate = (productNo, review) => {
    setEditReviewState(prevState => ({
      ...prevState,
      [productNo]: !prevState[productNo] // 해당 productNo의 수정 상태를 토글
    }));
    if (!editReviewState[productNo]) {
      // 수정 상태로 변경 시 임시 리뷰 데이터 설정
      setTempReviewData(prevState => ({
        ...prevState,
        [productNo]: { ...review }
      }));
    }
  };

  const handleReviewChange = (productNo, updatedReview) => {
    setTempReviewData(prevState => ({
      ...prevState,
      [productNo]: { ...prevState[productNo], review: updatedReview }
    }));
  };

  const handleScoreChange = (productNo, updatedScore) => {
    setTempReviewData(prevState => ({
      ...prevState,
      [productNo]: { ...prevState[productNo], reviewScore: updatedScore }
    }));
  };


  const saveReview = async (productNo, reviewId) => {
    const updatedReview = tempReviewData[productNo];
    console.log(updatedReview);
    try {
      await axios.put(`http://localhost:9999/review/update/${productNo}`, updatedReview);
      // 저장 후 수정 상태를 false로 변경
      setEditReviewState(prevState => ({
        ...prevState,
        [productNo]: false
      }));
      // 실제 리뷰 데이터 업데이트
      setReviewList(prevState => ({
        ...prevState,
        [productNo]: prevState[productNo].map(review =>
          review.reviewId === reviewId ? { ...review, ...updatedReview } : review
        )
      }));
      alert("수정이 완료됐습니다."); // alert 창으로 메시지 표시
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };


  useEffect(() => {
    if (memberId) {
      readData(memberId);
    }
  }, [memberId]);

  useEffect(() => {
    memberProductList.forEach(product => {
      readReviewData(product.productNo);
    });
  }, [memberProductList]);

  // 숫자를 천 단위로 구분하여 포맷팅하는 함수
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price); // 한국 원화 형식
  };

  // reviewScore를 별 모양으로 변환하는 함수 (읽기 전용)
  const renderStars = (reviewScore, onClickHandler) => {
    return (
      <div className={styles.reviewScore}>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={index < reviewScore ? styles.on : styles.off}
            onClick={() => onClickHandler(index + 1)}
          >
            &#9733;
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className={styles.MypageProductSalesListComponent}>
        <MyPageSideBar />
        <div className={styles.ProductMainContainer}>
          <h3 className={styles.ProductMainTitle}>내가 작성한 후기목록 ({memberProductList.length})</h3>
          {memberProductList.map((memberProduct, index) => (
            <div key={index}>
              <div className={styles.MypageProductSalesList}>
                <img className={styles.ProductSalesimg} src={memberProduct.productImagePath} alt="Product" />
                <div className={styles.ProductSalestext}>
                  <p className={styles.productTitle}>{memberProduct.productTitle}</p>
                  <p className={styles.ProductSalesthDate}>판매자 : {memberProduct.sellerId}</p>
                  <p className={styles.productPrice}>￦{formatPrice(memberProduct.productPrice)}</p>
                </div>
              </div>
              {reviewList[memberProduct.productNo] && reviewList[memberProduct.productNo].map((memberReview, reviewIndex) => (
                <div key={reviewIndex} className={styles.reviewContainer}>
                  <div className={styles.reviewText}>
                    {editReviewState[memberProduct.productNo] ? (
                      <>
                        {renderStars(tempReviewData[memberProduct.productNo]?.reviewScore || memberReview.reviewScore, (score) => handleScoreChange(memberProduct.productNo, score))}
                        <textarea
                          type="text"
                          value={tempReviewData[memberProduct.productNo]?.review || memberReview.review}
                          onChange={(e) => handleReviewChange(memberProduct.productNo, e.target.value)}
                          className={styles.productReviewText}
                        />
                      </>
                    ) : (
                      <>
                        {renderStars(memberReview.reviewScore, () => { })}
                        <textarea className={styles.reviewTitle}>{memberReview.review}</textarea>
                      </>
                    )}
                  </div>
                  <div className={styles.removeUpdateButton}>
                    <button onClick={() => reviewUpdate(memberProduct.productNo, memberReview)}
                      className={styles.updateDeleteButton}>
                      {editReviewState[memberProduct.productNo] ? '취소' : '수정'}
                    </button>
                    {editReviewState[memberProduct.productNo] && (
                      <button onClick={() => saveReview(memberProduct.productNo, memberReview.reviewId)}
                        className={styles.productReportButton}>저장</button>
                    )}
                    <button onClick={() => reviewDelete(memberProduct.productNo)}
                      className={styles.productDeleteButton}>삭제</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPageReviewList;
