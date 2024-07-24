import axios from 'axios';
import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../css/sub_pageCss/sub_sellerInfo.module.css'

const StoreInfo = () => {
  const followBtn = useRef();
  const followImg = useRef();
  const sellerImageCount = useRef([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [storeInfo, setStoreInfo] = useState([{}]);
  const [profileInfo, setProfileInfo] = useState([{}]);
  const [buyerProfileInfo, setBuyerProfileInfo] = useState({});
  const [sellerProductImage, setSellerProductImage] = useState([]);

  const followClick = () => {
    setIsFollowing((prevState) => !prevState);

    axios.get('http://localhost:9999/insertFollow?buyerId=member10&sellerId=member4')
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
        const storeResponse = await axios.get('http://localhost:9999/storeInfo?memberId=member4');
        setStoreInfo(storeResponse.data);

        const sellerProfileResponse = await axios.get('http://localhost:9999/sellerProfile?memberId=member4');
        setProfileInfo(sellerProfileResponse.data);
  
        const buyerIds = storeResponse.data.filter(item => item.review !== null).map(item => item.buyerId);
        if (buyerIds.length > 0) {
          const buyerProfileResponse = await axios.post('http://localhost:9999/buyerProfile', { memberId: buyerIds });
          setBuyerProfileInfo(buyerProfileResponse.data);
        }

        const response = await axios.get('http://localhost:9999/sellerProductImage?memberId=member4');
        setSellerProductImage(response.data);

        const followStatusResponse = await axios.get('http://localhost:9999/selectFollowStatus?memberId=member4');
        // console.log(followStatusResponse.data);
        const userLiked = followStatusResponse.data.includes('member10');
        setIsFollowing(userLiked);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  const remainingProducts = storeInfo.length > 0 ? storeInfo[0].saleCount - (1 + sellerImageCount.current.length) : 0;
  const remainingReviews = storeInfo.filter(item => item.review !== null).length;

  return (
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
              <Link to='#'>상품 {storeInfo.length > 0 && storeInfo[0].saleCount}개</Link>
              <span className={styles.line}></span>
              <Link>팔로워 {storeInfo.length > 0 && storeInfo[0].followerCount}명</Link>
            </div>
            <div className={styles.followBtn_container}>
              <img src={isFollowing ? "/img/unfollow.png" : "/img/follow.png"} ref={followImg} alt="followImage" />
              <button className={styles.follow} ref={followBtn} onClick={followClick}>
                {isFollowing ? '팔로잉' : '팔로우'}
              </button>
            </div>
            <div className={styles.seller_product_img}>
              {sellerProductImage.slice(0, 2).map((img, index) => (
                img.productNo !== 16 && (
                  <div key={index}>
                    <Link to='#'><img src={img.image} alt={`Product ${index}`} ref={(el) => {
                      if (el && !sellerImageCount.current.includes(el)) {
                        sellerImageCount.current.push(el);
                      }
                    }}/></Link>
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
          <div className={styles.seller_review_container}>
            <div className={styles.seller_review_header}> 
              <h2 className={styles.review_title}>상점 후기</h2>
              <h2 className={styles.review_count}>{remainingReviews}</h2>
            </div>
            <hr />
            <div className={styles.review}>
              {remainingReviews === 0 ? (
                <div className={styles.no_reviews_message}>등록된 후기가 없습니다.</div>
              ) : (
                <div className={styles.review_container}>
                  {storeInfo.map((item, index) => (
                    item.review !== null && (
                      <Fragment key={index}>
                        <div className={styles.member_id}>
                          <Link to='#'><img src={buyerProfileInfo.length > 0 && buyerProfileInfo[index] && item.buyerId === buyerProfileInfo[index].MEMBERID ? buyerProfileInfo[index].PROFILEPATH : "/img/store_basic.png"} alt="profile" /></Link>
                          <Link to='#'>{item.buyerId}</Link>
                        </div>
                        <div className={styles.buyer_review}>
                          <div className={styles.buyer_review_img}>
                          {(() => {
                            const stars = [];
                            for (let i = 0; i < item.reviewScore; i++) {
                              stars.push(
                                <img key={i} src="/img/star.png" alt="star" />
                              );
                            }
                            return stars;
                          })()}
                          </div>
                          <p>{item.review}</p>
                        </div>
                        <hr />
                      </Fragment>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
          {remainingReviews - 2 > 0 && (
            <div className={styles.review_more}>
              <Link to="#">후기 더보기</Link>
              <hr />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreInfo;
