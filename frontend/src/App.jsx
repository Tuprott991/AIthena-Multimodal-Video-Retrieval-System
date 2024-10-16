import Main from "./components/Main";
import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";

function App() {
 return (
  <Routes>
   <Route path="/" element={<Layout />}>
    <Route path="/textsearch" element={<Main />} />
    <Route path="/imgsearch" element={<Main />} />
   </Route>
  </Routes>
 );
}

export default App;
