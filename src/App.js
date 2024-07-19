<<<<<<< HEAD
import React from 'react';
import './App.css';
=======
import React from 'react'
import {Route, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminMembers from './admin/components/AdminMembers/AdminMembers';
import AdminReports from './admin/components/AdminReports/AdminReports';
import ProductRegistration from './components/productRegistration/ProductRegistration';
>>>>>>> 3bb1f58678105ccea3db6ccebaa2aaabf78083e0
import MyStore from './components/mypage/MyStore';


function App() {
  return (
<<<<<<< HEAD
    <div>
      <MyStore/>
    </div>
=======
    <Router>
      <Routes>
        <Route path="/admin" element={<Navigate to="/admin/reports" />} />
        <Route path="/admin/members" element={<AdminMembers />} />
        <Route path="/admin/reports" element={<AdminReports />} />          
        <Route path="/productRegister" element={<ProductRegistration/>} />
        <Route path="/myStore" element={<MyStore/>} />
      </Routes>
    </Router>
>>>>>>> 3bb1f58678105ccea3db6ccebaa2aaabf78083e0
  );
}

export default App;
