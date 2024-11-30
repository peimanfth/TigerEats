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
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Admin Dashboard</h2>
          <LogoutButton />
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <h3>Add Restaurant</h3>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="restaurantName" className="form-label">
                Restaurant Name
              </label>
              <input
                  id="restaurantName"
                  type="text"
                  className="form-control"
                  placeholder="Restaurant Name"
                  value={newRestaurant.name}
                  onChange={(e) =>
                      setNewRestaurant({ ...newRestaurant, name: e.target.value })
                  }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                  id="location"
                  type="text"
                  className="form-control"
                  placeholder="Location"
                  value={newRestaurant.location}
                  onChange={(e) =>
                      setNewRestaurant({ ...newRestaurant, location: e.target.value })
                  }
              />
            </div>
            <button className="btn btn-primary w-100" onClick={handleAddRestaurant}>
              Add Restaurant
            </button>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <h3>Restaurant List</h3>
          </div>
          <div className="card-body">
            {restaurants.length > 0 ? (
                <table className="table table-striped">
                  <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Actions</th>
                    <th>Menu</th>
                  </tr>
                  </thead>
                  <tbody>
                  {restaurants.map((restaurant) => (
                      <tr key={restaurant.restaurant_id}>
                        <td>{restaurant.name}</td>
                        <td>{restaurant.location}</td>
                        <td>
                          <button
                              className="btn btn-danger btn-sm"
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
                              className="btn btn-secondary btn-sm"
                          >
                            Manage Menu
                          </Link>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            ) : (
                <p className="text-muted">No restaurants available.</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Manage Orders</h3>
          </div>
          <div className="card-body">
            <button className="btn btn-primary w-100" onClick={handleGoToOrders}>
              Go to Orders
            </button>
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;
