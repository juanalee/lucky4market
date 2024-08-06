import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/CategorySelector.module.css';

const CategorySelector = ({ onCategoryChange, onParentChange }) => {
    const [parentNumberOptions, setParentNumberOptions] = useState([]);
    const [productCategoryList, setProductCategoryList] = useState([]);
    const [parentNumber, setParentNumber] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isSecondDropdownVisible, setIsSecondDropdownVisible] = useState(false);

    useEffect(() => {
        const fetchParentNumbers = async () => {
            try {
                const response = await axios.get('https://lucky4market.me/api/product/category/list');
                setParentNumberOptions(response.data);
            } catch (error) {
                console.error('Error fetching parent number options:', error);
            }
        };
        fetchParentNumbers();
    }, []);

    useEffect(() => {
        if (parentNumber) {
            const fetchCategories = async () => {
                try {
                    const response = await axios.get(`https://lucky4market.me/api/product/category/list/${parentNumber}`);
                    setProductCategoryList(response.data);
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            };
            fetchCategories();
        }
    }, [parentNumber]);

    const handleParentChange = (option) => {
        setParentNumber(option.categoryNo);
        setSelectedCategory(''); // 부모 카테고리 선택 시 두 번째 카테고리 초기화
        setIsSecondDropdownVisible(true);
        onParentChange(option.categoryNo);
    };

    const handleCategoryChange = (option) => {
        setSelectedCategory(option.categoryNo);
        onCategoryChange(parentNumber, option.categoryNo); // 부모 카테고리와 두 번째 카테고리 번호 전달
    };

    return (
        <div className={styles.category}>
            <div className={styles.customDropdown}>
                <ul className={styles.dropdownList}>
                    {parentNumberOptions.map((option) => (
                        <li
                            key={option.categoryNo}
                            onClick={() => handleParentChange(option)}
                            className={`${styles.dropdownItem} ${parentNumber === option.categoryNo ? styles.selectedItem : ''}`}
                        >
                            {option.categoryName}
                        </li>
                    ))}
                </ul>
            </div>

            {isSecondDropdownVisible && (
                <div className={styles.customDropdown}>
                    <ul className={styles.dropdownList}>
                        {productCategoryList.map((option) => (
                            <li
                                key={option.categoryNo}
                                onClick={() => handleCategoryChange(option)}
                                className={`${styles.dropdownItem} ${selectedCategory === option.categoryNo ? styles.selectedItem : ''}`}
                            >
                                {option.categoryName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CategorySelector;