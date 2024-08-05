import { useState, useEffect } from 'react';

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

const MyPageMemberId = () => {
  const [memberId, setMemberId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      const memberId = decoded.sub;  // JWT의 페이로드에 'sub' 클레임으로 'memberId'가 저장됨
      setMemberId(memberId);
      console.log("MemberID: " + memberId);
    } else {
      console.log("토큰이 없습니다.");
    }
  }, []);

  return memberId;
};

export default MyPageMemberId;