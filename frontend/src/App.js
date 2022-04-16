import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Admin/Login";
import useToken from './components/Admin/useToken';
import ItemGroup from "./components/Items/ItemGroup";
import Items from "./components/Items/Items";
import InventoryAdj from "./components/Items/InventoryAdj";

function App() {
  const { token, setToken } = useToken();
  if (!token) {
    return (
      <div>
        <Routes>
          <Route path="/" element={<Login setToken={setToken} />} />
        </Routes>
      </div>
    );
  }
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/item-group" element={<ItemGroup />} />
        <Route path="/item" element={<Items />} />
        <Route path="/inv-adjustment" element={<InventoryAdj />} />
      </Routes>
    </div>
  );
}

export default App;
