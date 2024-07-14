import React, { useEffect } from "react";
import Header from "./Header";
import '../css/sub_page.css';
import axios from "axios";


export default () => {
  let currentIndex = 0; // 현재 보이는 이미지
  const sliderCount = 3; // 이미지 갯수

  useEffect(() => {
    const sliderMove = document.querySelector('.product_main_img');
    const sliderBtn = document.querySelectorAll('.arrow a');

    function moveSlider(num) {
      sliderMove.style.transition = "all 400ms";
      sliderMove.style.transform = `translateX(${-550 * num}px)`;
      currentIndex = num;

      let dotActive = document.querySelectorAll(".slider_dot .dot");
      dotActive.forEach((active) => active.classList.remove("active"));
      dotActive[num].classList.add("active");
    }

    function handlePrev() {
      let prevIndex = (currentIndex + sliderCount - 1) % sliderCount;
      moveSlider(prevIndex);
    }

    function handleNext() {
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

  }, []);

  useEffect(()=>{

    axios.get('http://localhost:9999/productList')
    .then(response => {
      console.log(response)
    }).catch(error => {
      console.error(error);
    })
  },[])

  return (
    <>
      <Header />
      <div className="sub_page_container">
        <div className="slide_container">
          <div className="product_main_img_container">
            <div className="product_main_img_move">
              <div className="product_main_img">
                <img src="/img/productimg.jpg" alt="Product 1" />
                <img src="/img/productimg2.jpg" alt="Product 2" />
                <img src="/img/productimg3.jpg" alt="Product 3" />
              </div>
            </div>
            <div className="arrow">
              <a href="#" className="prev">
                <img src="/img/left.png" className="left_arrow" alt="Previous" />
              </a>
              <a href="#" className="next">
                <img src="/img/right.png" className="right_arrow" alt="Next" />
              </a>
            </div>
            <div className="slider_dot">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
        <div className="product_information">
          <p>오래된 시계</p>
          <p>123,456원</p>
        </div>
      </div>
    </>
  );
};

