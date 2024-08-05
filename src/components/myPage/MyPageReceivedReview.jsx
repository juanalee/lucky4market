import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../header/Header";
import MyPageMemberId from "./MypageMemberId";
import MyPageSideBar from "./MypageSideBar";
import styles from "./css/MyPageReceivedReview.module.css";

export default function MyPageReceivedReview() {
  const [myReceivedReview, setMyReceivedReview] = useState([]);

  const memberId = MyPageMemberId();
  console.log('Member ID:', memberId);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  useEffect(() => {
    if (memberId) {
      const receivedReviewData = async () => {
        try {
          const receivedReviewResponse = await axios.get(`http://localhost:9999/api/product/myPageReceivedReview/${memberId}`);
          console.log('Received Review Response:', receivedReviewResponse.data);
          setMyReceivedReview(receivedReviewResponse.data);
        } catch (error) {
          console.error("데이터를 가져오는 중 에러 발생:", error);
        }
      };
      receivedReviewData();
    }
  }, [memberId]);

  return (
    <div className={styles.received_review_header_container}>
      {/* <Header/> */}
      <div className={styles.received_review_side_container}>
        <MyPageSideBar />
        <div className={styles.received_review_main_container}>
          <div className={styles.my_received_review}>받은 후기</div>
          <div className={styles.received_review_nav_container}>
            <ul className={styles.received_review_nav_ul}>
              <li className={styles.received_review_nav_li}>
                <Link to="/my-store" className={styles.received_review_nav_item}>상품</Link>
              </li>
              <li className={styles.received_review_nav_li}>
                <Link to="/received-review" className={styles.received_review_nav_item}>후기</Link>
              </li>
              <li className={styles.received_review_nav_li}>
                <Link to="/follow-list" className={styles.received_review_nav_item}>팔로우</Link>
              </li>
            </ul>
          </div>
          <div className={styles.received_review_container}>
            {myReceivedReview.length > 0 ? (
              myReceivedReview.map((data, idx) => (
                <div className={styles.received_review_container} key={idx}>
                  <img
                    className={styles.received_review_product_image}
                    src={data.productImagePath}
                    alt="상품 이미지"
                  />
                  <div className={styles.received_review_product_title}>
                    {data.productTitle} | {formatPrice(data.productPrice)}원
                  </div>
                  <div className={styles.received_review_item}>
                    {data.buyerNick} - {data.reviewDate}
                  </div>
                  <div className={styles.received_review_item}>
                    {data.reviewScore}
                  </div>
                  <div className={styles.received_review_item}>
                    {data.review}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.received_review_}>받은 후기가 없습니다.</div>
            )}
          </div>
        </div>
        <div className={styles.received_review_banner}>배너</div>
      </div>
    </div>
  );
};
