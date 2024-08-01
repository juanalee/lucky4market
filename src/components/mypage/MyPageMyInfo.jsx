import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../header/Header";
import MyPageAddress from "./MyPageAddress";
import MyPageMemberId from "./MyPageMemberId";
import MyPageSideBar from "./MyPageSideBar";
import styles from "./css/MyPageMyInfo.module.css";

export default function MyPageMyInfo() {
  const [infoData, setInfoData] = useState([]);
  const [emailDomain, setEmailDomain] = useState('');
  const [emailOption, setEmailOption] = useState('');
  const [formData, setFormData] = useState({
    memberId: '',
    memberName: '',
    memberNick: '',
    memberPhoneNumber1: '',
    memberPhoneNumber2: '',
    memberPhoneNumber3: '',
    memberEmailId: '',
    memberEmailDomain: '',
    memberPostalCode: '',
    memberAddress: '',
    memberDetailAddress: '',
    memberPassword: '',
    memberPasswordConfirm: ''
  });

  const memberId = MyPageMemberId();
  const defaultProfileImage = "/img/mypage/profile.png";

  useEffect(() => {
    if (memberId) {
      const myInfoData = async () => {
        try {
          const response = await axios.get(`http://localhost:9999/api/member/myPageMyInfo/${memberId}`);
          const data = response.data[0] || {};
          setInfoData(response.data);
          setEmailDomain(data.memberEmailDomain || '');
          setFormData({
            memberId: data.memberId || '',
            memberName: data.memberName || '',
            memberNick: data.memberNick || '',
            memberPhoneNumber1: data.memberPhoneNumber1 || '',
            memberPhoneNumber2: data.memberPhoneNumber2 || '',
            memberPhoneNumber3: data.memberPhoneNumber3 || '',
            memberEmailId: data.memberEmailId || '',
            memberEmailDomain: data.memberEmailDomain || '',
            memberAddress: data.memberAddress || '',
            memberPostalCode: data.memberPostalCode || '',
            memberDetailAddress: data.memberDetailAddress || '',
            memberPassword: '',
            memberPasswordConfirm: ''
          });
        } catch (error) {
          console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
        }
      };
      myInfoData();
    }
  }, [memberId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'emailDomain') {
      setEmailDomain(value);
    }
  };

  const handleEmailChange = (e) => {
    const selectedOption = e.target.value;
    setEmailOption(selectedOption);
    setEmailDomain(selectedOption === "직접 입력" ? '' : selectedOption);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { memberPassword, memberPasswordConfirm, ...otherFields } = formData;
      if (memberPassword !== memberPasswordConfirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      await axios.put('http://localhost:9999/api/member/myPageMyInfo/update', {
        ...otherFields,
        memberPasswd : memberPassword,
        memberEmailDomain: emailDomain,
        memberAddress: formData.memberAddress,
        memberPostalCode: formData.memberPostalCode,
        memberDetailAddress: formData.memberDetailAddress,
        memberProfilePath: ''
      });

      alert("회원 정보 수정 완료");
    } catch (error) {
      console.error("회원 정보를 수정하는 중 오류가 발생했습니다.:", error);
      alert("회원 정보 수정 실패");
    }
  };

  return (
    <div className={styles.my_info_header_container}>
      {/* <Header/> */}
      <div className={styles.my_info_side_container}>
        <MyPageSideBar/>
        <div className={styles.my_info_container}>
          <div className={styles.my_infomation}>내 정보</div>
          <div className={styles.my_info_main_container}>
            <form onSubmit={handleFormSubmit}>
              {infoData.map((info, index) => (
                <div key={index}>
                  <div className={styles.my_info_content}>프로필
                    <div className={styles.my_info_profile_container1}>
                      <img
                        src={info.memberinfoPath ? info.memberProfilePath : defaultProfileImage}
                        alt="프로필 이미지"
                      />
                      <div className={styles.my_info_profile_container2}>
                        <div className={styles.my_info_profile_guide}><span className={styles.my_info_asterisk}>*</span>원하는 프로필 사진을 등록하세요.</div>
                        <div className={styles.my_info_button_container1}>
                          <input className={styles.my_info_choice_button} type="file"/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.my_info_content}>아이디<br/>
                    <input className={styles.my_info_item} type="text" name="memberId" value={formData.memberId} readOnly/>
                  </div>
                  <div className={styles.my_info_content}>비밀번호<br/>
                    <input className={styles.my_info_item} type="password" name="memberPassword" placeholder="비밀번호를 입력하세요." value={formData.memberPassword} onChange={handleChange} required/>
                  </div>
                  <div className={styles.my_info_content}>비밀번호 확인<br/>
                    <input className={styles.my_info_item} type="password" name="memberPasswordConfirm" placeholder="비밀번호를 다시 입력하세요." value={formData.memberPasswordConfirm} onChange={handleChange} required/>
                  </div>
                  <div className={styles.my_info_content}>이름<br/>
                    <input className={styles.my_info_item} type="text" name="memberName" value={formData.memberName} readOnly/>
                  </div>
                  <div className={styles.my_info_content}>닉네임<br/>
                    <input className={styles.my_info_item} type="text" name="memberNick" value={formData.memberNick} onChange={handleChange}/>
                  </div>
                  <div className={styles.my_info_content}>휴대폰 번호<br/>
                    <input className={styles.my_info_phone_number_item} type="text" name="memberPhoneNumber1" value={formData.memberPhoneNumber1} onChange={handleChange} required/>
                    <span>-</span>
                    <input className={styles.my_info_phone_number_item} type="text" name="memberPhoneNumber2" value={formData.memberPhoneNumber2} onChange={handleChange} required/>
                    <span>-</span>
                    <input className={styles.my_info_phone_number_item} type="text" name="memberPhoneNumber3" value={formData.memberPhoneNumber3} onChange={handleChange} required/>
                  </div>
                  <div className={styles.my_info_content}>이메일<br/>
                    <input className={styles.my_info_email_item} type="text" name="memberEmailId" value={formData.memberEmailId} onChange={handleChange} required/>
                    <span>@</span>
                    <input
                      className={styles.my_info_email_item}
                      type="text"
                      name="emailDomain"
                      value={emailDomain}
                      onChange={handleChange}
                      readOnly={emailOption !== "직접 입력"}
                      required
                    />
                    <select className={styles.my_info_select_email} onChange={handleEmailChange}>
                      <option value="">선택</option>
                      <option value="naver.com">naver.com</option>
                      <option value="daum.net">daum.net</option>
                      <option value="gmail.com">gmail.com</option>
                      <option value="nate.com">nate.com</option>
                      <option value="직접 입력">직접 입력</option>
                    </select>
                  </div>
                  <div className={styles.my_info_content}>주소<br/>
                  <MyPageAddress
                      postalCode={formData.memberPostalCode}
                      address={formData.memberAddress}
                      detailAddress={formData.memberDetailAddress}
                      onAddressChange={(postalCode, address, detailAddress) => {
                        setFormData(prevData => ({
                          ...prevData,
                          memberPostalCode: postalCode,
                          memberAddress: address,
                          memberDetailAddress: detailAddress
                        }));
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className={styles.my_info_button_container2}>
                <button className={styles.my_info_update_button} type="submit">수정하기</button>
              </div>
              <div className={styles.my_info_button_container2}>
                <button className={styles.my_info_withdrawal_button} type="button">탈퇴하기</button>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.my_info_banner}>배너</div>
      </div>
    </div>
  );
};