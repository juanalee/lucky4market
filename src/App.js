import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminMembers from './admin/components/adminMembers/AdminMembers';
import AdminReports from './admin/components/adminReports/AdminReports';
import LoginForm from './components/auth/Login/LoginForm';
import IdPasswdRecovery from './components/auth/IdPasswdRecovery/IdPasswdRecovery';
import PreRegisterForm from './components/auth/Register/PreRegisterForm';
import RegisterForm from './components/auth/Register/RegisterForm';
import RegisterSuccess from './components/auth/Register/RegisterSuccess';
import NaverAuthCallback from './components/auth/Login/NaverAuthCallback';
import KakaoAuthCallback from './components/auth/Login/KakaoAuthCallback';
import ProductRegistration from './components/productRegistration/ProductRegistration';
import MypageProductSalesList from './components/myPage/MypageProductSalesList';
import MypageProductPurchaseHistory from './components/myPage/MypageProductPurchaseHistory';
import MyInfo from './components/myPage/MyInfo';
import MyStore from './components/myPage/MyStore';
import InterestProduct from './components/myPage/InterestProduct';
import ReceivedReview from './components/myPage/ReceivedReview';
import SubMain from './components/subPage/SubMain';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
import './services/AxiosSetup';
import { AuthProvider } from './services/AuthContext';
import {MainPage} from'./components/mainpage/MainPage';
import SearchBar from './components/mainpage/Search';
import MypageReviewList from './components/myPage/MypageReviewList';
import ProductRegistrationUpdate from './components/productRegistration/ProductRegistrationUpdate';

function App() {


  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/idPasswdRecovery" element={<IdPasswdRecovery />} />
          <Route path="/register" element={<PreRegisterForm />} />
          <Route path="/registerMember" element={<RegisterForm />} />
          <Route path="/registerSuccess" element={<RegisterSuccess />} />          
          <Route path="/naverAuthCallback" element={<NaverAuthCallback />} />
          <Route path="/kakaoAuthCallback" element={<KakaoAuthCallback />} />
          <Route path="/productPage" element={<SubMain />} />  
          <Route path="/search" element={<SearchBar />} />     
          <Route path="/productMainPage" element={<MainPage/>} />    
          <Route element={<RoleProtectedRoute requiredRole="ROLE_USER" />}>
            <Route path="/myStore" element={<MyStore/>}/>
            <Route path="/myInfo" element={<MyInfo />} />
            <Route path="/productRegister" element={<ProductRegistration />} />
            <Route path="/productRegisterUpdate/:productNo" element={<ProductRegistrationUpdate />} />
            <Route path="/sell-history" element={<MypageProductSalesList />} />       
            <Route path="/buy-history" element={<MypageProductPurchaseHistory />} />   
            <Route path="/writed-review" element={<MypageReviewList/>} />  
            <Route path="/interestProduct" element={<InterestProduct />} />
            <Route path="/receivedReview" element={<ReceivedReview />} />
          </Route>          
          <Route element={<RoleProtectedRoute requiredRole="ROLE_ADMIN" />}>
            <Route path="/admin" element={<Navigate to="/admin/reports" />} />
            <Route path="/admin/members" element={<AdminMembers />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;