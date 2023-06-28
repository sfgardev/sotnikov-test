import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Album from "./pages/Album";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/album/:albumId" element={<Album />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
