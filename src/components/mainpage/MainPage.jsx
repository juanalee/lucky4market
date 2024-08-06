import Header from "../header/Header";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/MainPage.module.css';
import MainpageSilder from "./MainpageSlider";
import { Link } from 'react-router-dom';

export const MainPage = () => {
    const [hotproductList, setHotProductList] = useState([]);
    const [newproductList, setNewProductList] = useState([]);
    const [hotDisplayList, setHotDisplayList] = useState([]);
    const [newDisplayList, setNewDisplayList] = useState([]);
    const [hotPage, setHotPage] = useState(1);
    const [newPage, setNewPage] = useState(1);
    const [hotHasMore, setHotHasMore] = useState(true);
    const [newHasMore, setNewHasMore] = useState(true);
    const itemsPerPage = 10;

    const fetchHotProductList = async () => {
        try {
            const response = await axios.get('https://lucky4market.me/api/product/hotproductlist');
            console.log('Hot Products:', response.data);
            setHotProductList(response.data);
            setHotDisplayList(response.data.slice(0, itemsPerPage));
            if (response.data.length <= itemsPerPage) {
                setHotHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching hot product list:', error);
        }
    };

    const fetchNewProductList = async () => {
        try {
            const response = await axios.get('https://lucky4market.me/api/product/newproductlist');
            console.log('New Products:', response.data);
            setNewProductList(response.data);
            setNewDisplayList(response.data.slice(0, itemsPerPage));
            if (response.data.length <= itemsPerPage) {
                setNewHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching new product list:', error);
        }
    };

    useEffect(() => {
        fetchHotProductList();
        fetchNewProductList();
    }, []);

    const handleLoadMore = (type) => {
        if (type === 'hot') {
            const nextPage = hotPage + 1;
            const startIndex = hotPage * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const nextHotDisplayList = hotproductList.slice(0, endIndex);
            setHotDisplayList(nextHotDisplayList);
            setHotPage(nextPage);
            if (endIndex >= hotproductList.length) {
                setHotHasMore(false);
            }
        } else if (type === 'new') {
            const nextPage = newPage + 1;
            const startIndex = newPage * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const nextNewDisplayList = newproductList.slice(0, endIndex);
            setNewDisplayList(nextNewDisplayList);
            setNewPage(nextPage);
            if (endIndex >= newproductList.length) {
                setNewHasMore(false);
            }
        }
    };

    
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

    return (
        <div>
            <Header />
           
    <MainpageSilder className={styles.ImageSliderContainer}/>
          <div className={styles.mainPageContainer}>
                <p className={styles.mainPageTitle}>지금 주목받는 상품</p>
                <div className={styles.mainPageProductList}>
                    {hotDisplayList.map((product, index) => (
                        <div key={index} className={styles.mainPageProductItem}>
                             <Link to={`productPage/${product.productNo}`}> <img src={product.productImagePath} alt="Product" />  </Link>
                        
                            <div>
                            <p className={styles.mainProductTitle}>{product.productTitle}</p>
                            <p className={styles.mainProductPrice}>￦{formatPrice(product.productPrice)}</p>
                               <p>조회수{product.productCount}        좋아요{product.productLike}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {hotHasMore && (
                    <button onClick={() => handleLoadMore('hot')} className={styles.mainloadMoreButton}>
                        더보기
                    </button>
                )}
            </div>

            {/* New Products Section */}
            <div className={styles.mainPageContainer}>
                <p className={styles.mainPageTitle}>새로 등록된 상품</p>
                <div className={styles.mainPageProductList}>
                    {newDisplayList.map((product, index) => (
                    <div key={index} className={styles.mainPageProductItem}>
                    <Link to={`productPage/${product.productNo}`}> <img src={product.productImagePath} alt="Product" /></Link>
                            <div>
                                <p className={styles.mainProductTitle}>{product.productTitle}</p>
                                <p className={styles.mainProductPrice}>￦{formatPrice(product.productPrice)}</p>
                                <p>조회수{product.productCount}        좋아요{product.productLike}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {newHasMore && (
                    <button onClick={() => handleLoadMore('new')} className={styles.mainloadMoreButton}>
                        더보기
                    </button>
                )}
            </div>
        </div>
    );
};