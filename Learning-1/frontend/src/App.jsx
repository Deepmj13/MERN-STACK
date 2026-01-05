import React from "react";
import "./index.css";
import { Routes, Route } from "react-router";

import Home from "./pages/Home";
import Createnote from "./pages/Createnote";
import Notedetails from "./pages/Notedetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<Createnote />} />
      <Route path="/note/:id" element={<Notedetails />} />
    </Routes>
  );
}

export default App;
