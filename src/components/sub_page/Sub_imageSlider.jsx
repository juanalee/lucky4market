import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProductInfo from './Sub_productInfo';
import StoreInfo from './Sub_sellerInfo';
import styles from '../../css/sub_pageCss/sub_imageSlider.module.css'; // 모듈 CSS 파일 가져오기

export default function ImageSlider() {
  const [productImg, setProductImg] = useState([]);

  useEffect(() => {
    let currentIndex = 0; // 현재 보이는 이미지
    const sliderCount = productImg.length; // 이미지 갯수
    const sliderMove = document.querySelector(`.${styles.productMainImg}`);
    const sliderBtn = document.querySelectorAll(`.${styles.arrow} a`);

    function moveSlider(num) {
      sliderMove.style.transition = "all 400ms";
      sliderMove.style.transform = `translateX(${-500 * num}px)`;
      currentIndex = num;

      let dotActive = document.querySelectorAll(`.${styles.sliderDot} .${styles.dot}`);
      dotActive.forEach((active) => active.classList.remove(styles.active));
      dotActive[num].classList.add(styles.active);
    }

    function handlePrev(e) {
      e.preventDefault();
      let prevIndex = (currentIndex + sliderCount - 1) % sliderCount;
      moveSlider(prevIndex);
    }
    
    function handleNext(e) {
      e.preventDefault();
      let nextIndex = (currentIndex + 1) % sliderCount;
      moveSlider(nextIndex);
    }

    sliderBtn.forEach((btn) => {
      if (btn.classList.contains("prev")) {
        btn.onclick = handlePrev;
      } else {
        btn.onclick = handleNext;
      }
    });

  }, [productImg]);

  useEffect(() => {
    const productImage = async () => {
      try {
        const response = await axios.get('http://localhost:9999/productImage?productNo=20');
        setProductImg(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    productImage();
  }, []);

  return (
    <>
      <div className={styles.hrContainer}>
        <hr />
      </div>
      <div className={styles.subPageContainer}>
        <div className={styles.subPageMain}>
          <div className={styles.slideContainer}>
            <div className={styles.productMainImgContainer}>
              <div className={styles.productMainImgMove}>
                <div className={styles.productMainImg}>
                  {productImg.map((img, index) => (
                    <img key={index} src={img.productImagePath} alt={`Product ${index}`} />
                  ))}
                </div>
              </div>
              {productImg.length > 1 &&
                <div className={styles.arrow}>
                  <a href="#" className={styles.prev}>
                    <img src="/img/left.png" className={styles.leftArrow} alt="Previous" />
                  </a>
                  <a href="#" className={styles.next}>
                    <img src="/img/right.png" className={styles.rightArrow} alt="Next" />
                  </a>
                </div>
              }
              <div className={styles.sliderDot}>
                {productImg.map((_, index) => (
                  <span key={index} className={`${styles.dot} ${index === 0 ? styles.active : ''}`}></span>
                ))}
              </div>
            </div>
          </div>
          <ProductInfo productImage={productImg[0]} />
          <StoreInfo />
        </div>
      </div>
    </>
  );
}
