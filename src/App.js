import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import './App.css';
import ProductRegistration from './components/productRegistration/ProductRegistration';

function App() {
  return (
    <div>
    <Router>
   
      
      <Routes>
        <Route path="/" element={<ProductRegistration/>} />    
  
      </Routes>
    </Router>
   
    </div>
  );
}

export default App;
