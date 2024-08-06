import React, { useState, useEffect } from 'react';
import MyPageSideBar from './MypageSideBar';
import Header from './../header/Header';
import axios from 'axios';
import styles from './css/MypageReviewList.module.css';
import MyPageMemberId from './MypageMemberId'; // 커스텀 훅을 import
import { Link, useNavigate } from 'react-router-dom';
import ProductinsertPopup from '../modalPopup/ModalPopup';

const MypageReviewList = () => {
  const [memberProductList, setMemberProductList] = useState([]);
  const [reviewList, setReviewList] = useState({});
  const [editReviewState, setEditReviewState] = useState({});
  const [tempReviewData, setTempReviewData] = useState({});
  const [popup, setPopup] = useState({
    show: false,
    message: '',
    isConfirmation: false,
  });
  const memberId = MyPageMemberId();
  const navigate = useNavigate();

  const readData = async (memberId) => {
    try {
      const response = await axios.get(`http://localhost:9999/review/productWroteList/${memberId}`);
      console.log(response.data);
      setMemberProductList(response.data);
    } catch (error) {
      console.error('Error fetching member product list:', error);
    }
  };

  const readReviewData = async (productNo) => {
    try {
      const response = await axios.get(`http://localhost:9999/review/wroteList/${productNo}`);
      console.log(response.data);
      setReviewList(prevState => ({ ...prevState, [productNo]: response.data }));
    } catch (error) {
      console.error('Error fetching review list:', error);
    }
  };

  const reviewDelete = async (productNo) => {
    try {
      await axios.delete(`http://localhost:9999/review/delete/${productNo}`);
      setReviewList(prevState => ({
        ...prevState,
        [productNo]: []
      }));
      setPopup({
        show: true,
        message: '삭제가 완료됐습니다.',
        isConfirmation: false,
      });
    } catch (error) {
      console.error('Error deleting reviews:', error);
    }
  };

  const reviewUpdate = (productNo, review) => {
    setEditReviewState(prevState => ({
      ...prevState,
      [productNo]: !prevState[productNo]
    }));
    if (!editReviewState[productNo]) {
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
      setEditReviewState(prevState => ({
        ...prevState,
        [productNo]: false
      }));
      setReviewList(prevState => ({
        ...prevState,
        [productNo]: prevState[productNo].map(review =>
          review.reviewId === reviewId ? { ...review, ...updatedReview } : review
        )
      }));
      setPopup({
        show: true,
        message: '수정이 완료됐습니다.',
        isConfirmation: false,
      });
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

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

  const handlePopupClose = () => {
    setPopup({ ...popup, show: false });
    // Navigate and refresh
    navigate('/writedReview', { replace: true }); // Navigate to the desired page
    window.location.reload(); // Refresh the page
  };

  return (
    <div>
      <Header />
      <div className={styles.MypageProductSalesListComponent}>
        <MyPageSideBar />
        <div className={styles.MypageProductListMainContainer}>
          <h3 className={styles.ProductMainTitle}>내가 작성한 후기목록 ({memberProductList.length})</h3>
          {memberProductList.map((memberProduct, index) => (
            <div key={index}>
              <div className={styles.MypageProductSalesList}>
                <Link to={`/productPage/${memberProduct.productNo}`}>
                  <img className={styles.ProductSalesimg} src={memberProduct.productImagePath} alt="Product" />
                </Link>
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
      <ProductinsertPopup
        show={popup.show}
        onClose={handlePopupClose}
        message={popup.message}
        isConfirmation={popup.isConfirmation}
      />
    </div>
  );
};

export default MypageReviewList;
