import React, { useRef } from 'react';
import styles from './AdminProductList.module.css';

const ProductsSearchFilter = ({
  searchTerm,
  searchDateTerm,
  selectedSearchOption,
  selectedProductSaleOption,
  setSearchTerm,
  setSearchDateTerm,
  handleSearchOptionChange,
  handleProductSaleOptionChange,
  handleSearch,
  handleReset,
  handleKeyDown,
  notification
}) => {

  const productSaleRef = useRef(null);

  const handleProductSaleChange = (event) => {
    handleProductSaleOptionChange(event);
    if (productSaleRef.current) {
      productSaleRef.current.blur();
    }
  };

  return (
    <div className={styles.adminProductsSearchFilterSection}>
      <div className={styles.adminProductsSearchCondition}>
        <label className={styles.adminProductsLabelMargin}>검색조건</label>
        <div className={styles.adminProductsSearchBox}>
          <select
            className={styles.adminProductsSelectInput1}
            value={selectedSearchOption}
            onChange={handleSearchOptionChange}
            onKeyDown={handleKeyDown}
          >
            <option value="productNo">상품번호</option>
            <option value="sellerId">판매자 아이디</option>
            <option value="claimerId">신고자 아이디</option>
          </select>
          <input
            className={styles.adminProductsSearchInput}
            type="text"
            placeholder="검색어 입력"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown} // Add onKeyDown handler
          />
          <span className={styles.adminProductsSearchlabel}>상품 등록 일자: </span>
          <div>
            <input
              className={styles.adminProductsSearchDateInput1}
              type="date"
              placeholder="시작일"
              value={searchDateTerm.startDate}
              onChange={(e) => setSearchDateTerm({ ...searchDateTerm, startDate: e.target.value })}
              onKeyDown={handleKeyDown}
            />
            <span className={styles.adminProductsSearchlabel}>~</span>
            <input
              className={styles.adminProductsSearchDateInput2}
              type="date"
              placeholder="종료일"
              value={searchDateTerm.endDate}
              onChange={(e) => setSearchDateTerm({ ...searchDateTerm, endDate: e.target.value })}
              onKeyDown={handleKeyDown}
            />
            <span className={styles.adminProductsSearchlabel}>상품글 상태: </span>
            <select
              ref={productSaleRef}
              className={styles.adminProductsSelectInput2}
              value={selectedProductSaleOption}
              onChange={handleProductSaleChange}
              onKeyDown={handleKeyDown}
            >
              <option value="">-----</option>
              <option value="판매중">판매중</option>
              <option value="완료">완료</option>
              <option value="삭제">삭제</option>
              <option value="삭제">차단</option>
            </select>
          </div>
        </div>
        {notification && <div className={styles.adminReportsNotification}>{notification}</div>}
      </div>
      <div className={styles.adminReportsButtonGroup}>
        <button className={styles.adminReportsSearchButton} onClick={handleSearch}>검색</button>
        <button className={styles.adminReportsResetButton} onClick={handleReset}>초기화</button>
      </div>
    </div>
  );
};

export default ProductsSearchFilter;
