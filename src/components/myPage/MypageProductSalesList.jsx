import React, { useState, useEffect } from 'react';
import MyPageSideBar from './MyPageSideBar';
import axios from 'axios';
import styles from './css/MyPageProductSalesList.module.css';
import MyPageProductSoldoutList from './MyPageProductSoldoutList';


const MyPageProductSalesList = () => {
  const [memberProductList, setMemberProductList] = useState([]);

  const memberId = 'member5';

  const readData = async () => {
    try {
      const response = await axios.get(`http://localhost:9999/member/product/list/${memberId}`);
      console.log(response.data); // 응답 데이터 구조 확인
      setMemberProductList(response.data);
    } catch (error) {
      console.error('Error fetching member list:', error);
    }
  };

  useEffect(() => {
    readData();
  }, []);

  // 숫자를 천 단위로 구분하여 포맷팅하는 함수
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price); // 한국 원화 형식
  };



  return (
    <div>
      <div className={styles.MyPageProductSalesListComponent}>
        <MyPageSideBar/>
        <div>
          <h3>판매중 ({memberProductList.length})</h3>
          {memberProductList.map((memberProduct, index) => (
            <div key={index}>
              <div className={styles.MyPageProductSalesList}>
                <img className={styles.ProductSalesimg} src={memberProduct.productImagePath} alt="Product"/>
                <div className={styles.ProductSalestext}>
                  <p className={styles.productTitle}>{memberProduct.productTitle}</p>
                  <p className={styles.productPrice}>￦{formatPrice(memberProduct.productPrice)}</p>
                </div>

              </div>

            </div>
          ))}
          <MyPageProductSoldoutList/>
        </div>
      </div>
    </div>
  );
};

export default MyPageProductSalesList;
