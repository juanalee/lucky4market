import React, { useState, useEffect } from 'react';
import styles from './css/MainpageSlider.module.css'; // CSS 모듈을 가져옵니다.

const MainpageSlider = () => {
  const [currImg, setCurrImg] = useState(0);
  const numImg = 5; // 이미지 수

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setCurrImg(prevImg => (prevImg + 1) % numImg);
    }, 2000);

    return () => clearTimeout(timeoutID);
  }, [currImg]);

  const nextImage = () => {
    setCurrImg(prevImg => (prevImg + 1) % numImg);
  };

  const prevImage = () => {
    setCurrImg(prevImg => (prevImg - 1 + numImg) % numImg);
  };

  return (
    <div className={styles.mainpageSlider}>
      <i className={`fa-solid fa-angles-left fa-2x ${styles.mainpageprevious} ${styles.faSolid}`} onClick={prevImage}></i>
      <div className={styles.imgContainer} style={{ transform: `translateX(-${currImg * 100}%)` }}>
        <img src="https://cdn.pixabay.com/photo/2014/07/31/23/00/wristwatch-407096_640.jpg" alt="" />
        <img src="https://cdn.pixabay.com/photo/2023/04/26/17/59/wrist-watch-7953062_640.jpg" alt="" />
        <img src="https://cdn.pixabay.com/photo/2018/08/27/15/09/safe-3635196_640.jpg" alt="" />
        <img src="https://media.istockphoto.com/id/1527665525/ko/%EC%82%AC%EC%A7%84/%EA%B3%A0%EA%B8%89-%EC%97%AC%EC%84%B1%EC%9A%A9-%EA%B0%80%EB%B0%A9-%ED%9D%B0%EC%83%89-%EB%B0%94%ED%83%95%EC%97%90-%EC%A3%BC%ED%99%A9%EC%83%89-%EA%B0%80%EC%A3%BD-%ED%95%B8%EB%93%9C%EB%B0%B1-%EB%8C%80%EB%A6%AC%EC%84%9D-%EB%B0%94%EB%8B%A5.jpg?s=612x612&w=0&k=20&c=G-jkaknI25nxjzCynJIhEjoepVlNZfXVNX6IQd1U7No=" alt="" />
        <img src="https://cdn.pixabay.com/photo/2018/08/10/08/05/constellation-3596291_640.jpg" alt="" />
      </div>
      <i className={`fa-solid fa-angles-right fa-2x ${styles.next} ${styles.faSolid}`} onClick={nextImage}></i>
    </div>
  );
};

export default MainpageSlider;
