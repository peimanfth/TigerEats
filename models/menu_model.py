from utils.db_connection import execute_query, fetch_data

def add_menu_item(data):
    query = "INSERT INTO MenuItems (restaurant_id, name, description, price, availability) VALUES (%s, %s, %s, %s, %s)"
    execute_query(query, (data['restaurant_id'], data['name'], data['description'], data['price'], data['availability']))
    return fetch_data("SELECT LAST_INSERT_ID() AS item_id")[0]['item_id']

def get_menu_items(restaurant_id):
    query = "SELECT * FROM MenuItems WHERE restaurant_id = %s"
    return fetch_data(query, (restaurant_id,))
