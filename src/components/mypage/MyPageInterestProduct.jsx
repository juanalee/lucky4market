import { useEffect, useState } from "react";
import Header from "../header/Header";
import MyPageMemberId from "./MyPageMemberId";
import MyPageSideBar from "./MyPageSideBar";
import styles from "./css/MyPageInterestProduct.module.css";
import axios from "axios";

export default function MyPageInterestProduct() {
  const [interest, setInterest] = useState([]);

  const memberId = MyPageMemberId();

  const defaultProfileImage = "/img/mypage/profile.png";

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  useEffect(() => {
    const interestData = async () => {
      try {
        const interestResponse = await axios.get(`http://localhost:9999/api/product/myPageInterest/${memberId}`);
        setInterest(interestResponse.data);
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생: ", error);
      }
    };

    interestData();
  }, [memberId]);

  return (
    <div className={styles.interest_product_header_container}>
      <Header/>
      <div className={styles.interest_product_side_container}>
        <MyPageSideBar/>
        <div className={styles.interest_product_main_container}>
          <div className={styles.interest_product}>관심 상품</div>
          <div className={styles.interest_product_container}>
            {interest.length > 0 ? (
              interest.map((product, index) => (
                <div key={index} className={styles.interest_product_list}>
                  <img
                    className={styles.interest_product_image}
                    src={product.productImagePath}
                    alt="상품 이미지"
                  />
                  <div className={styles.interest_product_title}>
                    <h3>{product.productTitle}</h3>
                  </div>
                  <div className={styles.interest_product_price}>
                    {formatPrice(product.productPrice)}원
                  </div>
                  <div className={styles.interest_product_detail}>
                    관심 {product.interestCount} | 채팅 {product.chatCount}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.interest_product_no_interest}>관심을 가진 상품이 없습니다.</div>
            )}
          </div>
        </div>
        <div className={styles.interest_product_banner}>배너</div>
      </div>
    </div>
  );
};