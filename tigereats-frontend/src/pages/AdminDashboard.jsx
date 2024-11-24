import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addRestaurant, deleteRestaurant, getRestaurants } from "../api/api";
import LogoutButton from "../components/LogoutButton";

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    location: "",
  });
  const navigate = useNavigate();

  // Fetch restaurants when the component mounts
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data } = await getRestaurants();
      setRestaurants(data);
    } catch (error) {
      alert("Failed to fetch restaurants: " + error.response.data.error);
    }
  };

  const handleAddRestaurant = async () => {
    if (!newRestaurant.name || !newRestaurant.location) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await addRestaurant(newRestaurant);
      alert("Restaurant added successfully!");
      setNewRestaurant({ name: "", location: "" });
      fetchRestaurants(); // Refresh the list
    } catch (error) {
      alert("Failed to add restaurant: " + error.response.data.error);
    }
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      console.log("Restaurant ID:", restaurantId);
      try {
        await deleteRestaurant(restaurantId);
        alert("Restaurant deleted successfully!");
        fetchRestaurants(); // Refresh the list
      } catch (error) {
        alert("Failed to delete restaurant: " + error.response.data.error);
      }
    }
  };

  const handleGoToOrders = () => {
    navigate("/admin/orders");
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <LogoutButton />

      <div>
        <h3>Add Restaurant</h3>
        <input
          type="text"
          placeholder="Restaurant Name"
          value={newRestaurant.name}
          onChange={(e) =>
            setNewRestaurant({ ...newRestaurant, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Location"
          value={newRestaurant.location}
          onChange={(e) =>
            setNewRestaurant({ ...newRestaurant, location: e.target.value })
          }
        />
        <button onClick={handleAddRestaurant}>Add Restaurant</button>
      </div>

      <div>
        <h3>Restaurant List</h3>
        {restaurants.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant.restaurant_id}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.location}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleDeleteRestaurant(restaurant.restaurant_id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <Link
                      to={`/admin/restaurant/${restaurant.restaurant_id}/menu`}
                    >
                      Manage Menu
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No restaurants available.</p>
        )}
      </div>

      <div>
        <h3>Manage Orders</h3>
        <button onClick={handleGoToOrders}>Go to Orders</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
