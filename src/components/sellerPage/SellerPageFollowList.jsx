import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../header/Header";
import styles from "./css/SellerPageFollowList.module.css";
import { Link } from "react-router-dom";

export default function SellerPageFollowList() {
  const [sellerProfile, setSellerProfile] = useState([]);
  const [sellerFollowList, setSellerFollowList] = useState([]);

  const sellerId = "member10";

  const defaultProfileImage = "/img/myPage/default_profile_image.png";

  useEffect(() => {
    if (sellerId) {
      const followListData = async () => {
        try {
          const profileResponse = await axios.get(`https://lucky4market.me/api/member/sellerPageProfile/${sellerId}`);
          setSellerProfile(profileResponse.data);

          const followListResponse = await axios.get(`https://lucky4market.me/api/member/sellerPageFollowList/${sellerId}`);
          setSellerFollowList(followListResponse.data);
        } catch (error) {
          console.error("데이터를 가져오는 중 오류 발생:", error);
        }
      };
      followListData();
    }
  }, [sellerId]);

  return (
    <div className={styles.follow_list_header_container}>
      <Header />
      <div className={styles.follow_list_side_container}>
        <div className={styles.follow_list_main_container}>
          {sellerProfile.map((data, idx) => (
            <div className={styles.follow_list_profile_container} key={idx}>
              <img
                className={styles.follow_list_profile_image}
                src={data.sellerProfilePath ? data.sellerProfilePath : defaultProfileImage}
                alt="프로필 이미지"
              />
              <div className={styles.follow_list_profile_info}>
                <span>{data.sellerNick || data.sellerId}</span>
                <span>님의 팔로우 목록 | 평점:</span>
                <span className={styles.follow_list_avg_score}>★</span>
                {data.sellerScore}
              </div>
            </div>
          ))}
          <div className={styles.follow_list_nav_container}>
            <ul className={styles.follow_list_nav_ul}>
              <li className={styles.follow_list_nav_li}>
                <Link to="/sellerStore" className={styles.follow_list_nav_item}>상점</Link>
              </li>
              <li className={styles.follow_list_nav_li}>
                <Link to="/sellerReceivedReview" className={styles.follow_list_nav_item}>후기</Link>
              </li>
              <li className={styles.follow_list_nav_li}>
                <Link to="/sellerFollowList" className={styles.follow_list_nav_item}>팔로우</Link>
              </li>
            </ul>
          </div>
          <div className={styles.follow_list_container}>
            {sellerFollowList.length > 0 ? (
              sellerFollowList.map((data, idx) => (
                <div className={styles.follow_list_container2} key={idx}>
                  <img
                    className={styles.follow_list_seller_profile_image}
                    src={data.sellerProfilePath || defaultProfileImage}
                    alt="프로필 이미지"
                  />
                  <div className={styles.follow_list_item}>
                    {data.sellerNick || data.sellerId}
                  </div>
                  <div className={styles.follow_list_item}>
                    팔로우 {data.sellerFollowCount}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.follow_list_nothing}>팔로우를 한 유저가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};