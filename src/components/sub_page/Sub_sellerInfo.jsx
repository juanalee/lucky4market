import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../css/sub_pageCss/sub_sellerInfo.module.css';

const StoreInfo = ({ categoryInfo }) => {
  const followBtn = useRef();
  const followImg = useRef();
  const sellerImageCount = useRef([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [storeInfo, setStoreInfo] = useState([{}]);
  const [profileInfo, setProfileInfo] = useState([{}]);
  const [categoryProductInfo, setCategoryProductInfo] = useState([{}]);
  const [sellerProductImage, setSellerProductImage] = useState([]);
  const [categoryProductImg, setCategoryProductImg] = useState([]);

  const followClick = () => {
    setIsFollowing((prevState) => !prevState);

    axios.get('http://localhost:9999/insertFollow?buyerId=member3&sellerId=member2')
      .then(response => {
        console.log(response);
        alert(response.data.msg);
      })
      .catch(error => {
        console.error('Error occurred:', error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeResponse = await axios.get('http://localhost:9999/storeInfo?memberId=member2');
        setStoreInfo(storeResponse.data);

        const sellerProfileResponse = await axios.get('http://localhost:9999/sellerProfile?memberId=member2');
        setProfileInfo(sellerProfileResponse.data);

        const response = await axios.get('http://localhost:9999/sellerProductImage?memberId=member2');
        setSellerProductImage(response.data);

        const followStatusResponse = await axios.get('http://localhost:9999/selectFollowStatus?memberId=member2');
        const userLiked = followStatusResponse.data.includes('member3');
        setIsFollowing(userLiked);

        const categoryProductInfoResponse = await axios.get(`http://localhost:9999/categoryProductInfo?categoryNo=${categoryInfo.categoryNo}`);
        setCategoryProductInfo(categoryProductInfoResponse.data);
        console.log(categoryProductInfoResponse.data);

        const mergedProductNos = categoryProductInfoResponse.data.map(product => product.productNo);

        console.log(mergedProductNos);

        const categoryProductImgResponse = await axios.post(`http://localhost:9999/categoryProductImg`,{
          productNo : mergedProductNos
        });
        setCategoryProductImg(categoryProductImgResponse.data);
        console.log(categoryProductImgResponse.data)
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [categoryInfo.categoryNo]);

  const remainingProducts = storeInfo.length > 0 ? storeInfo[0].saleCount - (2 + sellerImageCount.current.length) : 0;
  const remainingReviews = storeInfo.filter(item => item.review !== null).length;

  return (
    <>
      <div className={styles.product_content_container}>
        <div className={styles.seller_information}>
          <h2>상점 정보</h2>
          <hr />
          <div className={styles.seller}>
            <div className={styles.store_info}>
              <div className={styles.member_id}>
                <Link><img src={profileInfo.length > 0 ? profileInfo : "/img/store_basic.png"} alt="profile" /></Link>
                <Link>{storeInfo.length > 0 && storeInfo[0].sellerId}</Link>
              </div>
              <div className={styles.seller_sub_2}>
                <Link to='#'>상품<p>{storeInfo.length > 0 && storeInfo[0].saleCount}개</p></Link>
                <span className={styles.line}></span>
                <Link>팔로워 <p>{storeInfo.length > 0 && storeInfo[0].followerCount}명</p></Link>
                <span className={styles.line}></span>
                <Link>후기<p>{remainingReviews}개</p></Link>
              </div>
              <div className={styles.followBtn_container}>
                <img src={isFollowing ? "/img/unfollow.png" : "/img/follow.png"} ref={followImg} alt="followImage" />
                <button className={styles.follow} ref={followBtn} onClick={followClick}>
                  {isFollowing ? '팔로잉' : '팔로우'}
                </button>
              </div>
              <div className={styles.seller_product_img}>
                {sellerProductImage.slice(0, 2).map((img, index) => (
                  img.productNo !== 19 && (
                    <div key={index}>
                      <Link to='#'><img src={img.image} alt={`Product ${index}`} ref={(el) => {
                        if (el && !sellerImageCount.current.includes(el)) {
                          sellerImageCount.current.push(el);
                        }
                      }} /></Link>
                      <p>{img.price.toLocaleString()}원</p>
                    </div>
                  )
                ))}
              </div>
              {remainingProducts > 0 && (
                <div className={styles.more}>
                  <Link to="#">
                    <span>{remainingProducts}개</span> 상품 더보기
                  </Link>
                  <hr />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.suggestContainer}>
        <h2>이런 상품은 어때요?</h2>
        <div className={styles.categoryProductContainer}>
          <div className={styles.categoryProductItem}>

            {categoryProductInfo && categoryProductInfo.map((item, index) => {
              const matchingImg = categoryProductImg.slice(0,6).find(img => img.PRODUCT_NO === item.productNo && img.PRODUCT_NO != 19);
              return matchingImg  ? (
              <div className={styles.categoryItem}>
                <Link to='#'>
                  <img 
                  key={index} 
                  src={matchingImg.PRODUCT_IMAGE_PATH} 
                  alt={`Product ${item.productNo}`} 
                  />
                  <p>{item.productTitle}</p>
                  <p className={styles.categoryProductPrice}>{item.productPrice.toLocaleString()}원</p>
                </Link>
              </div>
              ) : null; // 매칭되는 이미지가 없으면 null을 반환합니다.
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreInfo;
