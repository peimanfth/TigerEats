import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getReceipt } from "../api/api";

const OrderSummary = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await getReceipt(orderId);
      setOrderDetails(data);
    } catch (error) {
      alert("Failed to fetch order details: " + error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Order Summary</h2>
      {orderDetails ? (
        <div>
          <p>
            <strong>Order ID:</strong> {orderDetails.order_id}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(orderDetails.order_date).toLocaleDateString()}
          </p>
          <h3>Items</h3>
          <ul>
            {orderDetails.items.map((item, index) => (
              <li key={index}>
                {item.quantity}x {item.item_name} - ${item.subtotal}
              </li>
            ))}
          </ul>
          <p>
            <strong>Total Amount:</strong> ${orderDetails.total_amount}
          </p>
        </div>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

export default OrderSummary;
