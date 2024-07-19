import React from "react";
import Header from "../header/Header";
import ImageSlider from "./Sub_imageSlider";
import '../../css/sub_pageCss/sub_imageSlider.css'
import '../../css/sub_pageCss/sub_productInfo.css'
import '../../css/sub_pageCss/sub_sellerInfo.css'
import '../../css/sub_pageCss/sub_purchase_side.css'

export default () => {

  return (
    <>
      <Header />
      <ImageSlider />         
    </>
  );
}