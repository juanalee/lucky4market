import React, { useState, useEffect } from 'react';
import AdminHeader from '../adminHeader/AdminHeader';
import ProductsSearchFilter from './ProductsSearchFilter';
import ProductsTable from './ProductsTable';
import AdminPopup from '../adminPopup/AdminPopup';
import styles from './AdminProductList.module.css';
import axios from 'axios';

const AdminProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('memberId');
  const [showModal, setShowModal] = useState(false);
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:9999/admin/allProducts');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('상품 목록 가져오기 오류:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:9999/admin/searchProducts?${searchField}=${searchTerm}`);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('상품 검색 오류:', error);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchField('productNo');
    setFilteredProducts(products);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDelete = (productNo) => {
    setProductToDelete(productNo);
    setPopupMessage('해당 상품글을 삭제하시겠습니까?');
    setIsConfirmation(true);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('삭제하려는 상품글 번호:', productToDelete);
      setPopupMessage('상품글 삭제 성공');
      fetchProducts();
    } catch (error) {
      console.error('상품글 삭제 오류:', error);
      setPopupMessage('상품글 삭제 오류');
    } finally {
      setIsConfirmation(false);
      setShowModal(true);
      setProductToDelete(null);
    }
  };

  const closePopup = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.adminProductsContainer}>
      <AdminHeader />
      <div className={styles.adminProductsContent}>
        <h2 className={styles.adminProductsTitle}>상품글 관리</h2>
        <hr />
        <ProductsSearchFilter
          searchField={searchField}
          searchTerm={searchTerm}
          handleSearchFieldChange={handleSearchFieldChange}
          handleSearchChange={handleSearchChange}
          handleSearch={handleSearch}
          handleReset={handleReset}
          handleKeyDown={handleKeyDown}
        />
        <div className={styles.adminProductsResultInfo}>
          <span>총 상품 수: {filteredProducts.length}건</span>
        </div>
        <ProductsTable
          products={filteredProducts}
          onDelete={handleDelete}
          fetchProducts={fetchProducts}
        />
      </div>
      <AdminPopup
        show={showModal}
        onClose={closePopup}
        onConfirm={isConfirmation ? confirmDelete : closePopup}
        message={popupMessage}
        isConfirmation={isConfirmation}
      />
    </div>
  );
};

export default AdminProductList;
