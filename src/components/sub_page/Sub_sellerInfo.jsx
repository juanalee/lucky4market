import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default () => {
  const followBtn = useRef();
  const followImg = useRef();
  const [followImage, setFollowImage] = useState("/img/follow.png");
  const [buttonText, setButtonText] = useState('팔로우');

  const followClick = () => {
    setFollowImage((item) =>
      item === "/img/follow.png" ? "/img/star.png" : "/img/follow.png"
    );
    setButtonText((prevText) =>
      prevText === '팔로우' ? '팔로잉' : '팔로우'
    );
  };
  
  return (
  <div className="product_content_container">
    <div className="seller_information">
      <h2>상점 정보</h2>
      <hr />
      <div className="seller">
        <div className="member_id">
          <img src="/img/profile.png" alt="profile" />
          <span>판매자 아이디</span>
        </div>
        <div className="seller_sub_2">
          <p>상품 2개</p>
          <span className="line"></span>
          <p>팔로워 10</p>
        </div>
        <div className="followBtn_container">
          <img src={followImage} ref={followImg} alt="followImage" />
          <button className="follow" ref={followBtn} onClick={followClick}>{buttonText}</button>
        </div>
        <div className="seller_product_img">
          <div>
            <img src="/img/productimg.jpg" alt="Product 1" />
            <p>상품 이름</p>
            <p>상품 가격</p>
          </div>
          <div>
            <img src="/img/productimg2.jpg" alt="Product 2" />
            <p>상품 이름</p>
            <p>상품 가격</p>
          </div>
        </div>
        <div className="more">
          <Link to="#">상품 더보기</Link>
          <hr />
        </div>
        <div className="seller_review_container">
          <h2>상점 후기</h2>
          <hr />
          <div className="review">
            <div className="member_id">
              <img src="/img/profile.png" alt="profile" />
              <span>구매자 아이디</span>
            </div>
            <div className="buyer_review">
              <div className="buyer_review_img">
                <img src="/img/star.png" alt="star" />
                <img src="/img/star.png" alt="star" />
                <img src="/img/star.png" alt="star" />
                <img src="/img/star.png" alt="star" />
                <img src="/img/star.png" alt="star" />
              </div>
              <p>판매한 물품이름</p>
              <p>리뷰 내용</p>
            </div>
            <hr />
            <div className="member_id">
              <img src="/img/profile.png" alt="profile" />
              <span>구매자 아이디</span>
            </div>
            <div className="buyer_review">
              <div className="buyer_review_img">
                <img src="/img/star.png" alt="star" />
                <img src="/img/star.png" alt="star" />
                <img src="/img/star.png" alt="star" />
                <img src="/img/star.png" alt="star" />
                <img src="/img/star.png" alt="star" />
              </div>
              <p>판매한 물품이름</p>
              <p>리뷰 내용</p>
            </div>
            <div className="more">
              <Link to="#">후기 더보기</Link>
              <hr />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  );
}