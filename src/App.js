import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminHeader from './admin/components/AdminHeader/AdminHeader';

function App() {
  return (
    <Router>
      <Routes>        
      <Route path="/admin" element={<AdminHeader />} />
      </Routes>
    </Router>
  );
}

