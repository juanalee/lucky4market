import React from 'react';
import Header from './Header';
import SideBar from './SideBar';
import ProductCard from './ProductCard';
import Footer from './Footer';
import styles from './css/MyStore.module.css';

const products = [
  {
    name: "가죽 가방",
    price: "50,000원",
    detail: "관심 9 | 채팅 5",
    imageUrl: "/img/mypage/bag.png",
  },
  {
    name: "손목 시계",
    price: "300,000원",
    detail: "관심 5 | 채팅 9",
    imageUrl: "/img/mypage/watch.png",
  },
  {
    name: "선글라스",
    price: "30,000원",
    detail: "관심 11 | 채팅 5",
    imageUrl: "/img/mypage/sunglasses.png",
  },
  {
    name: "의자",
    price: "10,000원",
    detail: "관심 3 | 채팅 3",
    imageUrl: "/img/mypage/chair.png",
  },
];

export default function MyStore() {
  return (
    <div className={styles.header_container}>
      <Header/>
      <div className={styles.side_container}>
        <SideBar/>
          <div className={styles.main_container}>
            <div className={styles.my_profile}>닉네임 | 평점: <span className={styles.my_score}>★</span>4.5</div>
            <div className={styles.nav_container}>
              <ul className={styles.nav_ul}>
                <li className={styles.nav_li}><a href="#" className={styles.nav_item}>상품</a></li>
                <li className={styles.nav_li}><a href="#" className={styles.nav_item}>후기</a></li>
                <li className={styles.nav_li}><a href="#" className={styles.nav_item}>팔로우</a></li>
              </ul>
            </div>
            <div className={styles.my_products}>
              {products.map((product, index) => (
                <ProductCard key={index} product={product}/>
              ))}
            </div>
          </div>
        <div className={styles.banner}>배너</div>
      </div>
      <Footer/>
    </div>
  );
};