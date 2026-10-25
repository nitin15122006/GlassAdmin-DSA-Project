import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Analytics from "./pages/Analytics";
import Forecast from "./pages/Forecast";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";
import DatasetUpload from "./pages/DatasetUpload";
import Payments from "./pages/Payments";
import Discounts from "./pages/Discounts";
import { getToken } from "./api";

function RequireAuth({ children }) {
  const location = useLocation();
  return getToken() ? children : <Navigate to="/login" replace state={{ from: location }} />;
}
export default function App() {
  return <Routes>
    <Route path="/login" element={getToken() ? <Navigate to="/" replace/> : <Login/>}/>
    <Route path="/register" element={getToken() ? <Navigate to="/" replace/> : <Register/>}/>
    <Route element={<RequireAuth><Layout/></RequireAuth>}>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/products" element={<Products/>}/>
      <Route path="/orders" element={<Orders/>}/>
      <Route path="/customers" element={<Customers/>}/>
      <Route path="/payments" element={<Payments/>}/>
      <Route path="/analytics" element={<Analytics/>}/>
      <Route path="/dataset" element={<DatasetUpload/>}/>
      <Route path="/forecast" element={<Forecast/>}/>
      <Route path="/discounts" element={<Discounts/>}/>
      <Route path="/reviews" element={<Reviews/>}/>
      <Route path="/settings" element={<Settings/>}/>
    </Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}
