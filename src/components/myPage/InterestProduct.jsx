import Footer from "./Footer";
import Header from "../header/Header";
import MypageSideBar from "./MypageSideBar";
import styles from "./css/InterestProduct.module.css";

export default function InterestProduct() {

  return (
    <div className={styles.interest_product_header_container}>
      <Header />
      <div className={styles.interest_product_side_container}>
        <MypageSideBar />
        <div className={styles.interest_product_main_container}>
          <div className={styles.my_interest_product}>관심 상품</div>
          <div className={styles.interest_product_card}>

          </div>
        </div>
        <div className={styles.interest_product_banner}>배너</div>
      </div>
      <Footer />
    </div>
  );
};