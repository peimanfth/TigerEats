import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders, getRestaurants } from "../api/api";

const StudentDashboard = ({ studentId }) => {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  // Fetch orders and restaurants when the component mounts
  useEffect(() => {
    fetchOrders();
    fetchRestaurants();
  }, []);

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
    <div>
      <h2>Student Dashboard</h2>

      <div>
        <h3>Your Past Orders</h3>
        {orders.length > 0 ? (
          <table>
            <thead>
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
                    <button onClick={() => handleViewOrder(order.order_id)}>
                      View Summary
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No past orders available.</p>
        )}
      </div>

      <div>
        <h3>Available Restaurants</h3>
        {restaurants.length > 0 ? (
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant.restaurant_id}>
                <span>
                  {restaurant.name} - {restaurant.location}
                </span>
                <button
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
          <p>No restaurants available.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
