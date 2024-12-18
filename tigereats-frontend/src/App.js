import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import SignInForm from "./components/Auth/SignInForm";
import SignUpForm from "./components/Auth/SignUpForm";
import AdminDashboard from "./pages/AdminDashboard";
import MenuManagement from "./pages/MenuManagement";
import StudentDashboard from "./pages/StudentDashboard";
import OrderSummary from "./pages/OrderSummary";
import RestaurantOrderPage from "./pages/RestaurantOrderPage";
import AdminOrderManagement from "./pages/AdminOrderManagement";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/order/:orderId" element={<OrderSummary />} />
        <Route
          path="/student/restaurant/:restaurantId"
          element={<RestaurantOrderPage />}
        />
        <Route
          path="/admin/restaurant/:restaurantId/menu"
          element={<MenuManagement />}
        />
        <Route path="/admin/orders" element={<AdminOrderManagement />} />
        {/* <Route path="/student" element={<StudentDashboard />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
