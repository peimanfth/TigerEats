import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getMenuItems,
  addMenuItem,
  deleteMenuItem,
  editMenuItem,
} from "../api/api";

const MenuManagement = () => {
  const { restaurantId } = useParams(); // Extract restaurantId from the URL
  const [menu, setMenu] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    availability: true,
  });

  useEffect(() => {
    fetchMenu();
  }, [restaurantId]);

  const fetchMenu = async () => {
    try {
      const { data } = await getMenuItems(restaurantId);
      setMenu(data);
    } catch (error) {
      alert("Failed to fetch menu: " + error.response.data.error);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) {
      alert("Name and price are required.");
      return;
    }
    try {
      const itemData = {
        ...newItem,
        restaurant_id: parseInt(restaurantId),
        price: parseFloat(newItem.price),
        availability: Boolean(newItem.availability),
      };
      await addMenuItem(itemData);
      alert("Menu item added successfully!");
      setNewItem({ name: "", description: "", price: "", availability: true });
      fetchMenu(); // Refresh the menu
    } catch (error) {
      alert("Failed to add menu item: " + error.response.data.error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await deleteMenuItem(itemId);
        alert("Menu item deleted successfully!");
        fetchMenu(); // Refresh the menu
      } catch (error) {
        alert("Failed to delete menu item: " + error.response.data.error);
      }
    }
  };

  const handleToggleAvailability = async (itemId, availability) => {
    try {
      await editMenuItem(itemId, { availability: !availability });
      alert("Menu item availability updated!");
      fetchMenu(); // Refresh the menu
    } catch (error) {
      alert("Failed to update availability: " + error.response.data.error);
    }
  };

  return (
      <div className="container mt-5">
        <h2 className="text-center mb-4">Manage Menu for Restaurant {restaurantId}</h2>

        <div className="card mb-4">
          <div className="card-header">
            <h3>Add Menu Item</h3>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="itemName" className="form-label">
                Name
              </label>
              <input
                  id="itemName"
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="itemDescription" className="form-label">
                Description
              </label>
              <input
                  id="itemDescription"
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                  }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="itemPrice" className="form-label">
                Price
              </label>
              <input
                  id="itemPrice"
                  type="number"
                  className="form-control"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              />
            </div>
            <div className="form-check mb-3">
              <input
                  id="itemAvailability"
                  type="checkbox"
                  className="form-check-input"
                  checked={newItem.availability}
                  onChange={(e) =>
                      setNewItem({ ...newItem, availability: e.target.checked })
                  }
              />
              <label htmlFor="itemAvailability" className="form-check-label">
                Available
              </label>
            </div>
            <button className="btn btn-primary w-100" onClick={handleAddItem}>
              Add Menu Item
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Menu Items</h3>
          </div>
          <div className="card-body">
            {menu.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Available</th>
                      <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {menu.map((item) => (
                        <tr key={item.item_id}>
                          <td>{item.name}</td>
                          <td>{item.description}</td>
                          <td>${item.price}</td>
                          <td>{item.availability ? "Yes" : "No"}</td>
                          <td>
                            <button
                                className="btn btn-danger btn-sm me-2"
                                onClick={() => handleDeleteItem(item.item_id)}
                            >
                              Delete
                            </button>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() =>
                                    handleToggleAvailability(item.item_id, item.availability)
                                }
                            >
                              {item.availability ? "Mark Unavailable" : "Mark Available"}
                            </button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            ) : (
                <p className="text-muted text-center">No menu items available.</p>
            )}
          </div>
        </div>
      </div>
  );
};

export default MenuManagement;
