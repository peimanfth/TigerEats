import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Admin APIs
export const adminSignUp = (data) => API.post("/admin/signup", data);
export const adminLogin = (data) => API.post("/admin/login", data);
export const addRestaurant = (data) => API.post("/admin/restaurant", data);
export const deleteRestaurant = (id) => API.delete(`/admin/restaurant/${id}`);
export const addMenuItem = (data) => API.post("/admin/menu_item", data);
export const deleteMenuItem = (id) => API.delete(`/admin/menu_item/${id}`);
export const editMenuItem = (id, data) =>
  API.patch(`/admin/menu_item/${id}`, data);

// Student APIs
export const studentSignUp = (data) => {
  console.log("Sign up data:", data);
  return API.post("/auth/signup", data);
};
export const studentLogin = (data) => API.post("/auth/login", data);
export const getRestaurants = () => API.get("/restaurants");
export const getMenuItems = (restaurantId) => API.get(`/menu/${restaurantId}`);
export const placeOrder = (data) => API.post("/order/", data);
export const getOrders = (studentId) => API.get(`/order/${studentId}`);
export const getReceipt = (orderId) => API.get(`/order/receipt/${orderId}`);
export const addReview = (data) => API.post("/review", data);
