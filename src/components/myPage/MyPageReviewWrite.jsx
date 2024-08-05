import React, { useState, useRef } from 'react';
import axios from 'axios';
import styles from './css/MyPageReviewWrite.module.css';
import ProductinsertPopup from '../modalPopup/ModalPopup';
import { useNavigate } from 'react-router-dom';

const MypagReviewWrite = ({ productNo, buyerId, sellerId }) => {
  const [reviewScore, setReviewScore] = useState(0);
  const [hover, setHover] = useState(0);
  const [popup, setPopup] = useState({
    show: false,
    message: '',
    isConfirmation: false,
  });
  const reviewText = useRef();
  const navigate = useNavigate();

  const submitReview = async () => {
    const review = new URLSearchParams();
    review.append('productNo', productNo);
    review.append('buyerId', buyerId);
    review.append('sellerId', sellerId);
    review.append('reviewScore', reviewScore);
    review.append('reviewText', reviewText.current.value);

    console.log('Review to submit:', review.toString()); // 리뷰 객체 콘솔에 출력

    try {
      const response = await axios.post('http://localhost:9999/review/insert', review.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data.result) {
        reviewText.current.value = ''; // Clear the input
        setReviewScore(0);
        setHover(0); // Reset hover
        setPopup({
          show: true,
          message: response.data.msg,
          isConfirmation: false,
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('리뷰 제출에 실패했습니다. 다시 시도해주세요.');
      setPopup({
        show: true,
        message: '리뷰 제출에 실패했습니다.',
        isConfirmation: false,
      });
    }
  };

  const handlePopupClose = () => {
    setPopup({ ...popup, show: false });
    // Navigate and refresh
    navigate('/buyHistory', { replace: true }); // Use replace to avoid adding a new entry to history
    window.location.reload(); // Refresh the page
  };

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.reviewScore}>
        {[...Array(5)].map((star, index) => {
          index += 1;
          return (
            <button
              type="button"
              key={index}
              className={index <= (hover || reviewScore) ? styles.on : styles.off}
              onClick={() => setReviewScore(index)}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(reviewScore)}
            >
              <span className={styles.star}>&#9733;</span>
            </button>
          );
        })}
      </div>
      <textarea
        type="text"
        ref={reviewText}
        placeholder="후기를 입력하세요"
        className={styles.reviewText}
      />
      <button onClick={submitReview} className={styles.submitButton}>리뷰 제출</button>
      <ProductinsertPopup
        show={popup.show}
        onClose={handlePopupClose} // Call handlePopupClose to navigate and refresh after closing popup
        message={popup.message}
        isConfirmation={popup.isConfirmation}
      />
    </div>
  );
};

export default MypagReviewWrite;
