import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../header/Header";
import MyPageMemberId from "./MypageMemberId";
import MyPageSideBar from "./MypageSideBar";
import styles from "./css/MyPageInterestProduct.module.css";
import { Link } from 'react-router-dom';

export default function MyPageInterestProduct() {
  const [interestProduct, setInterestProduct] = useState([]);

  const memberId = MyPageMemberId();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  useEffect(() => {
    if (memberId) {
      const interestProductData = async () => {
        try {
          const interestResponse = await axios.get(`http://localhost:9999/api/product/myPageInterestProduct/${memberId}`);
          setInterestProduct(interestResponse.data);
        } catch (error) {
          console.error("데이터를 가져오는 중 오류 발생:", error);
        }
      };
      interestProductData();
    };
  }, [memberId]);

  return (
    <div className={styles.interest_product_header_container}>
      <Header />
      <div className={styles.interest_product_side_container}>
        <MyPageSideBar />
        <div className={styles.interest_product_main_container}>
          <div className={styles.interest_product}>관심 상품</div>
          <div className={styles.interest_product_container}>
            {interestProduct.length > 0 ? (
              interestProduct.map((data, idx) => (
                <div className={styles.interest_product_list} key={idx} >
                    <Link to={`/productPage/${data.productNo}`}>
                  <img
                    className={styles.interest_product_image}
                    src={data.productImagePath}
                    alt="상품 이미지"
                  /></Link>
                  <div className={styles.interest_product_title}>
                    {data.productTitle}
                  </div>
                  <div className={styles.interest_product_price}>
                    {formatPrice(data.productPrice)}원
                  </div>
                  <div className={styles.interest_product_detail}>
                    관심 {data.interestCount} | 채팅 {data.chatCount}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.interest_product_nothing}>관심을 가진 상품이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};