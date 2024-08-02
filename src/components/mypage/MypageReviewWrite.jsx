import React, { useState, useRef } from 'react';
import axios from 'axios';
import styles from './css/MyPageReviewWrite.module.css';

const MypagReviewWrite = ({ productNo, buyerId, sellerId }) => {
  const [reviewScore, setreviewScore] = useState(0);
  const [hover, setHover] = useState(0);
  const reviewText = useRef();

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
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log(response);
      alert(response.data.msg);
      if (response.data.result) {
        reviewText.current.value = ''; // Clear the input
        setreviewScore(0);
        setHover(0); // Reset hover
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('리뷰 제출에 실패했습니다. 다시 시도해주세요.');
    }
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
              onClick={() => setreviewScore(index)}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(reviewScore)}
            >
              <span className={styles.star}>&#9733;</span>
            </button>
          );
        })}
      </div>
      <textarea type="text" ref={reviewText} placeholder="후기를 입력하세요" className={styles.reviewText} />
      <button onClick={submitReview} className={styles.submitButton}>리뷰 제출</button>
    </div>
  );
};

export default MypagReviewWrite;
