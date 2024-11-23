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
    <div>
      <h2>Manage Menu for Restaurant {restaurantId}</h2>

      <div>
        <h3>Add Menu Item</h3>
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) =>
            setNewItem({ ...newItem, description: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={newItem.availability}
            onChange={(e) =>
              setNewItem({ ...newItem, availability: e.target.checked })
            }
          />
          Available
        </label>
        <button onClick={handleAddItem}>Add Menu Item</button>
      </div>

      <div>
        <h3>Menu Items</h3>
        {menu.length > 0 ? (
          <table>
            <thead>
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
                    <button onClick={() => handleDeleteItem(item.item_id)}>
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        handleToggleAvailability(
                          item.item_id,
                          item.availability
                        )
                      }
                    >
                      {item.availability
                        ? "Mark Unavailable"
                        : "Mark Available"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No menu items available.</p>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
