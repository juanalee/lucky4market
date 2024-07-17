import axios from 'axios';
import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';

const StoreInfo = () => {
  const followBtn = useRef();
  const followImg = useRef();
  const [followImage, setFollowImage] = useState("/img/follow.png");
  const [buttonText, setButtonText] = useState('팔로우');
  const [storeInfo, setStoreInfo] = useState([{}]);
  const [profileInfo, setProfileInfo] = useState([{}]);
  const [buyerProfileInfo, setbuyerProfileInfo] = useState({});
  const [sellerProductImage, setSellerProductImage] = useState([]);

  const followClick = () => {
    setFollowImage((item) =>
      item === "/img/follow.png" ? "/img/star.png" : "/img/follow.png"
    );
    setButtonText((prevText) =>
      prevText === '팔로우' ? '팔로잉' : '팔로우'
    );
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {        
        const storeResponse = await axios.get('http://localhost:9999/storeInfo?memberId=member4');
        console.log(storeResponse.data);
        setStoreInfo(storeResponse.data);
        
        const sellerProfileResponse = await axios.get('http://localhost:9999/sellerProfile?memberId=member4');
        // console.log(sellerProfileResponse.data);
        setProfileInfo(sellerProfileResponse.data);
  
        // 리뷰가 있는 구매자의 buyerId 배열 추출
        // buyerIds가 존재하면 첫 번째 buyerId만 사용 (여러 구매자 중 첫 번째 것만 사용할 경우)
        const buyerIds = storeResponse.data.filter(item => item.review !== null).map(item => item.buyerId);
        if (buyerIds.length > 0) {
          const buyerProfileResponse = await axios.post('http://localhost:9999/buyerProfile', { memberId: buyerIds });
          console.log(buyerProfileResponse.data);
          setbuyerProfileInfo(buyerProfileResponse.data);
        }

        const response = await axios.get('http://localhost:9999/sellerProductImage?memberId=member4');
        console.log(response.data);
        setSellerProductImage(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div className="product_content_container">
      <div className="seller_information">
        <h2>상점 정보</h2>
        <hr />
        <div className="seller">
          <div className='store_info'>
            <div className="member_id">
              <img src={profileInfo.length > 0 ? profileInfo : "/img/store_basic.png"} alt="profile" />
              <span>{storeInfo.length > 0 && storeInfo[0].sellerId}</span>
            </div>
            <div className="seller_sub_2">
              <Link to='#'>상품 {storeInfo.length > 0 && storeInfo[0].saleCount}개</Link>
              <span className="line"></span>
              <Link>팔로워 {storeInfo.length > 0 && storeInfo[0].followerCount}명</Link>
            </div>
            <div className="followBtn_container">
              <img src={followImage} ref={followImg} alt="followImage" />
              <button className="follow" ref={followBtn} onClick={followClick}>{buttonText}</button>
            </div>
            <div className="seller_product_img">
              {sellerProductImage.slice(0,2).map((img, index) => (
                img.productNo != 20 && (
                  <div>
                    <Link to='#'><img key={index} src={img.image} alt={`Product ${index}`} /></Link>
                    <p>{img.price}원</p>
                  </div>
                )
              ))}
            </div>
            <div className="more">
              <Link to="#">
                {storeInfo.length > 0 && <span>{storeInfo[0].saleCount - 3}개</span>} 상품 더보기
              </Link>
              <hr />
            </div>
          </div>
          <div className="seller_review_container">
            <h2>상점 후기</h2>
            <hr />
            <div className="review">
              {storeInfo.length === 0 ? (
                <div className="no_reviews_message">등록된 후기가 없습니다.</div>
              ) : (
                <div className="review_container">
                  {storeInfo.map((item,index) => (
                    item.review !== null && (
                      <Fragment key={item.buyerId}>
                        <div className="member_id">
                          <Link to='#'><img src={buyerProfileInfo.length > 0 && buyerProfileInfo[index] && item.buyerId === buyerProfileInfo[index].MEMBERID ? buyerProfileInfo[index].PROFILEPATH : "/img/store_basic.png"} alt="profile" /></Link>
                          <Link to='#'>{item.buyerId}</Link>
                        </div>
                        <div className="buyer_review">
                          <div className="buyer_review_img">
                            <img src="/img/star.png" alt="star" />
                            <img src="/img/star.png" alt="star" />
                            <img src="/img/star.png" alt="star" />
                            <img src="/img/star.png" alt="star" />
                            <img src="/img/star.png" alt="star" />
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
          {storeInfo.review === 0 ? (
            <div></div>
          ) : 
          <div className="review_more">
            <Link to="#">후기 더보기</Link>
            <hr />
          </div>
          }
        </div>
      </div>
    </div>
  );
};

export default StoreInfo;
