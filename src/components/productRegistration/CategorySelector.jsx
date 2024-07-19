import React, { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import styles from './css/CategorySelector.module.css';

const CategorySelector = forwardRef(({ onCategoryChange, onParentChange }, ref) => {
    const [parentNumberOptions, setParentNumberOptions] = useState([]);
    const [productCategoryList, setProductCategoryList] = useState([]);
    const [parentNumber, setParentNumber] = useState('1');

    useEffect(() => {
        const fetchParentNumbers = async () => {
            try {
                const response = await axios.get('http://localhost:9999/category/list');
                setParentNumberOptions(response.data);
            } catch (error) {
                console.error('Error fetching parent number options:', error);
            }
        };
        fetchParentNumbers();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/category/list/${parentNumber}`);
                setProductCategoryList(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, [parentNumber]);

    return (
        <div>
            <select
                className={styles.categorySelect}
                value={parentNumber}
                onChange={(e) => {
                    setParentNumber(e.target.value);
                    onParentChange(e.target.value);
                }}
            >
                {parentNumberOptions.map((item) => (
                    <option key={item.categoryNo} value={item.categoryNo}>{item.categoryName}</option>
                ))}
            </select>

            <select
                ref={ref} // Forward ref here
                onChange={(e) => onCategoryChange(e.target.value)}
                className={styles.categorySelect}
            >
                {productCategoryList.map((item) => (
                    <option key={item.categoryNo} value={item.categoryNo}>{item.categoryName}</option>
                ))}
            </select>
        </div>
    );
});

export default CategorySelector;
