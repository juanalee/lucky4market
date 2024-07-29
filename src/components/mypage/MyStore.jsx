import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../../css/headerCss/header.module.css";

export default function MyPageMyStore() {
  const [profileData, setProfileData] = useState([]);
  const [productData, setProductData] = useState([]);
  const memberId = 'member22';  // Ensure this function is correct

  const defaultProfileImage = "/img/mypage/profile.png";

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  useEffect(() => {
    const myStoreData = async () => {
      try {
   
        // // Fetch profile data
        // const profileResponse = await axios.get(`http://localhost:9999/api/member/myPageProfile/${memberId}`);
        // console.log("Profile Data:", profileResponse.data);
        // setProfileData(profileResponse.data);

        const productResponse = await axios.get(`http://localhost:9999/myPageProduct/${memberId}`);
        console.log("Product Data:", productResponse.data);
        setProductData(productResponse.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    myStoreData();
  }, []);

  return (
    <div className={styles.my_store_header_container}>
      {/* <Header/> */}
      <div className={styles.my_store_side_container}>
        {/* <MyPageSideBar /> */}
        <div className={styles.my_store_main_container}>
          {profileData.length > 0 ? (
            profileData.map((profile, index) => (
              <div className={styles.my_store_profile_container} key={index}>
                <img
                  className={styles.my_store_profile_image}
                  src={profile.memberProfilePath ? profile.memberProfilePath : defaultProfileImage}
                  alt="Profile"
                />
                <div className={styles.my_store_profile_info}>
                  {profile.memberNick ? (
                    <>
                      {profile.memberNick}
                      <span>| 평점:</span>
                      <span className={styles.my_store_score}>★</span>
                      {profile.memberScore}
                    </>
                  ) : (
                    <>
                      <span className={styles.my_store_no_nick}>내 정보에서 닉네임을 설정하세요.</span>
                      <span>| 평점:</span>
                      <span className={styles.my_store_score}>★</span>
                      {profile.memberScore}
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.my_store_no_profile}>프로필 데이터가 없습니다.</div>
          )}
          <div className={styles.my_store_nav_container}>
            <ul className={styles.my_store_nav_ul}>
              <li className={styles.my_store_nav_li}>
                <Link to="/my-store" className={styles.my_store_nav_item}>상품</Link>
              </li>
              <li className={styles.my_store_nav_li}>
                <Link to="/received-review" className={styles.my_store_nav_item}>후기</Link>
              </li>
              <li className={styles.my_store_nav_li}>
                <Link to="/follow-list" className={styles.my_store_nav_item}>팔로우</Link>
              </li>
            </ul>
          </div>
          <div className={styles.my_store_product_container}>
            {productData.length > 0 ? (
              productData.map((product, index) => (
                <div key={index} className={styles.my_store_product_list}>
                  <img
                    className={styles.my_store_product_image}
                    src={product.productImagePath}
                    alt="Product"
                  />
                  <div className={styles.my_store_product_title}>
                    <h3>{product.productTitle}</h3>
                  </div>
                  <div className={styles.my_store_product_price}>
                    {formatPrice(product.productPrice)}원
                  </div>
                  <div className={styles.my_store_product_detail}>
                    관심 {product.interestCount} | 채팅 {product.chatCount}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.my_store_no_product}>등록한 상품이 없습니다.</div>
            )}
          </div>
        </div>
        <div className={styles.my_store_banner}>배너</div>
      </div>
    </div>
  );
}
