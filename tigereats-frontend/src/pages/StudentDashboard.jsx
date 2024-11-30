import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { getOrders, getRestaurants } from "../api/api";
import LogoutButton from "../components/LogoutButton";

const StudentDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentBalance, setStudentBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in. Redirecting to sign-in page.");
      navigate("/signin");
      return;
    }

    try {
      const decoded = jwtDecode(token); // Decode the JWT to get student_id
      setStudentId(decoded.student_id);
      setStudentName(decoded.first_name);
      setStudentBalance(decoded.balance);
    } catch (error) {
      alert("Invalid token. Please log in again.");
      localStorage.removeItem("token");
      navigate("/signin");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (studentId) {
      fetchOrders();
      fetchRestaurants();
    }
  }, [studentId]);

  const fetchOrders = async () => {
    try {
      const { data } = await getOrders(studentId);
      setOrders(data);
    } catch (error) {
      alert("Failed to fetch orders: " + error.response.data.error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const { data } = await getRestaurants();
      setRestaurants(data);
    } catch (error) {
      alert("Failed to fetch restaurants: " + error.response.data.error);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/student/order/${orderId}`);
  };

  const handleSelectRestaurant = (restaurantId) => {
    navigate(`/student/restaurant/${restaurantId}`);
  };

  return (
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>{studentName}'s Dashboard</h2>
          <LogoutButton />
        </div>
        <p>
          <strong>Balance:</strong> ${studentBalance}
        </p>

        <div className="card mb-4">
          <div className="card-header">
            <h3>Your Past Orders</h3>
          </div>
          <div className="card-body">
            {orders.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.order_id}>
                          <td>{order.order_id}</td>
                          <td>{new Date(order.order_date).toLocaleDateString()}</td>
                          <td>${order.total_amount}</td>
                          <td>{order.status}</td>
                          <td>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleViewOrder(order.order_id)}
                            >
                              View Summary
                            </button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            ) : (
                <p className="text-muted">No past orders available.</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Available Restaurants</h3>
          </div>
          <div className="card-body">
            {restaurants.length > 0 ? (
                <ul className="list-group">
                  {restaurants.map((restaurant) => (
                      <li
                          key={restaurant.restaurant_id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                      >
                  <span>
                    {restaurant.name} - {restaurant.location}
                  </span>
                        <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                                handleSelectRestaurant(restaurant.restaurant_id)
                            }
                        >
                          Order from here
                        </button>
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-muted">No restaurants available.</p>
            )}
          </div>
        </div>
      </div>
  );
};

export default StudentDashboard;
