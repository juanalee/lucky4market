import React from 'react'
import {Route, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminMembers from './admin/components/AdminMembers/AdminMembers';
import AdminReports from './admin/components/AdminReports/AdminReports';
import ProductRegistration from './components/productRegistration/ProductRegistration';
import MyStore from './components/mypage/MyStore';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Navigate to="/admin/reports" />} />
        <Route path="/admin/members" element={<AdminMembers />} />
        <Route path="/admin/reports" element={<AdminReports />} />          
        <Route path="/productRegister" element={<ProductRegistration/>} />
        <Route path="/myStore" element={<MyStore/>} />
      </Routes>
    </Router>
  );
}

export default App;
