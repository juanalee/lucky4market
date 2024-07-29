import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../header/Header";
import MyPageMemberId from "./MyPageMemberId";
import MyPageSideBar from "./MyPageSideBar";
import styles from "./css/MyPageMyInfo.module.css";

export default function MyPageMyInfo() {
  const [infoData, setInfoData] = useState([]);
  const [emailOption, setEmailOption] = useState('');
  const [emailDomain, setEmailDomain] = useState('');

  const memberId = MyPageMemberId();
  const defaultProfileImage = "/img/mypage/profile.png";

  const handleEmailChange = (e) => {
    const selectedOption = e.target.value;
    setEmailOption(selectedOption);
    if (selectedOption !== "직접 입력") {
      setEmailDomain(selectedOption);
      setInfoData(prevData =>
        prevData.map(info => ({
          ...info,
          memberEmailDomain: selectedOption
        }))
      );
    } else {
      setEmailDomain('');
    }
  };

  const handleEmailDomainChange = (e) => {
    const domain = e.target.value;
    setEmailDomain(domain);
    setInfoData(prevData =>
      prevData.map(info => ({
        ...info,
        memberEmailDomain: domain
      }))
    );
  };

  useEffect(() => {
    if (memberId) {
      const myInfoData = async () => {
        try {
          const infoResponse = await axios.get(`http://localhost:9999/api/member/myPageInfo/${memberId}`);
          setInfoData(infoResponse.data);
          if (infoResponse.data.length > 0) {
            setEmailDomain(infoResponse.data[0].memberEmailDomain);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      myInfoData();
    }
  }, [memberId]);

  return (
    <div className={styles.my_info_header_container}>
      {/* <Header/> */}
      <div className={styles.my_info_side_container}>
        <MyPageSideBar/>
        <div className={styles.my_info_container}>
          <div className={styles.my_infomation}>내 정보</div>
          <div className={styles.my_info_main_container}>
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
                  <input className={styles.my_info_item} type="text" name="id" value={info.memberId} readOnly/>
                </div>
                <div className={styles.my_info_content}>비밀번호<br/>
                  <input className={styles.my_info_item} type="password" name="pw" placeholder="비밀번호를 입력하세요." required/>
                </div>
                <div className={styles.my_info_content}>비밀번호 확인<br/>
                  <input className={styles.my_info_item} type="password" name="pw_check" placeholder="비밀번호를 다시 입력하세요." required/>
                </div>
                <div className={styles.my_info_content}>이름<br/>
                  <input className={styles.my_info_item} type="text" name="name" value={info.memberName} readOnly/>
                </div>
                <div className={styles.my_info_content}>닉네임<br/>
                  <input className={styles.my_info_item} type="text" name="nick" defaultValue={info.memberNick} required/>
                </div>
                <div className={styles.my_info_content}>휴대폰 번호<br/>
                  <input className={styles.my_info_item} type="text" name="phone" defaultValue={info.memberPhoneNumber} required/>
                </div>
                <div className={styles.my_info_content}>이메일<br/>
                  <input className={styles.my_info_email_item} type="text" name="email" defaultValue={info.memberEmailId} required/>@
                  <input
                    className={styles.my_info_email_item}
                    type="text"
                    name="email_domain"
                    value={emailDomain}
                    onChange={handleEmailDomainChange}
                    readOnly={emailOption !== "직접 입력"}
                    required
                  />
                  <select className={styles.my_info_select_email} onChange={handleEmailChange}>
                    <option value="">선택하세요</option>
                    <option value="naver.com">naver.com</option>
                    <option value="daum.net">daum.net</option>
                    <option value="gmail.com">gmail.com</option>
                    <option value="nate.com">nate.com</option>
                    <option value="직접 입력">직접 입력</option>
                  </select>
                </div>
                <div className={styles.my_info_content}>주소<br/>
                  <input className={styles.my_info_item} type="text" name="address" placeholder="주소" required/>
                </div>
              </div>
            ))}
            <div className={styles.my_info_button_container2}>
              <button className={styles.my_info_update_button}>수정하기</button>
            </div>
            <div className={styles.my_info_button_container2}>
              <button className={styles.my_info_withdrawal_button}>탈퇴하기</button>
            </div>
          </div>
        </div>
        <div className={styles.my_info_banner}>배너</div>
      </div>
    </div>
  );
};