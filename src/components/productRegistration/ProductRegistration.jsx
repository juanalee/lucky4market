import React, { useEffect, useRef, useState } from 'react';
import axios from "axios";
import styles from './ProductRegistration.module.css';

export default function ProductRegistration() {
    const productTitle = useRef();
    const selectCategoryNo = useRef();
    const productContent = useRef();
    const productPrice = useRef();
    const deliveryCharge =useRef();
    const [ProductCategoryList, setProductCategoryList] = useState([]);
    const [formData, setFormData] = useState({
        productTitle: '',
        productPrice: '',
        productStatus: '',
        deliveryNo: '',
        tradeArea: 'seoul',
        directDeal: 'select',
        deliveryCharge:'',
    });

    const [parentNumberOptions, setParentNumberOptions] = useState([]);
    const [parentNumber, setParentNumber] = useState('1');

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching parent number options...');
                const response = await axios.get('http://localhost:9999/Category/list');
                console.log('Parent number options:', response.data);
                setParentNumberOptions(response.data);
            } catch (error) {
                console.error('Error fetching parent number options:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const readData = async () => {
            try {
                console.log(`Fetching categories for parent number ${parentNumber}...`);
                const response = await axios.get(`http://localhost:9999/Category/list/${parentNumber}`);
                console.log('Categories:', response.data);
                setProductCategoryList(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        readData();
    }, [parentNumber]);

    const parentchange = (e) => {
        const { value } = e.target;
        setParentNumber(value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('productTitle', formData.productTitle);
        formDataToSend.append('productPrice', formData.productPrice);
        formDataToSend.append('categoryNo', selectCategoryNo.current.value);
        formDataToSend.append('productContent', productContent.current.value);
        formDataToSend.append('productStatus', formData.productStatus);
        formDataToSend.append('deliveryNo', formData.deliveryNo);
        formDataToSend.append('tradeArea', formData.tradeArea);
        formDataToSend.append('deliveryCharge',formData.deliveryCharge)

        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((fileInput, index) => {
            const files = fileInput.files;
            for (let i = 0; i < files.length; i++) {
                formDataToSend.append('file', files[i]);
            }
        });

        try {
            console.log('Submitting form data...');
            const response = await axios.post('http://localhost:9999/product/insert', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Response:', response);
            alert(response.data.msg);
            if (response.data.result) {
                // 성공 처리
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <div className={styles.productRegisterHeader}>
                    <div className={styles.photoUpload}>
                        <input type="file" name="file1" />
                        <input type="file" name="file2" />
                        <input type="file" name="file3" />
                    </div>
                    <div className={styles.priceContainer1}>
                        <input
                            type="text"
                            ref={productTitle}
                            name="productTitle"
                            placeholder="상품명"
                            className={styles.productName}
                            onChange={handleChange}
                        />
                        <div className={styles.priceContainer2}>
                            <input
                                type="text"
                                name="productPrice"
                                ref={productPrice}
                                onChange={handleChange}
                                placeholder="₩판매가격"
                                className={styles.priceInput}
                            />
                            <div className={styles.freeCheckbox}>
                                <input
                                    type="checkbox"
                                    id="free"
                                    name="priceFree"
                                    onChange={(e) => handleChange({ target: { name: 'productPrice', value: e.target.checked ? '0' : '' } })}
                                />
                                <label htmlFor="free">무료나눔</label>
                            </div>
                        </div>
                    </div>
                </div>

                <select value={parentNumber} onChange={parentchange} className={styles.categorySelect}>
                    {parentNumberOptions.map((item) => (
                        <option key={item.categoryNo} value={item.categoryNo}>{item.categoryName}</option>
                    ))}
                </select>

                <select name="categoryNo" ref={selectCategoryNo} className={styles.categorySelect} onChange={handleChange}>
                    {ProductCategoryList.map((item) => (
                        <option key={item.categoryNo} value={item.categoryNo}>{item.categoryName}</option>
                    ))}
                </select>

                <textarea
                    name="productContent"
                    ref={productContent}
                    placeholder="판매상품 상세 설명"
                    className={styles.description}
                    onChange={handleChange}
                />

                <div className={styles.productState}>
                    <label>
                        <input
                            type="radio"
                            name="productStatus"
                            value="새상품"
                            checked={formData.productStatus === '새상품'}
                            onChange={handleChange}
                        />
                        새상품
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="productStatus"
                            value="중고"
                            checked={formData.productStatus === '중고'}
                            onChange={handleChange}
                        />
                        중고
                    </label>
                </div>

                <div className={styles.directDeal}>
                    <label>
                        <input
                            type="radio"
                            name="deliveryNo"
                            value="1"
                            checked={formData.deliveryNo === '1'}
                            onChange={handleChange}
                        />
                        무료배송
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="deliveryNo"
                            value="2"
                            checked={formData.deliveryNo === '2'}
                            onChange={handleChange}
                        />
                        착불
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="deliveryNo"
                            value="3"
                            checked={formData.deliveryNo === '3'}
                            onChange={handleChange}
                        />
                        선불
                    </label>
                    {(formData.deliveryNo === '2' || formData.deliveryNo === '3') && (
                        <input
                            type="text"
                            ref={deliveryCharge}
                            name="deliveryCharge"
                            placeholder="택배비를 입력하세요"
                            onChange={handleChange}
                            className={styles.deliveryChargeInput}
                        />
                    )}
                </div>

                <div className={styles.tradeArea}>
                    <select
                        name="tradeArea"
                        value={formData.tradeArea}
                        onChange={handleChange}
                    >
                        <option value="서울">서울</option>
                        <option value="경기도">경기도</option>
                    </select>
                </div>

                <button type="submit" className={styles.submitButton}>작성 완료</button>
            </form>
        </div>
    );
}
