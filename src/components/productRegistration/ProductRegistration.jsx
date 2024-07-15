import React, { useEffect, useRef, useState } from 'react';
import axios from "axios";
import styles from './ProductRegistration.module.css';

export default function ProductRegistration() {
    const productTitle = useRef();
    const selectCategoryNo = useRef();
    const productContent = useRef();
    const tradeArea = useRef();
    const [ProductCategoryList, setProductCategoryList] = useState([]);
    const [formData, setFormData] = useState({
        productPrice: '',
        productState: '',
        deliveryNo: '',
        tradeArea: '',
        directDeal: 'select', // Assuming a default value for directDeal
        location: 'seoul' // Assuming a default value for location
    });
    const [parentNumberOptions, setParentNumberOptions] = useState([]); // State to hold parent number options
    const [parentNumber, setParentNumber] = useState('1'); // Default parentNumber

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:9999/Category/list');
                console.log(response.data);
                setParentNumberOptions(response.data); // Assuming response.data is an array of objects with properties like categoryNo and categoryName
            } catch (error) {
                console.error('Error fetching parent number options:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const readData = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/Category/list/${parentNumber}`);
                console.log(response.data);
                setProductCategoryList(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        readData();
    }, [parentNumber]); // Fetch whenever parentNumber changes

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const obj = {
            productTitle: productTitle.current.value,
            productPrice: formData.productPrice,
            categoryNo: selectCategoryNo.current.value,
            productContent: productContent.current.value,
            productStatus: formData.productStatus,
            deliveryNo: formData.deliveryNo,
            tradeArea: formData.tradeArea
        };
        console.log(obj);

        axios.post('http://localhost:9999/product/insert', obj)
            .then(response => {
                console.log(response);
                alert(response.data.msg);
                if (response.data.result) {
                    // Navigate or perform other actions
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
            });
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <div className={styles.productRegisterHeader}>
                    <div className={styles.photoUpload}>
                        <div className={styles.photoPlaceholder}>0 / 3</div>
                    </div>
                    <div className={styles.priceContainer1}>
                        <input
                            type="text"
                            ref={productTitle}
                            name="productTitle"
                            placeholder="상품명"
                            className={styles.productName}
                        />
                        <div className={styles.priceContainer2}>
                            <input
                                type="text"
                                name="productPrice"
                                value={formData.productPrice}
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

                <select name="categoryNo" ref={selectCategoryNo} className={styles.categorySelect}>
                    {ProductCategoryList.map((item) => (
                        <option key={item.categoryNo} value={item.categoryNo}>{item.categoryName}</option>
                    ))}
                </select>

                <textarea
                    name="description"
                    ref={productContent}
                    placeholder="판매상품 상세 설명"
                    className={styles.description}
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
                </div>

                <div className={styles.location}>
                    <select
                        name="location"
                        value={formData.location === '서울'}
                        onChange={handleChange}
                    >
                        <option value="seoul">서울</option>
                        <option value="gangnam">강서구</option>
                    </select>
                </div>

                <button type="submit" className={styles.submitButton}>작성 완료</button>
            </form>
        </div>
    );
}
