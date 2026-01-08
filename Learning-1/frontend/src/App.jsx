import "./index.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Createnote from "./pages/Createnote";
import Ratelimit from "./pages/Ratelimit";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Createnote />} />
        <Route path="/ratelimit" element={<Ratelimit />} />
      </Routes>
    </div>
  );
}

export default App;
