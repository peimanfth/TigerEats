import React, { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "../api/api";

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await getAllOrders(); // Assuming this fetches all orders
      setOrders(data);
    } catch (error) {
      alert("Failed to fetch orders: " + error.response.data.error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      alert(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh the list
    } catch (error) {
      alert("Failed to update order status: " + error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Order Management</h2>

      {orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Student ID</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.student_id}</td>
                <td>${order.total_amount}</td>
                <td>{order.status}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.order_id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders available.</p>
      )}
    </div>
  );
};

export default AdminOrderManagement;
