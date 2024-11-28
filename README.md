# **TigerEats Project Setup Guide**

This guide provides step-by-step instructions to set up and run the TigerEats project, including backend and frontend components.

---

## **1. Prerequisites**

Ensure the following are installed on your system:

- **MySQL**
- **Python 3.x**
- **Node.js and npm**

---

## **2. Setting up the MySQL Database**

### **Step 1: Configure MySQL**

1. Start your MySQL server.
2. Create a MySQL user with appropriate permissions (or use the root user).

### **Step 2: Configure `db_config.json`**

1. Navigate to the root directory of the project.
2. Open the `db_config.json` file.
3. Set your MySQL username and password:

   ```json
   {
     "user": "your_username",
     "password": "your_password"
   }
   ```

4. If no password is set for your MySQL server, remove the `password` attribute and save the file. Please make sure to **delete both the key and value** in the file if you have not set a password for your MySQL user.

---

## **3. Installing Backend Dependencies**

1. While at the root directory of the project run the shell command below to install dependancies for the python backend inside your current `Python pip`
   ```bash
   pip install -r requirements.txt
   ```
2. make sure to use the same `Python` environment for next steps when running the backend

---

## **4. Setting up the Database**

1. While at the root directory of the project navigate to the `Database` directory.
   ```bash
   cd ./Database
   ```
2. run the `createDB.sql` file to initialize the TigerEats database in MySQL.
   ``
3. run the `TigerEatsSchema.sql` file to generate all the tables for the TigerEats database in MySQL.
4. run the `TigerEatsDatabasePopulator.py` file to populate the database with initial data.
5. While at the `Database`of the project navigate to the `queries` directory.
   ```bash
   cd ./queries
   ```
   here you can execute each of the 5 queries to test the database. for information about the purpose of each query please refer to the project report.

---

## **5. Running the Backend**

### **Step 1: Running the flask app**

while at the root directory of the project, run the following to start up the backend server.

```bash
   python app.py
```

### **Step 2: Checking the API Endpoints(optional)**

Navigate to `http://localhost:3000` or the address stated by `flask` to check all the existing `API Endpoints`.

---

## **6. Setting up the Frontend**

open a new terminal window while at the root directory of project and run the following commands to get the react frontend up and running.

```bash
 cd ./tigereats-frontend
 npm install
 npm start
```

the frontend application should be starting shortly in your browser. if not navigate to `http://localhost:3000/signup` or the address stated by your `node package manager`

---

## **7. Navigating the Frontend**

1. Sign In/Sign Up Pages
   URL: /signin or /signup
   Students and admins can log in or register accounts.
   Redirects to the appropriate dashboard after login.
2. Admin Dashboard
   URL: /admin
   Admin features:
   Add/Delete restaurants.
   View and manage orders (navigate to /admin/orders).
   Update order statuses.
3. Student Dashboard
   URL: /student
   Student features:
   View balance.
   See past orders.
   Browse restaurants.
4. Restaurant Order Page
   URL: /student/restaurant/:restaurantId
   Students can:
   View the menu.
   Add items to their cart.
   Place orders.
   Click on menu item names to view descriptions in a popup.
5. Order Summary Page
   URL: /student/order/:orderId
   Students can:
   View their receipt.
   Leave a review for the restaurant.

---

## **8. Notes**

Ensure the backend is running on http://localhost:5000 and the frontend on http://localhost:3000.
For any issues with database connectivity, verify the db_config.json file and ensure your MySQL server is running. If there are still errors, please contact us at `pfotou1@lsu.edu` for further clarification.
