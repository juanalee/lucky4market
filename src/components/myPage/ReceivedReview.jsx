import { Link } from "react-router-dom";
import Footer from "./Footer";
import Header from "../header/Header";
import ReceivedReviewCard from "./ReceivedReviewCard";
import MypageSideBar from "./MypageSideBar";
import styles from "./css/ReceivedReview.module.css";

const review = [
  {
    imageUrl: "/img/mypage/keyboard.png",
    name: "기계식 키보드",
    price: "70,000원",
    score: "★★★★★",
    review: "기계식 키보드를 입문하기 위해서 구매했습니다. 타건했을 때의 소리가 일품이네요!"
  },
  {
    imageUrl: "/img/mypage/mouse.png",
    name: "마우스",
    price: "30,000원",
    score: "★★★★★",
    review: "평소에 유선 마우스를 쓰다가 불편해서 무선 마우스를 샀습니다. 유선과 달리 휴대하기 편해서 업무용으로 유용하게 쓰고 있어요."
  },
  {
    imageUrl: "/img/mypage/case.png",
    name: "스마트폰 가죽 케이스",
    price: "10,000원",
    score: "★★★★★",
    review: "케이스가 낡아서 새로운 케이스를 찾다가 우연히 발견하고 구매하여 사용 중인데 좋네요!"
  }
];

export default function ReceivedReview() {
  return (
    <div className={styles.received_review_header_container}>
      <Header />
      <div className={styles.received_review_side_container}>
        <MypageSideBar />
        <div className={styles.received_review_main_container}>
          <div className={styles.my_received_review}>받은 후기</div>
          <div className={styles.received_review_nav_container}>
            <ul className={styles.received_review_nav_ul}>
              <li className={styles.received_review_nav_li}>
                <Link to="/myStore" className={styles.received_review_nav_item}>상품</Link>
              </li>
              <li className={styles.received_review_nav_li}>
                <Link to="/receivedReview" className={styles.received_review_nav_item}>후기</Link>
              </li>
              <li className={styles.received_review_nav_li}>
                <Link to="/followList" className={styles.received_review_nav_item}>팔로우</Link>
              </li>
            </ul>
          </div>
          <div className={styles.received_review_card}>
            {review.map((product, index) => (
              <ReceivedReviewCard key={index} product={product} />
            ))}
          </div>
        </div>
        <div className={styles.received_review_banner}>배너</div>
      </div>
      <Footer />
    </div>
  );
};