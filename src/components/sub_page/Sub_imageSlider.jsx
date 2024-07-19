import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProductInfo from './Sub_productInfo';
import StoreInfo from './Sub_sellerInfo';
import '../../css/sub_pageCss/sub_imageSlider.css'

export default () => {
  const [productImg, setProductImg] = useState([]); 

  useEffect(() => {
    let currentIndex = 0; // 현재 보이는 이미지
    const sliderCount = productImg.length; // 이미지 갯수
    const sliderMove = document.querySelector('.product_main_img');
    const sliderBtn = document.querySelectorAll('.arrow a');

    function moveSlider(num) {
      sliderMove.style.transition = "all 400ms";
      sliderMove.style.transform = `translateX(${-500 * num}px)`;
      currentIndex = num;

      let dotActive = document.querySelectorAll(".slider_dot .dot");
      dotActive.forEach((active) => active.classList.remove("active"));
      dotActive[num].classList.add("active");
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
        // console.log(response);
        setProductImg(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    productImage();
  }, []);


  return (
    <>
    <div className='hr_container'>
      <hr />
    </div>
    <div className="sub_page_container">
      <div className="sub_page_main">
        <div className="slide_container">
          <div className="product_main_img_container">
            <div className="product_main_img_move">
              <div className="product_main_img">
              {productImg.map((img, index) => (
                <img key={index} src={img.productImagePath} alt={`Product ${index}`} />
              ))}
              </div>
            </div>
            {productImg.length > 1  &&
              <div className="arrow">
                <a href="#" className="prev">
                  <img src="/img/left.png" className="left_arrow" alt="Previous" />
                </a>
                <a href="#" className="next">
                  <img src="/img/right.png" className="right_arrow" alt="Next" />
                </a>
              </div>
            }
            <div className="slider_dot">
                {productImg.map((_, index) => (
                  <span key={index} className={`dot ${index === 0 ? 'active' : ''}`}></span>
                ))}
            </div>
          </div>
        </div>
        <ProductInfo productImage={productImg[0]}/>
        <StoreInfo />
      </div>
    </div>
    </>
  );
}