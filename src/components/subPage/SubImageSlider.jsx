import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProductInfo from './SubProductInfo';
import styles from './css/SubImageSlider.module.css'; // 모듈 CSS 파일 가져오기
import { useParams } from 'react-router-dom';

export default function SubImageSlider() {
  const [productImg, setProductImg] = useState([]);
  const [productInfo, setProductInfo] = useState([]);
  const { productNo } = useParams(); // useParams를 이용해 productNo 가져오기

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get(`http://localhost:9999/api/product/productInfo?productNo=${productNo}`);
        setProductInfo(productResponse.data);
        
        const imageResponse = await axios.get(`http://localhost:9999/api/product/productImage?productNo=${productNo}`);
        setProductImg(imageResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [productNo]); // productNo를 의존성 배열에 추가

  useEffect(() => {
    if (productImg.length === 0) return;

    let currentIndex = 0; // 현재 보이는 이미지
    const sliderCount = productImg.length; // 이미지 개수
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

  const imageStyle1 = productInfo.productSale === '완료';
  const imageStyle2 = productInfo.productSale === '예약';
  const imageClass1 = imageStyle1 ? '' : styles.imageSale;
  const imageClass2 = imageStyle2 ? '' : styles.imageSale;

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
                    <img
                      key={index}
                      src={img.productImagePath}
                      alt={`Product ${index}`}
                      className={`${styles.productMainImage} ${imageClass1} ${imageClass2}`}
                    />
                  ))}
                  {imageStyle1 && 
                    <>
                      <div className={styles.productSaleBackground}></div>
                      <img src='/img/sold_out.png' className={styles.productSaleImg} alt="Sold Out"/>
                      <p className={styles.productSaleStatus}>판매완료</p>
                    </>
                  }
                  {imageStyle2 && 
                    <>
                      <div className={styles.productSaleBackground}></div>
                      <img src='/img/sold_out.png' className={styles.productSaleImg} alt="Reserved"/>
                      <p className={styles.productSaleStatus}>예약중</p>
                    </>
                  }
                </div>
              </div>
              {productImg.length > 1 && !imageStyle1 && !imageStyle2 &&
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
                {productImg.length > 1 && productImg.map((_, index) => (
                  <span
                    key={index}
                    className={`${styles.dot} ${index === 0 ? styles.active : ''}`}
                  ></span>
                ))}
              </div>
            </div>
          </div>
          <ProductInfo productImage={productImg[0]} productNo={productNo} />
        </div>
      </div>
    </>
  );
}
