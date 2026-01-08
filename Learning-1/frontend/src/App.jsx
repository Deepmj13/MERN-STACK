import React from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Createnote from "./pages/Createnote";
import Notedetails from "./pages/Notedetails";
import Ratelimit from "./pages/Ratelimit";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Createnote />} />
        <Route path="/note/:id" element={<Notedetails />} />
        <Route path="/ratelimit" element={<Ratelimit />} />
      </Routes>
    </div>
  );
}

export default App;
