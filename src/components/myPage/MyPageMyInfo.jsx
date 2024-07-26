import { useState } from "react";
import Header from "../header/Header";
import MyPageSideBar from "./MyPageSideBar";
import styles from "./css/MyPageMyInfo.module.css";


export default function MyPageMyInfo() {
  const [emailOption, setEmailOption] = useState('');

  const HandleEmailChange = (e) => {
    setEmailOption(e.target.value);
  };

  return (
    <div className={styles.my_info_header_container}>
      <Header/>
      <div className={styles.my_info_side_container}>
        <MyPageSideBar/>
        <div className={styles.my_info_container}>
          <div className={styles.my_infomation}>내 정보</div>
          <div className={styles.my_info_main_container}>
            <div className={styles.my_info_content}>프로필</div>
            <div className={styles.my_info_profile_image}>
              <div className={styles.my_info_profile_guide}><span className={styles.my_info_asterisk}>*</span>원하는 프로필 사진을 등록하세요.</div>
              <button className={styles.my_info_register_button}>등록</button>
              <button className={styles.my_info_delete_button}>삭제</button>
            </div>
            <div className={styles.my_info_content}>아이디<br/>
              <input className={styles.my_info_item} type="text" name="id" value="아이디" readOnly/>
            </div>
            <div className={styles.my_info_content}>암호<br/>
              <input className={styles.my_info_item} type="password" name="pw" placeholder="암호를 입력하세요." required/>
            </div>
            <div className={styles.my_info_content}>암호 확인<br/>
              <input className={styles.my_info_item} type="password" name="pw_check" placeholder="암호를 다시 입력하세요." required/>
            </div>
            <div className={styles.my_info_content}>이름<br/>
              <input className={styles.my_info_item} type="text" name="name" placeholder="이름" readOnly/>
            </div>
            <div className={styles.my_info_content}>닉네임<br/>
              <input className={styles.my_info_item} type="text" name="nick" placeholder="닉네임" required/>
            </div>
            <div className={styles.my_info_content}>이메일<br/>
              <input className={styles.my_info_email_item} type="text" name="email" defaultValue="user" required/>@
              {emailOption === "직접입력" ? (
                <input className={styles.my_info_email_item} type="text" name="email_direct" placeholder="직접입력" required/>
              ) : (
                <input className={styles.my_info_email_item} type="text" name="email_domain" value={emailOption} readOnly/>
              )}
              <select className={styles.my_info_select_email} onChange={HandleEmailChange}>
                <option value="naver.com">naver.com</option>
                <option value="daum.net">daum.net</option>
                <option value="gmail.com">gmail.com</option>
                <option value="nate.com">nate.com</option>
                <option value="직접입력">직접입력</option>
              </select>
            </div>
            <div className={styles.my_info_content}>주소<br/>
              <input className={styles.my_info_item} type="text" name="address" placeholder="주소" required/>
            </div>
            <div className={styles.my_info_button_container}>
              <button className={styles.my_info_update_button}>수정하기</button>
            </div>
            <div className={styles.my_info_button_container}>
              <button className={styles.my_info_withdrawal_button}>회원탈퇴</button>
            </div>
          </div>
        </div>
        <div className={styles.my_info_banner}>배너</div>
      </div>
    </div>
  );
};