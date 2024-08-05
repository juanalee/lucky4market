import React, { useState, useEffect } from 'react';
import MyPageSideBar from './MyPageSideBar';
import axios from 'axios';
import styles from './css/MyPageProductSalesList.module.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MyPageMemberId from './MyPageMemberId';

const MypageProductSalesList = () => {
  const [memberProductList, setMemberProductList] = useState([]);
  const [memberProductsoldoutList, setMemberProductsoldoutList] = useState([]);
  const [displayType, setDisplayType] = useState('saling');
  const navigate = useNavigate();
  const memberId = MyPageMemberId();
  const { productNo } = useParams();

  const readData = async (memberId) => {
    try {
      const response = await axios.get(`http://localhost:9999/member/productSaleslist/${memberId}`);
      console.log('Products:', response.data);
      setMemberProductList(response.data);
    } catch (error) {
      console.error('Error fetching member product list:', error);
    }
  };

  const readSoldOutData = async (memberId) => {
    try {
      const response = await axios.get(`http://localhost:9999/member/productsoldoutlist/list/${memberId}`);
      console.log(response.data);
      setMemberProductsoldoutList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const productDelete = async (productNo) => {
    try {
      await axios.delete(`http://localhost:9999/product/delete/${productNo}`);
      alert("삭제가 완료됐습니다.");
      window.location.reload();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  useEffect(() => {
    if (memberId) {
      readData(memberId);
      readSoldOutData(memberId);
    }
  }, [memberId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <div>
      <div className={styles.MypageProductSalesListComponent}>
        <MyPageSideBar />
        <div className={styles.MyPageProductSaleMainContainer}>
          <div className={styles.ProductButtonContainer}>
            <button
              className={`${styles.ProductSale} ${displayType === 'saling' ? styles.active : ''}`}
              onClick={() => setDisplayType('saling')}
            >
              판매중 ({memberProductList.length})
            </button>
            <button
              className={`${styles.ProductSoldOut} ${displayType === 'soldout' ? styles.active : ''}`}
              onClick={() => setDisplayType('soldout')}
            >
              판매완료 ({memberProductsoldoutList.length})
            </button>
          </div>
          <div className={styles.MyPageProducutMainSalesList}>
            {displayType === 'saling' && memberProductList.map((memberProduct, index) => (
              <div key={index} className={styles.MypageProductSalesList}>
                <img className={styles.ProductSalesimg} src={memberProduct.productImagePath} alt="Product" />
                <div className={styles.ProductSalestext}>
                  <p className={styles.productTitle}>{memberProduct.productTitle}</p>
                  <p>조회수 {memberProduct.productCount}</p>
                  <p className={styles.productPrice}>￦{formatPrice(memberProduct.productPrice)}</p>
                </div>
                <Link to={`/productRegisterUpdate/${memberProduct.productNo}`} className={styles.productUpdateButton}>수정</Link>
                <button onClick={() => productDelete(memberProduct.productNo)} className={styles.productDeleteButton}>삭제</button>
              </div>
            ))}
          </div>
          {displayType === 'soldout' && memberProductsoldoutList.map((memberProduct, index) => (
            <div key={index} className={styles.MypageProductSalesList}>
              <img className={styles.ProductSalesimg} src={memberProduct.productImagePath} alt="Product" />
              <div className={styles.ProductSalestext}>
                <p className={styles.ProductSalesthDate}>구매확정일: {memberProduct.thDate}</p>
                <p className={styles.productTitle}>{memberProduct.productTitle}</p>
                <p className={styles.productPrice}>￦{formatPrice(memberProduct.productPrice)}</p>
              </div>
              <button onClick={() => productDelete(memberProduct.productNo)} className={styles.productDeleteButton}>삭제</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MypageProductSalesList;
