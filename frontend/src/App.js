import React, {useState, useEffect} from "react";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Admin/Login";
import useToken from './components/Admin/useToken';
import ItemGroup from "./components/Items/ItemGroup";
import Items from "./components/Items/Items";
import InventoryAdj from "./components/Items/InventoryAdj";
import ItemAdjDatewise from "./components/Items/ItemAdjDatewise";
import NavBar from "./components/Navigation/NavBar";
import Home from "./components/Navigation/Home";
import Logout from "./components/Admin/logout";
import Customer from "./components/Sales/Customer";
import SalesOrder from "./components/Sales/SalesOrder";
import SalesOrderDatewise from "./components/Sales/SalesOrderDatewise";
import Package from "./components/Sales/Package";
import DeliveryChallan from "./components/Sales/DeliveryChallan";
import Invoice from "./components/Sales/Invoice";
import PaymentReceived from './components/Sales/PaymentsReceived';
import PaymentReceivedDatewise from './components/Sales/PaymentReceivedDatewise';
import PaymentsRecTab from "./components/Sales/PaymentsRecTab";
import SalesReturn from "./components/Sales/SalesReturn";
import CreditNote from "./components/Sales/CreditNote";
import Vendor from "./components/Purchase/Vendor";
import PurchaseOrder from "./components/Purchase/PurchaseOrder";
import PurchaseOrderDatewise from "./components/Purchase/PurchaseOrderVendorDatewise";
import Bill from "./components/Purchase/BillsPayable";
import BillPayment from "./components/Purchase/BillPayment";
import BillPaymentDatewise from "./components/Purchase/BillPaymentsDatewise";
import VendorCreditNote from "./components/Purchase/VendorCreditNote";
import ReportViewer from "./components/Reports/ReportViewer";
import CreateUser from "./components/Admin/CreateUser";

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
          <Route path="*" element={<Login setToken={setToken} />} />
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
        <Route path="/inv-adjustment" element={<PaymentsRecTab tab1={<InventoryAdj />}
          tab2={<ItemAdjDatewise />} />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/sales-order" element={<SalesOrder />} />
        <Route path="/view-so" element={<SalesOrderDatewise />} />
        <Route path="/package" element={<Package />} />
        <Route path="/challan" element={<DeliveryChallan />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/payments-rec" element={<PaymentsRecTab tab1={<PaymentReceived />}
          tab2={<PaymentReceivedDatewise />} />} />
        <Route path="/sales-returns" element={<SalesReturn />} />
        <Route path="/credit-note" element={<CreditNote />} />
        <Route path="/vendor" element={<Vendor />} />
        <Route path="/purchase-order" element={<PaymentsRecTab tab1={<PurchaseOrder />}
          tab2={<PurchaseOrderDatewise />} />} />
        <Route path="/bills" element={<Bill />} />
        <Route path="/bill-payment" element={<PaymentsRecTab tab1={<BillPayment />}
          tab2={<BillPaymentDatewise />} />} />
        <Route path="/vendor-credit" element={<VendorCreditNote />} />
        <Route path="/reports" element={<ReportViewer />} />
        <Route path="/signup" element={<CreateUser />} />
      </Routes>
    </div>
  );
}

export default App;
