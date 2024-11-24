import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMenuItems, placeOrder } from "../api/api";
import { jwtDecode } from "jwt-decode";

const RestaurantOrderPage = () => {
  const { restaurantId } = useParams(); // Get restaurant ID from URL
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

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
      console.log(orderData);
      await placeOrder(orderData);
      alert("Order placed successfully!");
      navigate("/student"); // Redirect back to dashboard
    } catch (error) {
      alert("Failed to place order: " + error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Menu for Restaurant {restaurantId}</h2>

      <div>
        <h3>Menu</h3>
        {menu.length > 0 ? (
          <ul>
            {menu.map((item) => (
              <li key={item.item_id}>
                <span>
                  {item.name} - ${item.price}{" "}
                  {item.availability ? "(Available)" : "(Unavailable)"}
                </span>
                {item.availability && (
                  <button onClick={() => handleAddToCart(item)}>
                    Add to Cart
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No menu items available.</p>
        )}
      </div>

      <div>
        <h3>Your Cart</h3>
        {cart.length > 0 ? (
          <ul>
            {cart.map((cartItem) => (
              <li key={cartItem.item_id}>
                <span>
                  {cartItem.quantity}x {cartItem.name} - $
                  {(cartItem.price * cartItem.quantity).toFixed(2)}
                </span>
                <button onClick={() => handleRemoveFromCart(cartItem.item_id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your cart is empty.</p>
        )}
        <button onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </div>
  );
};

export default RestaurantOrderPage;
