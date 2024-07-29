import { Link } from "react-router-dom";
import Header from "../header/Header";
import MyPageSideBar from "./MyPageSideBar";
import styles from "./css/MyPageReceivedReview.module.css";

export default function MyPageReceivedReview() {
  return (
    <div className={styles.received_review_header_container}>
      {/* <Header/> */}
      <div className={styles.received_review_side_container}>
        <MyPageSideBar/>
        <div className={styles.received_review_main_container}>
          <div className={styles.my_received_review}>받은 후기</div>
          <div className={styles.received_review_nav_container}>
            <ul className={styles.received_review_nav_ul}>
              <li className={styles.received_review_nav_li}>
                <Link to="/my-store" className={styles.received_review_nav_item}>상품</Link>
              </li>
              <li className={styles.received_review_nav_li}>
                <Link to="/received-review" className={styles.received_review_nav_item}>후기</Link>
              </li>
              <li className={styles.received_review_nav_li}>
                <Link to="/follow-list" className={styles.received_review_nav_item}>팔로우</Link>
              </li>
            </ul>
          </div>
          <div className={styles.received_review_card}>

          </div>
        </div>
        <div className={styles.received_review_banner}>배너</div>
      </div>
    </div>
  );
};