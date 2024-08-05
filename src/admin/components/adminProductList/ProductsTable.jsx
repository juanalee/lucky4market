import React, { useState, useEffect } from 'react';
import styles from './AdminProductList.module.css';
import axios from 'axios';

const ProductsTable = ({ products, onDelete, fetchProducts }) => {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProductData, setEditedProductData] = useState({});

  useEffect(() => {
    setVisibleProducts(products.slice(0, 5));
  }, [products]);

  const loadMoreProducts = () => {
    const nextIndex = visibleProducts.length;
    const nextBatch = products.slice(nextIndex, nextIndex + 5);

    if (nextBatch.length > 0) {
      setVisibleProducts((prevVisible) => [...prevVisible, ...nextBatch]);
    }
  };

  const handleEdit = (product) => {
    setEditProductId(product.productId);
    setEditedProductData(product);
  };

  const handleInputChange = (event, field) => {
    setEditedProductData({
      ...editedProductData,
      [field]: event.target.value,
    });
  };

  const handleSave = async () => {
    try {
      console.log('Saving product:', editedProductData);
      const response = await axios.put(`http://localhost:9999/admin/updateProduct`, editedProductData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.count === 0) {
        throw new Error(response.data.msg);
      }

      // 수정하려는 특정 회원 정보만 수정
      setVisibleProducts((prevVisibleProducts) =>
        prevVisibleProducts.map((product) =>
          product.productId === editProductId ? editedProductData : product
        )
      );

      setEditProductId(null);
    } catch (error) {
      console.error('회원 정보 수정 오류:', error);
    }
  };

  const handleCancel = () => {
    setEditProductId(null);
    setEditedProductData({});
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.replace('T', '<br />');
  };

  return (
    <div id="tableContainer" className={styles.adminProductsTableContainer}>
      <table className={styles.adminProductsTable}>
        <thead>
          <tr>
            <th className={styles.adminProductsId}>아이디</th>
            <th className={styles.adminProductsName}>회원이름</th>
            <th className={styles.adminProductsNick}>닉네임</th>
            <th className={styles.adminProductsEmail}>이메일</th>
            <th className={styles.adminProductsAddr}>주소</th>
            <th className={styles.adminProductsGrade}>회원등급</th>
            <th className={styles.adminProductsPhoneNo}>전화번호</th>
            <th className={styles.adminProductsRegDate}>가입일자</th>
            <th className={styles.adminProductsManage}>관리</th>
          </tr>
        </thead>
        <tbody>
          {visibleProducts.length > 0 ? (
            visibleProducts.map((result, index) => (
              <tr key={index}>
                <td className={styles.adminProductsId}>{result.productId}</td>
                <td className={styles.adminProductsName}>
                  {editProductId === result.productId ? (
                    <input
                      type="text"
                      value={editedProductData.productName}
                      onChange={(e) => handleInputChange(e, 'productName')}
                      className={styles.adminProductsFixedWidthInput}
                    />
                  ) : (
                    result.productName
                  )}
                </td>
                <td className={styles.adminProductsNick}>
                  {editProductId === result.productId ? (
                    <input
                      type="text"
                      value={editedProductData.productNick || ''}
                      onChange={(e) => handleInputChange(e, 'productNick')}
                      className={styles.adminProductsFixedWidthInput}
                    />
                  ) : (
                    result.productNick
                  )}
                </td>
                <td className={styles.adminProductsEmail}>
                  {editProductId === result.productId ? (
                    <input
                      type="text"
                      value={editedProductData.productEmail}
                      onChange={(e) => handleInputChange(e, 'productEmail')}
                      className={styles.adminProductsFixedWidthInput}
                    />
                  ) : (
                    result.productEmail
                  )}
                </td>
                <td className={styles.adminProductsAddr}>
                  {editProductId === result.productId ? (
                    <input
                      type="text"
                      value={editedProductData.productAddr || ''}
                      onChange={(e) => handleInputChange(e, 'productAddr')}
                      className={styles.adminProductsFixedWidthInput}
                    />
                  ) : (
                    result.productAddr
                  )}
                </td>
                <td className={styles.adminProductsGrade}>
                  {editProductId === result.productId ? (
                    <select
                      value={editedProductData.productGrade}
                      onChange={(e) => handleInputChange(e, 'productGrade')}
                      className={styles.adminProductsFixedWidthInput}
                    >
                      <option value="1">일반회원</option>
                      <option value="2">차단된회원</option>
                    </select>
                  ) : (
                    result.productGradeName
                  )}
                </td>
                <td className={styles.adminProductsPhoneNo}>
                  {editProductId === result.productId ? (
                    <input
                      type="text"
                      value={editedProductData.productPhoneNo}
                      onChange={(e) => handleInputChange(e, 'productPhoneNo')}
                      className={styles.adminProductsFixedWidthInput}
                    />
                  ) : (
                    result.productPhoneNo
                  )}
                </td>
                <td
                  className={styles.adminProductsRegDate}
                  dangerouslySetInnerHTML={{ __html: formatDate(result.productRegDate) }}
                ></td>
                <td className={styles.adminProductsManage}>
                  {editProductId === result.productId ? (
                    <>
                      <button
                        className={styles.adminProductsSaveButton}
                        onClick={handleSave}
                      >
                        저장
                      </button>
                      <button
                        className={styles.adminProductsCancelButton}
                        onClick={handleCancel}
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={styles.adminProductsEditButton}
                        onClick={() => handleEdit(result)}
                      >
                        수정
                      </button>
                      <button
                        className={styles.adminProductsDeleteButton}
                        onClick={() => onDelete(result.productId)}
                      >
                        삭제
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className={styles.adminProductsNoResults}>일치하는 회원이 없습니다</td>
            </tr>
          )}
          {visibleProducts.length < products.length && (
            <tr className={styles.adminProductsLoadMoreRow} onClick={loadMoreProducts}>
              <td colSpan="9" className={styles.adminProductsLoadMore}>
                <span className={styles.loadMoreText}>▼ 더보기</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
