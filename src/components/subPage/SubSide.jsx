import React, { useState, useEffect, useContext, useCallback } from 'react';
import InputMask from 'react-input-mask';
import Payment from './SubPayment';
import Backdrop from './SubOverlay';
import styles from './css/sub_purchase_side.module.css';
import axios from 'axios';
import Sub_address from './SubAddress';
import { AuthContext } from '../../services/AuthContext';

const Sub_side = ({ isOpen, onClose, productImage, productInfo }) => {
    // 로그인 정보 관리
    const { profile, isAuthenticated } = useContext(AuthContext);
    const [profileSub, setProfileSub] = useState(profile?.sub || null);

    useEffect(() => {
        console.log(profile);
        if (profile?.sub !== profileSub) {
            setProfileSub(profile?.sub || null);
        }
    }, [profile?.sub, profileSub]);

    // 상태 관리
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

    // 오류 관리
    const [deliveryAddressError, setDeliveryAddressError] = useState('');
    const [addressNameError, setAddressNameError] = useState('');
    const [addressPhoneNumberError, setAddressPhoneNumberError] = useState('');
    const [addressDetailInfoError, setAddressDetailInfoError] = useState('');
    const [addressMainInfoError, setAddressMainInfoError] = useState('');

    // 메시지 및 모달 상태
    const [subSideModalOpen, setSubSideModalOpen] = useState(false);
    const [subSideModalMsg, setSubSideModalMsg] = useState('');

    // 주소 정보 가져오기
    const fetchAddressInfo = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:9999/addressInfo?memberId=${profileSub}`);
            setAddressInfo(response.data);
        } catch (error) {
            console.error('주소 정보를 가져오는 데 실패했습니다:', error);
        }
    }, [profileSub]);

    useEffect(() => {
        fetchAddressInfo();
    }, [fetchAddressInfo]);

    useEffect(() => {
        const filteredMainAddresses = addressInfo.filter(info => info.mainAddress === 1);
        setMainAddressInfo(filteredMainAddresses);
    }, [addressInfo]);

    // 클래스 이름 설정
    const tradeMethodClass = isOpen ? styles.open : '';
    const purchaseClass = isPurchaseOpen ? styles.open : '';
    const addressClass = isAddressOpen ? styles.open : '';
    const editClass = isEditOpen ? styles.open : '';
    const addAddressClass = isAddAddress ? styles.open : '';

    const tradeMethodDeliveryClass = tradeMethod === 1 ? styles.selected : '';
    const tradeMethodDirectClass = tradeMethod === 2 ? styles.selected : '';

    // 거래 방법 선택
    const selectTradeMethodDelivery = useCallback(() => setTradeMethod(1), []);
    const selectTradeMethodDirect = useCallback(() => setTradeMethod(2), []);

    // 구매 진행
    const proceedToPurchase = useCallback(() => setIsPurchaseOpen(true), []);
    const closePurchase = useCallback(() => {
        setIsPurchaseOpen(false);
        addressClose();
        editClose();
        addAddressClose();
        onClose();
    }, [onClose]);

    // 주소 관련 열기/닫기
    const addressOpen = useCallback(() => setAddressOpen(true), []);
    const addressClose = useCallback(() => {setAddressOpen(false);}, []);
    const editOpen = useCallback(() => setEditOpen(true), []);
    const editClose = useCallback(() => setEditOpen(false), []);
    const addAddressOpen = useCallback(() => setAddAddressOpen(true), []);
    const addAddressClose = useCallback(() => setAddAddressOpen(false), []);

    const handleAddressClick = useCallback((id) => setSelectedAddressId(id), []);

    // 입력 값 변경 핸들러
    const handleDeliveryAddressChange = useCallback((event) => setDeliveryAddressValue(event.target.value), []);
    const handleAddressNameChange = useCallback((event) => setAddressNameValue(event.target.value), []);
    const handleAddressPhoneNumberChange = useCallback((event) => setAddressPhoneNumberValue(event.target.value), []);
    const handleAddressDetailInfoChange = useCallback((event) => setAddressDetailInfoValue(event.target.value), []);

    // 주소 객체
    const mainAddress = addressInfo.length > 0 ? 0 : 1;

    const obj = {
        memberId: profileSub,
        addressName: deliveryAddressValue,
        memberName: addressNameValue,
        memberPhoneNumber: addressPhoneNumberValue,
        postalCode: addressMainInfo.postalCode,
        address: `${addressMainInfo.fullAddress} ${addressDetailInfoValue}`.trim(),
        mainAddress: mainAddress
    };

    // 주소 폼 초기화
    const resetAddAddress = useCallback(() => {
        setDeliveryAddressValue('');
        setAddressNameValue('');
        setAddressPhoneNumberValue('');
        setAddressDetailInfoValue('');
        setAddressMainInfo({ postalCode: '', fullAddress: '' });
    }, []);

    // 필드 유효성 검사
    const checkField = useCallback(() => {
        let isValid = true;

        if (deliveryAddressValue === '') {
            setDeliveryAddressError("배송지를 입력하세요.");
            isValid = false;
        } else {
            setDeliveryAddressError('');
        }

        if (addressNameValue === '') {
            setAddressNameError("이름을 입력하세요.");
            isValid = false;
        } else {
            setAddressNameError('');
        }

        if (addressPhoneNumberValue === '') {
            setAddressPhoneNumberError("핸드폰 번호를 입력하세요.");
            isValid = false;
        } else {
            setAddressPhoneNumberError('');
        }

        if (addressDetailInfoValue === '') {
            setAddressDetailInfoError("상세 주소를 입력하세요.");
            isValid = false;
        } else {
            setAddressDetailInfoError('');
        }

        if (addressMainInfo.postalCode === '' || addressMainInfo.fullAddress === '') {
            setAddressMainInfoError("주소를 입력하세요.");
            isValid = false;
        } else {
            setAddressMainInfoError('');
        }

        return isValid;
    }, [deliveryAddressValue, addressNameValue, addressPhoneNumberValue, addressDetailInfoValue, addressMainInfo]);

    // 주소 추가
    const insertMemberAddress = useCallback(async () => {
        if (!checkField()) {
            return;
        }
        try {
            const response = await axios.post('http://localhost:9999/insertMemberAddress', obj);
            setSubSideModalMsg(response.data.msg);
            setSubSideModalOpen(true); // 모달 열기
            resetAddAddress(); // 주소 추가 후 폼 초기화
            fetchAddressInfo(); // 주소 정보 갱신
            setTimeout(() => {
                setSubSideModalOpen(false);
            }, 2000);
        } catch (error) {
            console.error(error);
        }
        addAddressClose();
    }, [checkField, obj, fetchAddressInfo, resetAddAddress, addAddressClose]);
    // 주소 삭제
    const deleteMemberAddress = useCallback(async (memberAddressNo, mainAddressNo) => {
        if(mainAddressNo == 1){
            setSubSideModalMsg('대표 배송지는 삭제 하실 수 없습니다');
            setSubSideModalOpen(true);
            setTimeout(() => {
                setSubSideModalOpen(false);
            }, 2000);
            return;
        }
        try {
            const response = await axios.delete(`http://localhost:9999/deleteMemberAddress?memberAddressNo=${memberAddressNo}`);
            setSubSideModalMsg(response.data.msg);
            setSubSideModalOpen(true); // 모달 열기
            fetchAddressInfo();
            setTimeout(() => {
                setSubSideModalOpen(false);
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    }, [fetchAddressInfo]);

    // 기본 주소 변경
    const changeMainAddress = useCallback(async (memberAddressNo, mainAddressNo) => {
        if(mainAddressNo == 1){
            return;
        }

        try {
            const response = await axios.put('http://localhost:9999/changeMainAddress', {
                memberId: profileSub,
                memberAddressNo: memberAddressNo
            });
            setSubSideModalMsg(response.data.msg);
            setSubSideModalOpen(true); // 모달 열기
            fetchAddressInfo();
            setTimeout(() => {
                setSubSideModalOpen(false);
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    }, [fetchAddressInfo, profileSub]);

    // 주소 클릭 시
    const handleAddressSelect = (id) => {
        handleAddressClick(id);
        if (isEditOpen) {
            setAddressNameValue(addressInfo.find(info => info.memberAddressNo === id)?.addressName || '');
            setAddressPhoneNumberValue(addressInfo.find(info => info.memberAddressNo === id)?.memberPhoneNumber || '');
            setDeliveryAddressValue(addressInfo.find(info => info.memberAddressNo === id)?.address || '');
            setAddressDetailInfoValue(addressInfo.find(info => info.memberAddressNo === id)?.detailAddress || '');
            setAddressMainInfo({
                postalCode: addressInfo.find(info => info.memberAddressNo === id)?.postalCode || '',
                fullAddress: addressInfo.find(info => info.memberAddressNo === id)?.fullAddress || ''
            });
        }
    };
    return (
        <>
            <Backdrop
                show={isOpen || isPurchaseOpen}
                onClick={() => {
                    if (isPurchaseOpen) {
                        closePurchase();
                    } else{
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
                                <button type='button' className={styles.change_address} onClick={addressOpen}>변경</button>
                            </div>
                        ) : (
                            <div className={styles.no_address}>
                                <h2>배송지 설정</h2>
                                <p>배송지가 없습니다. 새로운 배송지를 추가해주세요.</p>
                                <button type='button' className={styles.addAddress} onClick={addAddressOpen}>배송지 추가</button>
                            </div>
                        )}
                    </>
                )}
                <hr />
                <div className={styles.buyMethod_container}>
                    <h2>결제방법</h2>
                    <div className={styles.buyMethod}>
                        <span
                            className={`${styles.buyMethod} ${buyMethod === 'kakaopay' ? styles.selected : ''}`}
                            onClick={() => setBuyMethod('kakaopay')}
                        >
                            카카오페이
                        </span>
                        <span
                            className={`${styles.buyMethod} ${buyMethod === 'tosspay' ? styles.selected : ''}`}
                            onClick={() => setBuyMethod('tosspay')}
                        >
                            토스페이
                        </span>
                        <span
                            className={`${styles.buyMethod} ${buyMethod === 'payco' ? styles.selected : ''}`}
                            onClick={() => setBuyMethod('payco')}
                        >
                            PAYCO
                        </span>
                        <span
                            className={`${styles.buyMethod} ${buyMethod === 'html5_inicis' ? styles.selected : ''}`}
                            onClick={() => setBuyMethod('html5_inicis')}
                        >
                            카드결제
                        </span>
                    </div>
                </div>
                <hr />
                <div className={styles.payment_amount}>
                    <div className={styles.last_price_container}>
                        <h2>최종 결제 금액</h2>
                        <p className={styles.last_price}>{productInfo.productPrice.toLocaleString()}원</p>
                    </div>
                    <Payment buyMethod={buyMethod} productNo={19} />
                </div>
            </div>
            <div className={`${styles.address_side} ${addressClass}`}>
                <img src='/img/back_arrow.png' alt='back' onClick={addressClose} className={styles.addressBack} />
                <h2>배송지 설정</h2>
                <div className={styles.addressEdit} onClick={editOpen}>
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
                        <button className={styles.addAddress} onClick={addAddressOpen}>+ 배송지 추가</button>
                    </>
                ) : (
                    <div className={styles.no_address}>
                        <p>현재 저장된 배송지가 없습니다. 배송지를 추가해 주세요.</p>
                        <button className={styles.addAddress} onClick={addAddressOpen}>+ 배송지 추가</button>
                    </div>
                )}
            </div>
            <div className={`${styles.edit_side} ${editClass}`}>
                <img src='/img/back_arrow.png' alt='back' onClick={editClose} className={styles.addressBack} />
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
                                    <button onClick={() => changeMainAddress(info.memberAddressNo, info.mainAddress)} className={info.mainAddress == 1 ? styles.mainAddressColor : ''}>배송지 설정</button>
                                    <span></span>
                                    <button onClick={() => deleteMemberAddress(info.memberAddressNo, info.mainAddress)}>삭제</button>
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
                <img src='/img/back_arrow.png' alt='back' onClick={addAddressClose} className={styles.addressBack} />
                <h2>배송지 추가</h2>
                <div className={styles.addAddressInfo}>
                    <input type='text' placeholder='배송지명 (최대 10글자)' maxLength={10} value={deliveryAddressValue} onChange={handleDeliveryAddressChange} />
                    {deliveryAddressError && <p className={styles.errorMessage}>{deliveryAddressError}</p>}
                    <input type='text' placeholder='이름 입력' value={addressNameValue} onChange={handleAddressNameChange} />
                    {addressNameError && <p className={styles.errorMessage}>{addressNameError}</p>}
                    <InputMask mask="999-9999-9999" maskChar={null} value={addressPhoneNumberValue} onChange={handleAddressPhoneNumberChange}>
                        {(inputProps) => <input type='text' {...inputProps} placeholder='휴대폰 번호' />}
                    </InputMask>
                    {addressPhoneNumberError && <p className={styles.errorMessage}>{addressPhoneNumberError}</p>}
                    <Sub_address setAddressMainInfo={setAddressMainInfo} />
                    {addressMainInfoError && <p className={styles.errorMessage}>{addressMainInfoError}</p>}
                    <input type='text' placeholder='상세 주소(예시: 101동 101호)' value={addressDetailInfoValue} onChange={handleAddressDetailInfoChange} />
                    {addressDetailInfoError && <p className={styles.errorMessage}>{addressDetailInfoError}</p>}
                </div>
                <button className={styles.editSubmit} onClick={insertMemberAddress}>추가</button>
            </div>
            <div className={`${styles.subSideModal} ${subSideModalOpen ? styles.show : ''}`}>
                <p>{subSideModalMsg}</p>
            </div>
        </>
    );
};

export default Sub_side;
