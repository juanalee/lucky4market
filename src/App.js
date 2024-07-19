import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminMembers from './admin/components/AdminMembers/AdminMembers';
import AdminReports from './admin/components/AdminReports/AdminReports';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Navigate to="/admin/reports" />} />
        <Route path="/admin/members" element={<AdminMembers />} />
        <Route path="/admin/reports" element={<AdminReports />} />
      </Routes>
    </Router>
  );
}

export default App;