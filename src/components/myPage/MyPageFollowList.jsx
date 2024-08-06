import React, { useEffect, useState } from "react";
import MyPageMemberId from "./MypageMemberId";
import axios from "axios";
import Header from "../header/Header";
import MyPageSideBar from "./MypageSideBar";
import styles from "./css/MyPageFollowList.module.css";
import { Link } from "react-router-dom";

export default function MyPageFollowList() {
  const [myProfile, setMyProfile] = useState([]);
  const [myFollowList, setMyFollowList] = useState([]);

  const memberId = MyPageMemberId();

  const defaultProfileImage = "/img/myPage/default_profile_image.png";

  useEffect(() => {
    if (memberId) {
      const followListData = async () => {
        try {
          const profileResponse = await axios.get(`http://localhost:9999/api/member/myPageProfile/${memberId}`);
          setMyProfile(profileResponse.data);

          const followListResponse = await axios.get(`http://localhost:9999/api/member/myPageFollowList/${memberId}`);
          setMyFollowList(followListResponse.data);
        } catch (error) {
          console.error("데이터를 가져오는 중 오류 발생:", error);
        }
      };
      followListData();
    }
  }, [memberId]);

  return (
    <div className={styles.follow_list_header_container}>
      <Header />
      <div className={styles.follow_list_side_container}>
        <MyPageSideBar />
        <div className={styles.follow_list_main_container}>
          {myProfile.map((data, idx) => (
            <div className={styles.follow_list_profile_container} key={idx}>
              <img
                className={styles.follow_list_profile_image}
                src={data.memberProfilePath ? data.memberProfilePath : defaultProfileImage}
                alt="프로필 이미지"
              />
              <div className={styles.follow_list_profile_info}>
                <span>{data.memberNick || data.memberId}</span>
                <span>님의 팔로우 목록 | 평점:</span>
                <span className={styles.follow_list_avg_score}>★</span>
                {data.memberScore}
              </div>
            </div>
          ))}
          <div className={styles.follow_list_nav_container}>
            <ul className={styles.follow_list_nav_ul}>
              <li className={styles.follow_list_nav_li}>
                <Link to="/myStore" className={styles.follow_list_nav_item}>상점</Link>
              </li>
              <li className={styles.follow_list_nav_li}>
                <Link to="/receivedReview" className={styles.follow_list_nav_item}>후기</Link>
              </li>
              <li className={styles.follow_list_nav_li}>
                <Link to="/followList" className={styles.follow_list_nav_item}>팔로우</Link>
              </li>
            </ul>
          </div>
          <div className={styles.follow_list_container}>
            {myFollowList.length > 0 ? (
              myFollowList.map((data, idx) => (
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