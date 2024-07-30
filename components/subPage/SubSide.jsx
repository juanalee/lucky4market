import React, { useState, useEffect, useContext, useCallback } from 'react';
import InputMask from 'react-input-mask';
import Payment from './SubPayment';
import Backdrop from './SubOverlay';
import styles from './css/sub_purchase_side.module.css';
import axios from 'axios';
import Sub_address from './SubAddress';
import { AuthContext } from '../../services/AuthContext';

// Define a default base URL for API requests
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9999';

const SubSide = ({ isOpen, onClose, productImage, productInfo }) => {
    const { profile, isAuthenticated } = useContext(AuthContext);

    const [deliveryAddressValue, setDeliveryAddressValue] = useState('');
    const [addressNameValue, setAddressNameValue] = useState('');
    const [addressPhoneNumberValue, setAddressPhoneNumberValue] = useState('');
    const [addressDetailInfoValue, setAddressDetailInfoValue] = useState('');
    const [tradeMethod, setTradeMethod] = useState(0);
    const [buyMethod, setBuyMethod] = useState('kakaopay');
    const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
    const [isAddressOpen, setAddressOpen] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [isAddAddress, setAddAddressOpen] = useState(false);
    const [addressInfo, setAddressInfo] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [mainAddressInfo, setMainAddressInfo] = useState([]);
    const [addressMainInfo, setAddressMainInfo] = useState({ postalCode: '', fullAddress: '' });

    const [deliveryAddressError, setDeliveryAddressError] = useState('');
    const [addressNameError, setAddressNameError] = useState('');
    const [addressPhoneNumberError, setAddressPhoneNumberError] = useState('');
    const [addressDetailInfoError, setAddressDetailInfoError] = useState('');
    const [addressMainInfoError, setAddressMainInfoError] = useState('');

    const fetchAddressInfo = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/addressInfo?memberId=${profile?.sub}`);
            setAddressInfo(response.data);
        } catch (error) {
            console.error('Failed to fetch address info:', error);
        }
    }, [profile?.sub]);

    useEffect(() => {
        fetchAddressInfo();
    }, [fetchAddressInfo]);

    useEffect(() => {
        setMainAddressInfo(addressInfo.filter(info => info.mainAddress === 1));
    }, [addressInfo]);

    const tradeMethodClass = isOpen ? styles.open : '';
    const purchaseClass = isPurchaseOpen ? styles.open : '';
    const addressClass = isAddressOpen ? styles.open : '';
    const editClass = isEditOpen ? styles.open : '';
    const addAddressClass = isAddAddress ? styles.open : '';

    const tradeMethodDeliveryClass = tradeMethod === 1 ? styles.selected : '';
    const tradeMethodDirectClass = tradeMethod === 2 ? styles.selected : '';

    const selectTradeMethodDelivery = useCallback(() => setTradeMethod(1), []);
    const selectTradeMethodDirect = useCallback(() => setTradeMethod(2), []);

    const proceedToPurchase = useCallback(() => setIsPurchaseOpen(true), []);
    const closePurchase = useCallback(() => {
        setIsPurchaseOpen(false);
        onClose();
    }, [onClose]);

    const toggleModal = (modalType, open) => {
        switch (modalType) {
            case 'address':
                setAddressOpen(open);
                break;
            case 'edit':
                setEditOpen(open);
                break;
            case 'addAddress':
                setAddAddressOpen(open);
                break;
            default:
                break;
        }
    };

    const handleAddressClick = useCallback((id) => setSelectedAddressId(id), []);

    const handleInputChange = (setter) => (event) => setter(event.target.value);

    const mainAddress = addressInfo.length > 0 ? 0 : 1;

    const addressObject = {
        memberId: profile?.sub || 'unknown', // Use profile memberId
        addressName: deliveryAddressValue,
        memberName: addressNameValue,
        memberPhoneNumber: addressPhoneNumberValue,
        postalCode: addressMainInfo.postalCode,
        address: `${addressMainInfo.fullAddress} ${addressDetailInfoValue}`.trim(),
        mainAddress
    };

    const resetAddAddress = useCallback(() => {
        setDeliveryAddressValue('');
        setAddressNameValue('');
        setAddressPhoneNumberValue('');
        setAddressDetailInfoValue('');
        setAddressMainInfo({ postalCode: '', fullAddress: '' });
    }, []);

    const checkField = useCallback(() => {
        let isValid = true;

        if (!deliveryAddressValue) {
            setDeliveryAddressError("배송지를 입력하세요.");
            isValid = false;
        } else {
            setDeliveryAddressError('');
        }

        if (!addressNameValue) {
            setAddressNameError("이름을 입력하세요.");
            isValid = false;
        } else {
            setAddressNameError('');
        }

        if (!addressPhoneNumberValue) {
            setAddressPhoneNumberError("핸드폰 번호를 입력하세요.");
            isValid = false;
        } else {
            setAddressPhoneNumberError('');
        }

        if (!addressDetailInfoValue) {
            setAddressDetailInfoError("상세 주소를 입력하세요.");
            isValid = false;
        } else {
            setAddressDetailInfoError('');
        }

        if (!addressMainInfo.postalCode || !addressMainInfo.fullAddress) {
            setAddressMainInfoError("주소를 입력하세요.");
            isValid = false;
        } else {
            setAddressMainInfoError('');
        }

        return isValid;
    }, [deliveryAddressValue, addressNameValue, addressPhoneNumberValue, addressDetailInfoValue, addressMainInfo]);

    const insertMemberAddress = useCallback(async () => {
        if (!checkField()) return;

        try {
            const response = await axios.post(`${API_BASE_URL}/insertMemberAddress`, addressObject);
            alert(response.data.msg);
            resetAddAddress();
            fetchAddressInfo();
        } catch (error) {
            console.error('Failed to add address:', error);
        } finally {
            toggleModal('addAddress', false);
        }
    }, [checkField, addressObject, resetAddAddress, fetchAddressInfo]);

    const deleteMemberAddress = useCallback(async (memberAddressNo) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/deleteMemberAddress?memberAddressNo=${memberAddressNo}`);
            alert(response.data.msg);
            fetchAddressInfo();
        } catch (error) {
            console.error('Failed to delete address:', error);
        }
    }, [fetchAddressInfo]);

    const changeMainAddress = useCallback(async (memberAddressNo) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/changeMainAddress`, {
                memberId: profile?.sub || 'unknown',
                memberAddressNo
            });
            alert(response.data.msg);
            fetchAddressInfo();
        } catch (error) {
            console.error('Failed to change main address:', error);
        }
    }, [fetchAddressInfo, profile?.sub]);

    return (
        <>
            <Backdrop
                show={isOpen || isPurchaseOpen}
                onClick={() => {
                    if (isPurchaseOpen) {
                        closePurchase();
                    } else {
                        onClose();
                    }
                }}
            />
            <div className={`${styles.tradeMethod_side} ${tradeMethodClass}`}>
                <div className={styles.purchase_tradeMethod_container}>
                    <div className={styles.purchase_header}>
                        <span onClick={onClose}>
                            <img src='/img/x.png' alt='close' className={styles.x} />
                        </span>
                        <h2>원하시는 거래방법을 선택해주세요.</h2>
                    </div>
                    <div className={styles.purchase_main}>
                        <div
                            className={`${styles.direct} ${tradeMethodDeliveryClass}`}
                            onClick={selectTradeMethodDelivery}
                        >
                            <h3>택배거래</h3>
                            <p>원하는 주소로 판매자에게 택배로 받을 수 있어요.</p>
                        </div>
                        <div
                            className={`${styles.delivery} ${tradeMethodDirectClass}`}
                            onClick={selectTradeMethodDirect}
                        >
                            <h3>직거래</h3>
                            <p>채팅으로 약속을 정하고 현금없이 직접 만나 받을 수 있어요.</p>
                        </div>
                        <button className={styles.purchase_next} onClick={proceedToPurchase}>다음</button>
                    </div>
                </div>
            </div>
            <div className={`${styles.purchase_side} ${purchaseClass}`}>
                <div className={styles.purchase_container}>
                    <span onClick={closePurchase}>
                        <img src='/img/x.png' alt='close' className={styles.x} />
                    </span>
                    {tradeMethod === 1 ? (
                        <h2>택배거래로 구매</h2>
                    ) : (
                        <h2>직거래로 구매</h2>
                    )}
                    <div className={styles.purchase_productInfo}>
                        {productImage?.productImagePath ? (
                            <img src={productImage.productImagePath} alt='Product' />
                        ) : (
                            <p>상품 이미지를 불러올 수 없습니다.</p>
                        )}
                        <div>
                            <p>{productInfo.productTitle}</p>
                            <p className={styles.purchase_price}>{productInfo.productPrice.toLocaleString()}원</p>
                        </div>
                    </div>
                </div>
                <hr />
                {tradeMethod === 1 && (
                    <>
                        {mainAddressInfo.length > 0 ? (
                            <div className={styles.buyer_address}>
                                <h2>배송정보</h2>
                                {mainAddressInfo.map(info => (
                                    <div key={info.memberAddressNo} className={styles.buyer_address_info}>
                                        <h3>{info.addressName}</h3>
                                        <p>{info.memberName}</p>
                                        <p>{info.memberPhoneNumber}</p>
                                        <p>[{info.postalCode}] {info.address}</p>
                                    </div>
                                ))}
                                <button type='button' className={styles.change_address} onClick={() => toggleModal('address', true)}>변경</button>
                            </div>
                        ) : (
                            <div className={styles.no_address}>
                                <h2>배송지 설정</h2>
                                <p>배송지가 없습니다. 새로운 배송지를 추가해주세요.</p>
                                <button type='button' className={styles.addAddress} onClick={() => toggleModal('addAddress', true)}>배송지 추가</button>
                            </div>
                        )}
                    </>
                )}
                <hr />
                <div className={styles.buyMethod_container}>
                    <h2>결제방법</h2>
                    <div className={styles.buyMethod}>
                        {['kakaopay', 'tosspay', 'payco', 'html5_inicis'].map(method => (
                            <span
                                key={method}
                                className={`${styles.buyMethod} ${buyMethod === method ? styles.selected : ''}`}
                                onClick={() => setBuyMethod(method)}
                            >
                                {method.charAt(0).toUpperCase() + method.slice(1)}
                            </span>
                        ))}
                    </div>
                </div>
                <hr />
                <div className={styles.payment_amount}>
                    <div className={styles.last_price_container}>
                        <h2>최종 결제 금액</h2>
                        <p className={styles.last_price}>{productInfo.productPrice.toLocaleString()}원</p>
                    </div>
                    <Payment buyMethod={buyMethod} productNo={20} />
                </div>
            </div>
            <div className={`${styles.address_side} ${addressClass}`}>
                <img src='/img/back_arrow.png' alt='back' onClick={() => toggleModal('address', false)} className={styles.addressBack} />
                <h2>배송지 설정</h2>
                <div className={styles.addressEdit} onClick={() => toggleModal('edit', true)}>
                    <img src='/img/edit.png' alt='edit' />
                    <p>편집</p>
                </div>
                {addressInfo.length > 0 ? (
                    <>
                        {addressInfo.map(info => (
                            <div
                                key={info.memberAddressNo}
                                className={`${styles.addressInfo} ${selectedAddressId === info.memberAddressNo ? styles.selected : ''}`}
                                onClick={() => handleAddressClick(info.memberAddressNo)}
                            >
                                <div className={styles.mainAddressContainer}>
                                    <h3>{info.addressName}</h3>
                                    {info.mainAddress === 1 && <p className={styles.mainAddress}>배송지</p>}
                                </div>
                                <p>{info.memberName}</p>
                                <p>{info.memberPhoneNumber}</p>
                                <p>[{info.postalCode}] {info.address}</p>
                            </div>
                        ))}
                        <button className={styles.addAddress} onClick={() => toggleModal('addAddress', true)}>+ 배송지 추가</button>
                    </>
                ) : (
                    <div className={styles.no_address}>
                        <p>현재 저장된 배송지가 없습니다. 배송지를 추가해 주세요.</p>
                        <button className={styles.addAddress} onClick={() => toggleModal('addAddress', true)}>+ 배송지 추가</button>
                    </div>
                )}
            </div>
            <div className={`${styles.edit_side} ${editClass}`}>
                <img src='/img/back_arrow.png' alt='back' onClick={() => toggleModal('edit', false)} className={styles.addressBack} />
                <h2>배송지 편집</h2>
                {addressInfo.length > 0 ? (
                    <>
                        {addressInfo.map((info) => (
                            <div key={info.memberAddressNo} className={styles.editInfo}>
                                <div className={styles.mainAddressContainer}>
                                    <h3>{info.addressName}</h3>
                                    {info.mainAddress === 1 && <p className={styles.mainAddress}>배송지</p>}
                                </div>
                                <p>{info.memberName}</p>
                                <p>{info.memberPhoneNumber}</p>
                                <p>[{info.postalCode}] {info.address}</p>
                                <div className={styles.editBtn}>
                                    <button onClick={() => changeMainAddress(info.memberAddressNo)}>배송지 설정</button>
                                    <span></span>
                                    <button onClick={() => deleteMemberAddress(info.memberAddressNo)}>삭제</button>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className={styles.no_address}>
                        <p>현재 저장된 배송지가 없습니다. 배송지를 추가해 주세요.</p>
                    </div>
                )}
            </div>
            <div className={`${styles.addAddressSide} ${addAddressClass}`}>
                <img src='/img/back_arrow.png' alt='back' onClick={() => toggleModal('addAddress', false)} className={styles.addressBack} />
                <h2>배송지 추가</h2>
                <div className={styles.addAddressInfo}>
                    <input type='text' placeholder='배송지명 (최대 10글자)' maxLength={10} value={deliveryAddressValue} onChange={handleInputChange(setDeliveryAddressValue)} />
                    {deliveryAddressError && <p className={styles.errorMessage}>{deliveryAddressError}</p>}
                    <input type='text' placeholder='이름 입력' value={addressNameValue} onChange={handleInputChange(setAddressNameValue)} />
                    {addressNameError && <p className={styles.errorMessage}>{addressNameError}</p>}
                    <InputMask mask="999-9999-9999" maskChar={null} value={addressPhoneNumberValue} onChange={handleInputChange(setAddressPhoneNumberValue)}>
                        {(inputProps) => <input type='text' {...inputProps} placeholder='휴대폰 번호' />}
                    </InputMask>
                    {addressPhoneNumberError && <p className={styles.errorMessage}>{addressPhoneNumberError}</p>}
                    <Sub_address setAddressMainInfo={setAddressMainInfo} />
                    {addressMainInfoError && <p className={styles.errorMessage}>{addressMainInfoError}</p>}
                    <input type='text' placeholder='상세 주소(예시: 101동 101호)' value={addressDetailInfoValue} onChange={handleInputChange(setAddressDetailInfoValue)} />
                    {addressDetailInfoError && <p className={styles.errorMessage}>{addressDetailInfoError}</p>}
                </div>
                <button className={styles.editSubmit} onClick={insertMemberAddress}>추가</button>
            </div>
        </>
    );
};

export default SubSide;
