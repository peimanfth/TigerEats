from utils.db_connection import execute_query, fetch_data

def create_admin(data):
    query = """
    INSERT INTO Admins (username, email, password, role)
    VALUES (%s, %s, %s, %s)
    """
    execute_query(query, (data['username'], data['email'], data['password'], data.get('role', 'admin')))
    return fetch_data("SELECT LAST_INSERT_ID() AS admin_id")[0]['admin_id']

def get_admin_by_username(username):
    query = "SELECT * FROM Admins WHERE username = %s"
    result = fetch_data(query, (username,))
    return result[0] if result else None

def create_restaurant(data):
    query = """
    INSERT INTO Restaurants (name, location)
    VALUES (%s, %s)
    """
    execute_query(query, (data['name'], data.get('location')))
    return fetch_data("SELECT LAST_INSERT_ID() AS restaurant_id")[0]['restaurant_id']

def create_menu_item(data):
    query = """
    INSERT INTO MenuItems (restaurant_id, name, description, price, availability)
    VALUES (%s, %s, %s, %s, %s)
    """
    execute_query(query, (data['restaurant_id'], data['name'], data.get('description', ''), data['price'], data.get('availability', True)))
    return fetch_data("SELECT LAST_INSERT_ID() AS item_id")[0]['item_id']

def delete_menu_item(item_id):
    """Delete a menu item by its ID"""
    query = "DELETE FROM MenuItems WHERE item_id = %s"
    execute_query(query, (item_id,))

def update_menu_item_availability(item_id, availability):
    query = "UPDATE MenuItems SET availability = %s WHERE item_id = %s"
    execute_query(query, (availability, item_id))

def update_student_balance(student_id, balance):
    query = "UPDATE Students SET balance = %s WHERE student_id = %s"
    execute_query(query, (balance, student_id))


def get_all_restaurants():
    """Fetch all restaurants from the database"""
    query = "SELECT restaurant_id, name, location FROM Restaurants"
    return fetch_data(query)

def delete_restaurant(restaurant_id):
    """Delete a restaurant by ID"""
    query = "DELETE FROM Restaurants WHERE restaurant_id = %s"
    execute_query(query, (restaurant_id,))


def update_order_status(order_id, new_status):
    """Update the status of an order"""
    query = "UPDATE Orders SET status = %s WHERE order_id = %s"
    execute_query(query, (new_status, order_id))
