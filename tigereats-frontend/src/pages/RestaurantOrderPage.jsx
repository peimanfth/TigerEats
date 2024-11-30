import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMenuItems, placeOrder } from "../api/api";
import { jwtDecode} from "jwt-decode";

const RestaurantOrderPage = () => {
  const { restaurantId } = useParams(); // Get restaurant ID from URL
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // To store the selected item for the popup

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const { data } = await getMenuItems(restaurantId);
      setMenu(data);
    } catch (error) {
      alert("Failed to fetch menu: " + error.response.data.error);
    }
  };

  const handleAddToCart = (item) => {
    const existingItem = cart.find(
        (cartItem) => cartItem.item_id === item.item_id
    );
    if (existingItem) {
      setCart(
          cart.map((cartItem) =>
              cartItem.item_id === item.item_id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
          )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (itemId) => {
    setCart(cart.filter((cartItem) => cartItem.item_id !== itemId));
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const orderItems = cart.map((cartItem) => ({
      item_id: cartItem.item_id,
      quantity: cartItem.quantity,
    }));

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const studentId = decoded.student_id;

      const orderData = {
        student_id: studentId,
        items: orderItems,
      };

      await placeOrder(orderData);
      alert("Order placed successfully!");
      navigate("/student"); // Redirect back to dashboard
    } catch (error) {
      alert("Failed to place order: " + error.response.data.error);
    }
  };

  const handleShowDescription = (item) => {
    setSelectedItem(item); // Set the selected item for the popup
  };

  const handleClosePopup = () => {
    setSelectedItem(null); // Close the popup
  };

  return (
      <div className="container mt-5">
        <h2 className="text-center mb-4">Menu for Restaurant {restaurantId}</h2>

        <div className="mb-4">
          <h3>Menu</h3>
          {menu.length > 0 ? (
              <ul className="list-group">
                {menu.map((item) => (
                    <li key={item.item_id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                  <span
                      className="text-primary text-decoration-underline"
                      role="button"
                      onClick={() => handleShowDescription(item)}
                  >
                    {item.name}
                  </span>{" "}
                        - ${item.price}{" "}
                        {item.availability ? "(Available)" : "(Unavailable)"}
                      </div>
                      {item.availability && (
                          <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleAddToCart(item)}
                          >
                            Add to Cart
                          </button>
                      )}
                    </li>
                ))}
              </ul>
          ) : (
              <p className="text-muted">No menu items available.</p>
          )}
        </div>

        <div className="mb-4">
          <h3>Your Cart</h3>
          {cart.length > 0 ? (
              <ul className="list-group">
                {cart.map((cartItem) => (
                    <li key={cartItem.item_id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        {cartItem.quantity}x {cartItem.name} - $
                        {(cartItem.price * cartItem.quantity).toFixed(2)}
                      </div>
                      <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveFromCart(cartItem.item_id)}
                      >
                        Remove
                      </button>
                    </li>
                ))}
              </ul>
          ) : (
              <p className="text-muted">Your cart is empty.</p>
          )}
          <button className="btn btn-primary w-100 mt-3" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>

        {/* Popup for Item Description */}
        {selectedItem && (
            <div
                className="modal show d-block"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                onClick={handleClosePopup}
            >
              <div
                  className="modal-dialog modal-dialog-centered"
                  onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{selectedItem.name}</h5>
                    <button className="btn-close" onClick={handleClosePopup}></button>
                  </div>
                  <div className="modal-body">
                    <p>{selectedItem.description}</p>
                  </div>
                  <div className="modal-footer">
                    <button
                        className="btn btn-secondary"
                        onClick={handleClosePopup}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default RestaurantOrderPage;
