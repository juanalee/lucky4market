import { BrowserRouter , Route, Routes } from "react-router-dom";
import Main from "./components/sub_page/Sub_main";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
