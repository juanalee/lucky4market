import React, { useState, useEffect } from 'react';
import MyPageSideBar from './MypageSideBar';
import axios from 'axios';
import Header from '../header/Header';
import styles from './css/MypageProductSalesList.module.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MyPageMemberId from './MypageMemberId';
import ProductinsertPopup from '../modalPopup/ModalPopup';

const MypageProductSalesList = () => {
  const [memberProductList, setMemberProductList] = useState([]);
  const [memberProductsoldoutList, setMemberProductsoldoutList] = useState([]);
  const [displayType, setDisplayType] = useState('saling');
  const [popup, setPopup] = useState({
    show: false,
    message: '',
    isConfirmation: false,
  });
  const [productToDelete, setProductToDelete] = useState(null); // 상태 추가
  const navigate = useNavigate();
  const memberId = MyPageMemberId();
  const { productNo } = useParams();

  const readData = async (memberId) => {
    try {
      const response = await axios.get(`http://localhost:9999/member/productSaleslist/${memberId}`);
      setMemberProductList(response.data);
    } catch (error) {
      console.error('Error fetching member product list:', error);
    }
  };

  const readSoldOutData = async (memberId) => {
    try {
      const response = await axios.get(`http://localhost:9999/member/productsoldoutlist/list/${memberId}`);
      setMemberProductsoldoutList(response.data);
    } catch (error) {
      console.error('Error fetching sold out list:', error);
    }
  };

  const productDelete = async () => {
    if (!productToDelete) return;
    try {
      await axios.put(`http://localhost:9999/product/delete/${productToDelete}`);
      // 상태 업데이트
      if (displayType === 'saling') {
        setMemberProductList(prevList => prevList.filter(product => product.productNo !== productToDelete));
      } else if (displayType === 'soldout') {
        setMemberProductsoldoutList(prevList => prevList.filter(product => product.productNo !== productToDelete));
      }
      setPopup({
        show: true,
        message: '삭제가 완료됐습니다.',
        isConfirmation: false,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handlePopupConfirm = () => {
    productDelete();
    handlePopupClose();
  };

  const handlePopupClose = () => {
    setPopup({ ...popup, show: false });
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
      <Header />
      <div className={styles.MypageProductSalesListComponent}>
        <MyPageSideBar />
        <div className={styles.MypageProductListMainContainer}>
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
                <Link to={`/productPage/${memberProduct.productNo}`}>
                  <img className={styles.ProductSalesimg} src={memberProduct.productImagePath} alt="Product" />
                </Link>
                <div className={styles.ProductSalestext}>
                  <p className={styles.productTitle}>{memberProduct.productTitle}</p>
                  <p>조회수 {memberProduct.productCount}</p>
                  <p className={styles.productPrice}>￦{formatPrice(memberProduct.productPrice)}</p>
                </div>
                <Link to={`/productRegisterUpdate/${memberProduct.productNo}`} className={styles.productUpdateButton}>수정</Link>
                <button
                  onClick={() => {
                    setProductToDelete(memberProduct.productNo);
                    setPopup({
                      show: true,
                      message: '정말로 삭제하시겠습니까?',
                      isConfirmation: true,
                    });
                  }}
                  className={styles.productDeleteButton}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
          {displayType === 'soldout' && memberProductsoldoutList.map((memberProduct, index) => (
            <div key={index} className={styles.MypageProductSalesList}>
              <Link to={`/productPage/${memberProduct.productNo}`}>
                <img className={styles.ProductSalesimg} src={memberProduct.productImagePath} alt="Product" />
              </Link>
              <div className={styles.ProductSalestext}>
                <p className={styles.ProductSalesthDate}>구매확정일: {memberProduct.thDate}</p>
                <p className={styles.productTitle}>{memberProduct.productTitle}</p>
                <p className={styles.productPrice}>￦{formatPrice(memberProduct.productPrice)}</p>
              </div>
              <button
                onClick={() => {
                  setProductToDelete(memberProduct.productNo);
                  setPopup({
                    show: true,
                    message: '정말로 삭제하시겠습니까?',
                    isConfirmation: true,
                  });
                }}
                className={styles.productDeleteButton}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>
      <ProductinsertPopup
        show={popup.show}
        onClose={handlePopupClose}
        onConfirm={handlePopupConfirm}
        message={popup.message}
        isConfirmation={popup.isConfirmation}
      />
    </div>
  );
};

export default MypageProductSalesList;
