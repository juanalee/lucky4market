import React from "react";
import Header from "../header/Header";
import ImageSlider from "./Sub_imageSlider";
import ProductInfo from "./Sub_productInfo";
import SellerInfo from "./Sub_sellerInfo";
import '../../css/sub_pageCss/sub_page.css';

export default () => {

  return (
    <>
      <Header />
      <div className="sub_page_container">
        <div className="sub_page_main">
          <ImageSlider />
          <ProductInfo />
          <SellerInfo />
        </div>  
      </div>
    </>
  );
}