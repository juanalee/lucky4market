import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../header/Header";
import MyPageMemberId from "./MypageMemberId";
import MyPageSideBar from "./MypageSideBar";
import MyPageStarScore from "./MyPageStarScore";
import styles from "./css/MyPageReceivedReview.module.css";

export default function MyPageReceivedReview() {
  const [myProfile, setMyProfile] = useState([]);
  const [myReceivedReview, setMyReceivedReview] = useState([]);

  const memberId = MyPageMemberId();

  const defaultProfileImage = "/img/myPage/default_profile_image.png";

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  useEffect(() => {
    if (memberId) {
      const receivedReviewData = async () => {
        try {
          const profileResponse = await axios.get(`https://lucky4market.me/api/member/myPageProfile/${memberId}`);
          setMyProfile(profileResponse.data);

          const receivedReviewResponse = await axios.get(`https://lucky4market.me/api/member/myPageReceivedReview/${memberId}`);
          setMyReceivedReview(receivedReviewResponse.data);
          console.log(receivedReviewResponse.data);
        } catch (error) {
          console.error("데이터를 가져오는 중 오류 발생:", error);
        }
      };
      receivedReviewData();
    }
  }, [memberId]);

  return (
    <div className={styles.received_review_header_container}>
      <Header />
      <div className={styles.received_review_side_container}>
        <MyPageSideBar />
        <div className={styles.received_review_main_container}>
          {myProfile.map((data, idx) => (
            <div className={styles.received_review_profile_container} key={idx}>
              <img
                className={styles.received_review_profile_image}
                src={data.memberProfilePath ? data.memberProfilePath : defaultProfileImage}
                alt="프로필 이미지"
              />
              <div className={styles.received_review_profile_info}>
                <span>{data.memberNick || data.memberId}</span>
                <span>님의 받은 후기 | 평점:</span>
                <span className={styles.received_review_avg_score}>★</span>
                {data.memberScore}
              </div>
            </div>
          ))}
          <div className={styles.received_review_nav_container}>
            <ul className={styles.received_review_nav_ul}>
              <li className={styles.received_review_nav_li}>
                <Link to="/myStore" className={styles.received_review_nav_item}>상점</Link>
              </li>
              <li className={styles.received_review_nav_li}>
                <Link to="/receivedReview" className={styles.received_review_nav_item}>후기</Link>
              </li>
              <li className={styles.received_review_nav_li}>
                <Link to="/followList" className={styles.received_review_nav_item}>팔로우</Link>
              </li>
            </ul>
          </div>
          <div className={styles.received_review_container}>
            {myReceivedReview.length > 0 ? (
              myReceivedReview.map((data, idx) => (
                <div className={styles.received_review_container2} key={idx}>
                  <img
                    className={styles.received_review_product_image}
                    src={data.productImagePath}
                    alt="상품 이미지"
                  />
                  <div className={styles.received_review_container3}>
                    <div className={styles.received_review_product_title}>
                      {data.productTitle}
                    </div>
                    <div className={styles.received_review_product_price}>
                      {formatPrice(data.productPrice)}원
                    </div>
                    <div className={styles.received_review_buyer}>
                      {data.buyerNick || data.buyerId}, {data.reviewDate}
                    </div>
                    <div className={styles.received_review_score}>
                      <MyPageStarScore score={data.reviewScore} />
                    </div>
                    <div className={styles.received_review_content}>
                      {data.review}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.received_review_nothing}>받은 후기가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};