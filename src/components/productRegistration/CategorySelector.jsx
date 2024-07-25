import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/CategorySelector.module.css';

const CategorySelector = ({ onCategoryChange, onParentChange }) => {
    const [parentNumberOptions, setParentNumberOptions] = useState([]);
    const [productCategoryList, setProductCategoryList] = useState([]);
    const [parentNumber, setParentNumber] = useState('1');
    const [selectedParent, setSelectedParent] = useState('카테고리를 선택하세요');
    const [selectedCategory, setSelectedCategory] = useState('카테고리를 선택하세요');
    const [isSecondDropdownVisible, setIsSecondDropdownVisible] = useState(false);

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

    const handleParentChange = (option) => {
        setParentNumber(option.categoryNo);
        setSelectedParent(option.categoryName);
        setIsSecondDropdownVisible(true);
        onParentChange(option.categoryNo);
    };

    const handleCategoryChange = (option) => {
        setSelectedCategory(option.categoryName);
        onCategoryChange(option.categoryNo);
    };

    return (
        <div className={styles.category}>
            <div className={styles.customDropdown}>
                <div className={styles.dropdownHeader}>{selectedParent}</div>
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
                    <div className={styles.dropdownHeader}>{selectedCategory}</div>
                    <ul className={styles.dropdownList}>
                        {productCategoryList.map((option) => (
                            <li
                                key={option.categoryNo}
                                onClick={() => handleCategoryChange(option)}
                                className={`${styles.dropdownItem} ${selectedCategory === option.categoryName ? styles.selectedItem : ''}`}
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
