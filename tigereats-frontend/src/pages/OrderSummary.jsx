import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getReceipt, addReview } from "../api/api";
import {jwtDecode} from "jwt-decode";

const OrderSummary = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [review, setReview] = useState({ rating: "", comments: "" });
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setStudentId(decoded.student_id);
    }
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

  const handleSubmitReview = async () => {
    if (!review.rating || !review.comments) {
      alert("Please provide a rating and comments.");
      return;
    }

    try {
      const reviewData = {
        student_id: studentId,
        restaurant_id: orderDetails.restaurant_id, // Assuming this is part of the order details
        rating: parseInt(review.rating),
        comments: review.comments,
      };
      console.log(reviewData);
      await addReview(reviewData);
      alert("Thank you for your review!");
      setReview({ rating: "", comments: "" });
    } catch (error) {
      alert("Failed to submit review: " + error.response.data.error);
    }
  };

  return (
      <div className="container mt-5">
        <h2 className="text-center mb-4">Order Summary</h2>
        {orderDetails ? (
            <div className="card">
              <div className="card-body">
                <p>
                  <strong>Order ID:</strong> {orderDetails.order_id}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(orderDetails.order_date).toLocaleDateString()}
                </p>
                <h3>Items</h3>
                <ul className="list-group mb-3">
                  {orderDetails.items.map((item, index) => (
                      <li key={index} className="list-group-item">
                        {item.quantity}x {item.item_name} - ${item.subtotal}
                      </li>
                  ))}
                </ul>
                <p>
                  <strong>Total Amount:</strong> ${orderDetails.total_amount}
                </p>
              </div>
            </div>
        ) : (
            <p className="text-muted text-center">Loading order details...</p>
        )}

        {orderDetails && (
            <div className="card mt-4">
              <div className="card-header">
                <h3>Leave a Review</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="rating" className="form-label">
                    Rating (1-5):
                  </label>
                  <select
                      id="rating"
                      className="form-select"
                      value={review.rating}
                      onChange={(e) =>
                          setReview({ ...review, rating: e.target.value })
                      }
                  >
                    <option value="">Select a rating</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="comments" className="form-label">
                    Comments:
                  </label>
                  <textarea
                      id="comments"
                      className="form-control"
                      rows="3"
                      placeholder="Write your comments here..."
                      value={review.comments}
                      onChange={(e) =>
                          setReview({ ...review, comments: e.target.value })
                      }
                  />
                </div>
                <button
                    className="btn btn-primary w-100"
                    onClick={handleSubmitReview}
                >
                  Submit Review
                </button>
              </div>
            </div>
        )}
      </div>
  );
};

export default OrderSummary;
