import { BrowserRouter , Route, Routes } from "react-router-dom";
import Sub_page from "./components/Sub_page";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Sub_page />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
