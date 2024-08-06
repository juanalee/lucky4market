import axios from 'axios';
import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './css/SubSellerInfo.module.css';
import { AuthContext } from '../../services/AuthContext';

const SubSellerInfo = ({ categoryInfo, productTitle, sellerId, productNo }) => {
  const navigate = useNavigate();
  const followBtn = useRef();
  const followImg = useRef();
  const sellerImageCount = useRef([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [storeInfo, setStoreInfo] = useState([]);
  const [profileInfo, setProfileInfo] = useState([]);
  const [categoryProductInfo, setCategoryProductInfo] = useState([]);
  const [sellerProductImage, setSellerProductImage] = useState([]);
  const [categoryProductImg, setCategoryProductImg] = useState([]);
  const [newProductInfo, setNewProductInfo] = useState([]);
  const [followOpen, setFollowOpen] = useState(false);
  const [followMsg, setFollowMsg] = useState("");
  const timerRef = useRef(null);
  const { profile, isAuthenticated } = useContext(AuthContext);
  const [profileSub, setProfileSub] = useState(profile?.sub || null);

  useEffect(() => {
    if (profile?.sub !== profileSub) {
      setProfileSub(profile?.sub || null);
    }
  }, [profile?.sub, profileSub]);

  const navigateLogin = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const followClick = useCallback(async () => {
    if (!isAuthenticated || !profileSub) {
      navigateLogin();
      return;
    }

    setIsFollowing(prevState => {
      const newState = !prevState;
      setFollowMsg(newState ? "팔로우 목록에 추가 하셨습니다" : "팔로우 목록에서 제외 했습니다");
      setFollowOpen(true);

      // 클리어 타이머
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // 새로운 타이머 설정
      timerRef.current = setTimeout(() => {
        setFollowOpen(false);
      }, 1500); // 1.5초 후 닫기

      return newState;
    });

    try {
      await axios.get(`https://lucky4market.me/insertFollow?buyerId=${profileSub}&sellerId=${sellerId}`);
    } catch (error) {
      console.error(error);
      // 실패 시 상태 원복
      setIsFollowing(prevState => !prevState);
    }
  }, [isAuthenticated, profileSub, navigateLogin, sellerId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeResponse = await axios.get(`https://lucky4market.me/api/member/storeInfo?memberId=${sellerId}`);
        setStoreInfo(storeResponse.data);

        const sellerProfileResponse = await axios.get(`https://lucky4market.me/api/member/sellerProfile?memberId=${sellerId}`);
        setProfileInfo(sellerProfileResponse.data);

        const response = await axios.get(`https://lucky4market.me/api/product/sellerProductImage?memberId=${sellerId}`);
        setSellerProductImage(response.data);

        const followStatusResponse = await axios.get(`https://lucky4market.me/api/member/selectFollowStatus?memberId=${sellerId}`);
        const userLiked = followStatusResponse.data.includes(profileSub);
        setIsFollowing(userLiked);

        const categoryProductInfoResponse = await axios.get(`https://lucky4market.me/api/product/categoryProductInfo?categoryNo=${categoryInfo.categoryNo}`);
        setCategoryProductInfo(categoryProductInfoResponse.data);

        const mergedProductNos = categoryProductInfoResponse.data.map(product => product.productNo);

        const categoryProductImgResponse = await axios.post(`https://lucky4market.me/api/product/categoryProductImg`, {
          productNo: mergedProductNos
        });
        setCategoryProductImg(categoryProductImgResponse.data);

        const URL = "/api/search";

        const naverResponse = await axios.get(URL, {
          params: {
            query: productTitle,
            display: 20,
          },
        });
        console.log(naverResponse);
        setNewProductInfo(naverResponse.data.items);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [categoryInfo.categoryNo, productTitle, profileSub, sellerId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const remainingProducts = storeInfo.length > 0 ? storeInfo[0].saleCount - (1 + sellerImageCount.current.length) : 0;
  const remainingReviews = storeInfo.filter(item => item.review !== null).length;

  return (
    <>
      <div className={styles.product_content_container}>
        <div className={styles.seller_information}>
          <h2>상점 정보</h2>
          <hr />
          <div className={styles.store_info}>
            <div className={styles.member_id}>
              <Link to='/sellerStore'><img src={profileInfo.length > 0 ? profileInfo : "/img/store_basic.png"} alt="profile" /></Link>
              <Link to='/sellerStore' className={styles.storeMemberId}>{storeInfo.length > 0 && storeInfo[0].sellerId}</Link>
            </div>
            <div className={styles.seller_sub_2}>
              <Link to='/sellerStore'>상품<p>{storeInfo.length > 0 && storeInfo[0].saleCount}개</p></Link>
              <span className={styles.line}></span>
              <Link to='/sellerFollowList'>팔로워 <p>{storeInfo.length > 0 && storeInfo[0].followerCount}명</p></Link>
              <span className={styles.line}></span>
              <Link to='/sellerReceivedReview'>후기<p>{remainingReviews}개</p></Link>
            </div>
            <div className={styles.followBtn_container}>
              <img src={isFollowing ? "/img/unfollow.png" : "/img/follow.png"} ref={followImg} alt="followImage" />
              <button className={styles.follow} ref={followBtn} onClick={followClick}>
                {isFollowing ? '팔로잉' : '팔로우'}
              </button>
            </div>
            <div className={styles.seller_product_img}>
              {sellerProductImage
                .filter(img => img.productNo !== productNo) // 현재 보고 있는 상품의 이미지를 제외
                .slice(0, 2) // 나머지 이미지 중 최대 2개만 표시
                .map((img, index) => (
                  <div key={index}>
                    <a href={`/productPage/${img.productNo}`}>
                      <img
                        src={img.image}
                        alt={`Product ${index}`}
                        ref={(el) => {
                          if (el && !sellerImageCount.current.includes(el)) {
                            sellerImageCount.current.push(el);
                          }
                        }}
                      />
                    </a>
                    <p className={styles.sellerProductTitle}>{img.title}</p>
                    <p className={styles.sellerProductPrice}>{Number(img.price).toLocaleString()}원</p>
                  </div>
                ))
              }
            </div>
            {remainingProducts > 0 && (
              <div className={styles.more}>
                <Link to='/sellerStore'>
                  <span>{remainingProducts}개</span> 상품 더보기
                </Link>
                <hr />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.suggestContainer}>
        {categoryProductInfo.length > 0 && (
          <>
            <h2>이런 상품은 어떠세요?</h2>
            <div className={styles.categoryProductContainer}>
              <div className={styles.categoryProductItem}>
                {categoryProductInfo.map((item, index) => {
                  const matchingImg = categoryProductImg.find(img => img.PRODUCT_NO === item.productNo && img.PRODUCT_NO !== productNo);
                  return matchingImg ? (
                    <div className={styles.categoryItem} key={index}>
                      <a href={`/productPage/${item.productNo}`}>
                        <img
                          src={matchingImg.PRODUCT_IMAGE_PATH}
                          alt={`Product ${item.productNo}`}
                        />
                        <p>{item.productTitle}</p>
                        <p className={styles.categoryProductPrice}>{Number(item.productPrice).toLocaleString()}원</p>
                      </a>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </>
        )}
        <h2>새상품은 어떠세요?</h2>
        <div className={styles.categoryProductContainer}>
          <div className={styles.categoryProductItem}>
            {newProductInfo && newProductInfo.slice(0, 5).map((item, index) => {
              const priceNumber = Number(item.lprice);

              return (
                <div className={styles.categoryItem} key={index}>
                  <a href={item.link}>
                    <img
                      src={item.image}
                      alt={`Product ${index}`}
                    />
                    <p dangerouslySetInnerHTML={{ __html: item.title }} className={styles.newProductTitle}></p>
                    <p className={styles.categoryProductPrice}>
                      {priceNumber.toLocaleString()}원
                    </p>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={`${styles.followContainer} ${followOpen ? styles.show : ''}`}>
        <p>{followMsg}</p>
      </div>
    </>
  );
};

export default SubSellerInfo;