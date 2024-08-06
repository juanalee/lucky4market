import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../header/Header";
import styles from "./css/SellerPageSellerStore.module.css";

export default function SellerPageSellerStore() {
  const [sellerProfile, setSellerProfile] = useState([]);
  const [sellerProduct, setSellerProduct] = useState([]);

  const defaultProfileImage = "/img/sellerPage/default_profile_image.png";

  const sellerId = "member10";

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  useEffect(() => {
    if (sellerId) {
      const sellerStoreData = async () => {
        try {
          const profileResponse = await axios.get(`http://localhost:9999/api/member/sellerPageProfile/${sellerId}`);
          setSellerProfile(profileResponse.data);

          const productResponse = await axios.get(`http://localhost:9999/api/product/sellerPageProduct/${sellerId}`);
          setSellerProduct(productResponse.data);
        } catch (error) {
          console.error("데이터를 가져오는 중 오류 발생:", error);
        }
      };
      sellerStoreData();
    };
  }, [sellerId]);

  return (
    <div className={styles.seller_store_header_container}>
      <Header/>
      <div className={styles.seller_store_side_container}>
        <div className={styles.seller_store_main_container}>
          {sellerProfile.map((data, idx) => (
            <div className={styles.seller_store_profile_container} key={idx}>
              <img
                className={styles.seller_store_profile_image}
              src={data.sellerProfilePath ? data.sellerProfilePath : defaultProfileImage}
                alt="프로필 이미지"
              />
              <div className={styles.seller_store_profile_info}>
                <span>{data.sellerNick || data.sellerId}</span>
                <span>님의 상점 | 평점:</span>
                <span className={styles.seller_store_avg_score}>★</span>
                {data.sellerScore}
              </div>
            </div>
          ))}
          <div className={styles.seller_store_nav_container}>
            <ul className={styles.seller_store_nav_ul}>
              <li className={styles.seller_store_nav_li}>
                <Link to="/sellerStore" className={styles.seller_store_nav_item}>상점</Link>
              </li>
               <li className={styles.seller_store_nav_li}>
                <Link to="/sellerReceivedReview" className={styles.seller_store_nav_item}>후기</Link>
              </li>
              <li className={styles.seller_store_nav_li}>
                <Link to="/sellerFollowList" className={styles.seller_store_nav_item}>팔로우</Link>
              </li>
            </ul>
          </div>
          <div className={styles.seller_store_product_container}>
            {sellerProduct.length > 0 ? (
              sellerProduct.map((data, idx) => (
                <div className={styles.seller_store_product_list} key={idx}>
                  <img
                    className={styles.seller_store_product_image}
                    src={data.productImagePath}
                    alt="상품 이미지"
                  />
                  <div className={styles.seller_store_product_title}>
                    {data.productTitle}
                  </div>
                  <div className={styles.seller_store_product_price}>
                    {formatPrice(data.productPrice)}원
                  </div>
                  <div className={styles.seller_store_product_detail}>
                    관심 {data.interestCount} | 채팅 {data.chatCount}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.seller_store_nothing}>등록한 상품이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};