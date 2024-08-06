import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../header/Header";
import MyPageMemberId from "./MypageMemberId";
import MyPageSideBar from "./MypageSideBar";
import styles from "./css/MyPageMyStore.module.css";

export default function MyPageMyStore() {
  const [myProfile, setMyProfile] = useState([]);
  const [myProduct, setMyProduct] = useState([]);

  const memberId = MyPageMemberId();

  const defaultProfileImage = "/img/myPage/default_profile_image.png";

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  useEffect(() => {
    if (memberId) {
      const myStoreData = async () => {
        try {
          const profileResponse = await axios.get(`https://lucky4market.me/api/member/myPageProfile/${memberId}`);
          setMyProfile(profileResponse.data);

          const productResponse = await axios.get(`https://lucky4market.me/api/product/myPageProduct/${memberId}`);
          setMyProduct(productResponse.data);
        } catch (error) {
          console.error("데이터를 가져오는 중 오류 발생:", error);
        }
      };
      myStoreData();
    };
  }, [memberId]);

  return (
    <div className={styles.my_store_header_container}>
      <Header />
      <div className={styles.my_store_side_container}>
        <MyPageSideBar />
        <div className={styles.my_store_main_container}>
          {myProfile.map((data, idx) => (
            <div className={styles.my_store_profile_container} key={idx}>
             
              <img
                className={styles.my_store_profile_image}
                src={data.memberProfilePath ? data.memberProfilePath : defaultProfileImage}
                alt="프로필 이미지"
              />
          
              <div className={styles.my_store_profile_info}>
                <span>{data.memberNick || data.memberId}</span>
                <span>님의 상점 | 평점:</span>
                <span className={styles.my_store_avg_score}>★</span>
                {data.memberScore}
              </div>
            </div>
          ))}
          <div className={styles.my_store_nav_container}>
            <ul className={styles.my_store_nav_ul}>
              <li className={styles.my_store_nav_li}>
                <Link to="/myStore" className={styles.my_store_nav_item}>상점</Link>
              </li>
              <li className={styles.my_store_nav_li}>
                <Link to="/receivedReview" className={styles.my_store_nav_item}>후기</Link>
              </li>
              <li className={styles.my_store_nav_li}>
                <Link to="/followList" className={styles.my_store_nav_item}>팔로우</Link>
              </li>
            </ul>
          </div>
          <div className={styles.my_store_product_container}>
            {myProduct.length > 0 ? (
              myProduct.map((data, idx) => (
                <div className={styles.my_store_product_list} key={idx}>
                  <Link to={`/productPage/${data.productNo}`}>
                  <img
                    className={styles.my_store_product_image}
                    src={data.productImagePath}
                    alt="상품 이미지"
                  /></Link>
                  <div className={styles.my_store_product_title}>
                    {data.productTitle}
                  </div>
                  <div className={styles.my_store_product_price}>
                    {formatPrice(data.productPrice)}원
                  </div>
                  <div className={styles.my_store_product_detail}>
                    관심 {data.interestCount} | 채팅 {data.chatCount}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.my_store_nothing}>등록한 상품이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};