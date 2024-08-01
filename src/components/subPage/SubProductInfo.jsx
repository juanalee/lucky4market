import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PurchaseSide from './SubSide';
import styles from './css/SubProductInfo.module.css';
import Report from './SubReport';
import Sub_chat from './SubChat';
import StoreInfo from './SubSellerInfo';
import { AuthContext } from '../../services/AuthContext';

const ProductInfo = ({ productImage }) => {
  const { profile, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const [profileSub, setProfileSub] = useState(profile?.sub || null);
  const [timePassed, setTimePassed] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [productInfo, setProductInfo] = useState({
    productTitle: '',
    productPrice: 0,
    productCount: 0,
    productLike: 0,
    productDate: '',
    productStatus: '',
    productContent: '',
    categoryNo: 0
  });
  const [deliveryInfo, setDeliveryInfo] = useState({
    deliveryName: '',
    tradiArea: '',
    deliveryCharge: 0
  });
  const [categoryInfo, setCategoryInfo] = useState([]);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [productMemberId, setProductMemberId] = useState(null);
  const [likeMsgOpen, setLikeMsgOpen] = useState(false);
  const [likeMsg, setLikeMsg] = useState("");
  const [buyerInfo, setBuyerInfo] = useState("");

  // Update profileSub when profile changes
  useEffect(() => {
    if (profile?.sub !== profileSub) {
      setProfileSub(profile?.sub || null);
    }
  }, [profile?.sub, profileSub]);

  // Fetch product and related data
  const fetchData = useCallback(async () => {
    try {
      const productResponse = await axios.get('http://localhost:9999/api/product/productInfo?productNo=19');
      setProductInfo(productResponse.data);
      setProductMemberId(productResponse.data.memberId);

      const deliveryResponse = await axios.get('http://localhost:9999/api/product/deliveryInfo?productNo=19');
      setDeliveryInfo(deliveryResponse.data);

      const categoryResponse = await axios.get(`http://localhost:9999/api/product/categoryInfo?categoryNo=${productResponse.data.categoryNo}`);
      setCategoryInfo(categoryResponse.data);

      if (profileSub) {
        const likeStatusResponse = await axios.get('http://localhost:9999/api/product/selectLikeStatus?productNo=19');
        const userLiked = likeStatusResponse.data.includes(profileSub);
        setIsLiked(userLiked);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [profileSub]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update time passed since product creation
  useEffect(() => {
    const updateTimePassed = () => {
      if (productInfo.productDate) {
        const currentDate = new Date();
        const createDate = new Date(productInfo.productDate);

        const seconds = Math.floor((currentDate - createDate) / 1000);
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (days > 0) {
          setTimePassed(`${days}일 전`);
        } else if (hours > 0) {
          setTimePassed(`${hours}시간 전`);
        } else {
          setTimePassed(`${minutes}분 전`);
        }
      }
    };

    updateTimePassed();
  }, [productInfo.productDate]);

  const navigateLogin = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const likeClick = useCallback(async () => {
    if (!isAuthenticated) {
      navigateLogin();
      return;
    }

    if (!profileSub) {
      console.warn("Profile is not defined.");
      return;
    }

    setIsLiked(prevIsLiked => {
      const newIsLiked = !prevIsLiked;
      setLikeMsg(newIsLiked ? "찜 상품에 추가 하셨습니다" : "찜한 상품에서 제외 했습니다");
      setLikeMsgOpen(true);
      return newIsLiked;
    });

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setLikeMsgOpen(false);
    }, 1500); // 1.5초 후 닫기

    try {
      await axios.get(`http://localhost:9999/insertProductLike?memberId=${profileSub}&productNo=19`);
    } catch (error) {
      console.error('Error occurred during like operation:', error);
      setIsLiked(prevIsLiked => !prevIsLiked); // 에러 발생 시 상태 원복
    }
  }, [isAuthenticated, profileSub, navigateLogin]);

  const buyWidth = useCallback(async () => {
    navigateLogin();
    setIsPurchaseOpen(true);
  }, [navigateLogin]);

  const reportOpen = useCallback(() => {
    navigateLogin();
    setIsReportOpen(true);
  }, [navigateLogin]);

  const chatOpen = useCallback(async () => {
    if (!isAuthenticated) {
      navigateLogin();
      return;
    }

    try {
      const chatRoomExistResponse = await axios.get('http://localhost:9999/chatRoomExist', {
        params: {
          memberId: profileSub,
          productNo: productInfo.productNo
        }
      });
      if (chatRoomExistResponse.data.length > 0) {
        setRoomId(chatRoomExistResponse.data[0]);
      } else {
        const newChatRoomResponse = await axios.post('http://localhost:9999/createChatRoom', {
          receiverId: productInfo.memberId,
          senderId: profileSub,
          productNo: productInfo.productNo
        });
        setRoomId(newChatRoomResponse.data.chatNo);
      }
    } catch (error) {
      console.error('Error occurred during chat operation:', error);
    }

    setIsChatOpen(true);
  }, [productInfo.productNo, isAuthenticated, profileSub, productInfo.memberId, navigateLogin]);

  useEffect(() => {
    if (profileSub === null && isAuthenticated) {
      window.location.reload();
    }
  }, [profileSub, isAuthenticated]);

  return (
    <>
      <div className={styles.product_information}>
        <div className={styles.product_category}>
          <Link to="#">홈</Link>
          <span>{'>'}</span>
          {categoryInfo?.length > 1 && <Link to="#">{categoryInfo[1]?.categoryName}</Link>}
          <span>{'>'}</span>
          {categoryInfo?.length > 0 && <Link to="#">{categoryInfo[0]?.categoryName}</Link>}
        </div>
        <p className={styles.product_title}>{productInfo.productTitle}</p>
        <p className={styles.product_price}>{productInfo.productPrice.toLocaleString()}원</p>
        <div className={styles.product_sub_information}>
          <div className={styles.product_create}>
            <img src="/img/time.png" alt="time" className={styles.information_img} />
            <span>{timePassed}</span>
          </div>
          <div className={styles.product_count}>
            <img src="/img/find.png" alt="find" className={styles.information_img} />
            <span>{productInfo.productCount}</span>
          </div>
          <div className={styles.product_like}>
            <img
              src={isLiked ? "/img/redheart.png" : "/img/heart.png"}
              alt="like"
              onClick={likeClick}
              className={styles.information_img}
            />
            <span>{productInfo.productLike}</span>
          </div>
          <div className={styles.product_report}>
            <div onClick={reportOpen}>
              <img src="/img/report.png" alt="report" className={styles.information_img} />신고하기
            </div>
          </div>
          <Report isReportOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
        </div>
        <div className={styles.product_status_information}>
          <div className={styles.product_status}>
            <p>제품상태</p>
            <p>{productInfo.productStatus}</p>
          </div>
          <span className={styles.line}></span>
          <div className={styles.product_delivery}>
            <p>거래방식</p>
            <p>직거래,택배</p>
          </div>
          <span className={styles.line}></span>
          <div className={styles.product_delivery_fee}>
            <p>배송</p>
            <p>{deliveryInfo.deliveryName}</p>
          </div>
        </div>
        <ul className={styles.product_trade_area}>
          <li>거래희망 지역 - {deliveryInfo.tradiArea}</li>
          {deliveryInfo.deliveryCharge !== 0 && (
            <li>
              배송비 - {deliveryInfo.deliveryCharge.toLocaleString()}원
            </li>
          )}
        </ul>
        <div className={styles.product_interaction_area}>
          <button className={styles.like_btn} onClick={likeClick}>
            <img src={isLiked ? "/img/redheart.png" : "/img/heart.png"} alt="like" />
          </button>
          <button className={styles.chat_btn} onClick={chatOpen}>채팅하기</button>
          <button className={styles.buy_btn} onClick={buyWidth}>구매하기</button>
        </div>
      </div>
      <div className={styles.product_content}>
        <div className={styles.product_info_content}>
          <h2>상품 정보</h2>
          <hr />
          <p>{productInfo.productContent}</p>
        </div>
      </div>

      <div className={`${styles.likeContainer} ${likeMsgOpen ? styles.show : ''}`}>
        <p>{likeMsg}</p>
      </div>

      <PurchaseSide isOpen={isPurchaseOpen} onClose={() => setIsPurchaseOpen(false)} productImage={productImage} productInfo={productInfo} />
      <Sub_chat isChatOpen={isChatOpen} onClose={() => setIsChatOpen(false)} productImage={productImage} productInfo={productInfo} sellerId={productMemberId} roomId={roomId} />
      {categoryInfo.length > 0 && <StoreInfo categoryInfo={categoryInfo[0]} productTitle={productInfo.productTitle} navigateLogin={navigateLogin} sellerId={productMemberId}/>}
    </>
  );
};

export default ProductInfo;
