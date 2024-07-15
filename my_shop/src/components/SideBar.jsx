import React from 'react';
import '../css/SideBar.css';

const SideBar = () => {
  return (
    <div className="side_bar">
      <tr>
        <td>
          <div className="my_page">마이 페이지</div>
        </td>
        <td>
          <a href="#" className="my_info">내 정보</a>
        </td>
        <td>
          <a href="#" className="buy_history">구매 내역</a>
        </td>
        <td>
          <a href="#" className="sell_history">판매 내역</a>
        </td>
        <td>
          <a href="#" className="interest_product">관심 상품</a>
        </td>
        <td>
          <a href="#" className="writed_review">작성 후기</a>
        </td>
        <td>
          <a href="#" className="received_review">받은 후기</a>
        </td>
        <td>
          <a href="#" className="follow_list">팔로우 목록</a>
        </td>
      </tr>
    </div>
  );
};

export default SideBar;