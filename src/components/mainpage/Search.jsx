import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../header/Header';
import CategorySelector from './CategorySelector';
import styles from './css/Search.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchBar() {
  const query = useQuery();
  const [searchResultproductList, setSearchResultproductList] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [includeSoldOut, setIncludeSoldOut] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategorySelectorVisible, setIsCategorySelectorVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState('latest');
  const [formData, setFormData] = useState({
    minPrice: '',
    maxPrice: '',
    includeSoldOut: '',
    sortOrder: 'latest',
    searchQuery: '',
    parentCategoryNo: '', // 첫 번째 카테고리 번호 추가
    categoryNo: '' // 두 번째 카테고리 번호 추가
  });

 

  const prevFormDataRef = useRef(formData);

  // 새로 추가된 부분: 검색 버튼 클릭 및 엔터 키 입력 처리


  useEffect(() => {
    const queryParam = query.get('query') || '';
    const parentCategoryNo = query.get('parentCategoryNo') || '';
    const categoryNo = query.get('categoryNo') || '';

    setSearchQuery(queryParam);
    setFormData(prevState => ({
      ...prevState,
      searchQuery: queryParam,
      parentCategoryNo:'',
      categoryNo:''
    }));
  }, [query.toString()]);

  useEffect(() => {
    const prevFormData = prevFormDataRef.current;
    const hasChanged = JSON.stringify(prevFormData) !== JSON.stringify(formData);
    if (hasChanged) {
      sendSearchOption();
      prevFormDataRef.current = formData;
    }
  }, [formData]);

  // 새로 추가된 부분: parentCategoryNo가 변경될 때 검색 요청 전송
  useEffect(() => {
    if (formData.parentCategoryNo !== '') {
      sendSearchOption();
    }
  }, [formData.parentCategoryNo]);

  const sendSearchOption = async () => {
    // 빈 값을 제외하고 쿼리 파라미터 생성
    const queryParams = new URLSearchParams({
      ...formData,
      includeSoldOut: includeSoldOut ? '' : '판매중'
    }).toString();

    try {
      const response = await axios.get(`http://localhost:9999/api/product/search?${queryParams}`);
      console.log('Query Params:', queryParams);
      console.log('Response:', response.data);
      setSearchResultproductList(response.data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const handleChangeOption = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCategoryChange = (parentCategoryNo, categoryNo) => {
    setFormData(prevState => ({
      ...prevState,
      parentCategoryNo,
      categoryNo
    }));
  };

  const handleCloseCategory = () => {
    setFormData(prevState => ({
      ...prevState,
      parentCategoryNo: '',
      categoryNo: ''
    }));
    sendSearchOption();
  };

  const handleParentChange = (parentCategoryNo) => {
    console.log('Selected parent category number:', parentCategoryNo);
    setFormData(prevState => ({
      ...prevState,
      parentCategoryNo,
      categoryNo: '' // 부모 카테고리 변경 시 자식 카테고리 초기화
    }));
  };

  const toggleCategorySelector = () => {
    setIsCategorySelectorVisible(!isCategorySelectorVisible);
  };

  const handleIncludeSoldOutChange = () => {
    const newIncludeSoldOut = !includeSoldOut;
    setIncludeSoldOut(newIncludeSoldOut);
    setFormData(prevState => ({
      ...prevState,
      includeSoldOut: newIncludeSoldOut ? '판매완료 상품 포함' : ''
    }));
  };

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    setFormData(prevState => ({
      ...prevState,
      sortOrder: newSortOrder
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <div>
      <Header />
      <div className={styles.searchContainer}>
        <h1 className={styles.searchTitle}>'{searchQuery}' 검색결과 ({searchResultproductList.length})</h1>
        <div className={styles.searchCategory}>
        <button onClick={toggleCategorySelector}>
  {isCategorySelectorVisible ? (
    <>
    
      <button onClick={handleCloseCategory}>카테고리 -</button>
    </>
  ) : (
    '카테고리 + '
  )}
</button>
          {isCategorySelectorVisible && (
            <CategorySelector 
              onCategoryChange={handleCategoryChange}
              onParentChange={handleParentChange}
            />
          )}
        </div>
        <div className={styles.searchPrice} >
          <label className={styles.searchOption}>가격</label>
          <input
            type="text"
            placeholder="최소 가격"
            value={formData.minPrice}
            onChange={handleChangeOption}
            name="minPrice"
            style={{ marginRight: '5px' }}
          />
          ~
          <input
            type="text"
            placeholder="최대 가격"
            value={formData.maxPrice}
            onChange={handleChangeOption}
            name="maxPrice"
          />
          <button onClick={() => {}}>적용</button>
        </div>
        <div className={styles.searchSolioutOption}>
        <label className={styles.searchOption}>옵션</label>
        <div>
          <label>
            <input
              type="checkbox"
              checked={includeSoldOut}
              onChange={handleIncludeSoldOutChange}
            />
            판매완료 상품 포함
          </label>
        </div>
        </div>
        <div className={styles.searchOptionResult}>
          <label className={styles.searchOption}>선택한 필터</label>
          {formData.includeSoldOut}
        </div>
        <div className={styles.searchOrderbyOption}>
          <label>
            <input
              type='radio'
              name='orderby'
              value='latest'
              checked={formData.sortOrder === 'latest'}
              onChange={handleSortChange}
            />
            최신순
          </label>
          <label>
            <input
              type='radio'
              name='orderby'
              value='highToLow'
              checked={formData.sortOrder === 'highToLow'}
              onChange={handleSortChange}
            />
            높은 가격순
          </label>
          <label>
            <input
              type='radio'
              name='orderby'
              value='lowToHigh'
              checked={formData.sortOrder === 'lowToHigh'}
              onChange={handleSortChange}
            />
            낮은 가격순
          </label>
        </div>
      </div>
      <div className={styles.searchPageProductList}>
        {searchResultproductList.length > 0 ? (
          searchResultproductList.map((searchProduct, index) => (
               <div  key={index} className={styles.productContainer}>
              <Link to={`/productPage/${searchProduct.productNo}`}>
                 <img className={styles.ProductSalesimg} src={searchProduct.productImagePath} alt="Product" /></Link>
                <div className={styles.ProductSalestext}>
                  <p className={styles.searchProductTitle}>{searchProduct.productTitle}</p>
                  <p className={styles.searchProductPrice}>￦{formatPrice(searchProduct.productPrice)}</p>
                  <p className={styles.searchProductCount}> 조회수{searchProduct.productCount}  좋아요{searchProduct.productLike}</p>
                </div>
              </div>
          
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default SearchBar;