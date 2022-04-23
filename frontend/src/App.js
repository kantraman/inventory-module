import React, {useState, useEffect} from "react";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Admin/Login";
import useToken from './components/Admin/useToken';
import ItemGroup from "./components/Items/ItemGroup";
import Items from "./components/Items/Items";
import InventoryAdj from "./components/Items/InventoryAdj";
import NavBar from "./components/Navigation/NavBar";
import Home from "./components/Navigation/Home";
import Logout from "./components/Admin/logout";
import Customer from "./components/Sales/Customer";
import SalesOrder from "./components/Sales/SalesOrder";
import SalesOrderDatewise from "./components/Sales/SalesOrderDatewise";

function App() {
  const { token, setToken } = useToken();
  const [navBarVisible, setNavBarVisible] = useState(true);
  const location = useLocation();
  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setNavBarVisible(false);
        break;
      default:
        if (!navBarVisible)
          setNavBarVisible(true);
    }
  }, [location]);
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
      <NavBar visible={navBarVisible}/>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/item-group" element={<ItemGroup />} />
        <Route path="/item" element={<Items />} />
        <Route path="/inv-adjustment" element={<InventoryAdj />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/sales-order" element={<SalesOrder />} />
        <Route path="/view-so" element={<SalesOrderDatewise />} />
      </Routes>
    </div>
  );
}

export default App;
