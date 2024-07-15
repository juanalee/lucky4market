import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminMembers from './admin/components/AdminMembers/AdminMembers';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/members" element={<AdminMembers />} />
      </Routes>
    </Router>
  );
}

export default App;