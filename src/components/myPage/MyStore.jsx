import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Header from "../header/Header";
import MypageSideBar from "./MypageSideBar";
import styles from "./css/MyStore.module.css";

export default function MyStore() {
  const [profile, setProfile] = useState({});
  const [product, setProduct] = useState([]);
  const memberId = 'member4';
  const productNo = 1;

  useEffect(() => {
    fetchProfile();
    fetchProduct();
  }, []);

  const fetchProfile = () => {
    fetch(`http://localhost:9999/myPageProfile/${memberId}`)
      .then((response) => response.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error("Error fetching profile: ", error));
  };

  const fetchProduct = () => {
    fetch(`http://localhost:9999/myPageProduct/${productNo}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error("Error fetching product: ", error));
  };

  return (
    <div className={styles.my_store_header_container}>
      <Header />
      <div className={styles.my_store_side_container}>
        <MypageSideBar />
        <div className={styles.my_store_main_container}>
          <div className={styles.my_store_profile}>
            <img className={styles.my_store_profile_image} src={profile.memberProfilePath} alt="profileImage" />
            {profile.memberNick} | 평점:
            <span className={styles.my_store_score}>★</span>
            {profile.memberScore}
          </div>
          <div className={styles.my_store_nav_container}>
            <ul className={styles.my_store_nav_ul}>
              <li className={styles.my_store_nav_li}>
                <Link to="/myStore" className={styles.my_store_nav_item}>상품</Link>
              </li>
              <li className={styles.my_store_nav_li}>
                <Link to="/receivedReview" className={styles.my_store_nav_item}>후기</Link>
              </li>
              <li className={styles.my_store_nav_li}>
                <Link to="/followList" className={styles.my_store_nav_item}>팔로우</Link>
              </li>
            </ul>
          </div>
          <div className={styles.my_store_product}>
            <img className={styles.my_store_product_image} src={product.productImagePath} alt="productIamge" />
            <div className={styles.my_store_product_title}>
              <h4>{product.productTitle}</h4>
            </div>
            <div className={styles.my_store_product_price}>
              {product.productPrice}원
            </div>
            <div className={styles.my_store_product_detail}>
              관심{product.interestCount}
              <div className={styles.my_store_vertical_bar}>|</div>
              채팅{product.chatCount}
            </div>
          </div>
        </div>
        <div className={styles.my_store_banner}>배너</div>
      </div>
      <Footer />
    </div>
  );
};