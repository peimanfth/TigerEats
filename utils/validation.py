import re

def validate_email(email):
    # Basic email pattern
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email)

def validate_review_data(data):
    errors = []
    if "student_id" not in data or not isinstance(data["student_id"], int):
        errors.append("Invalid student ID.")

    if "restaurant_id" not in data or not isinstance(data["restaurant_id"], int):
        errors.append("Invalid restaurant ID.")

    if "rating" not in data or not (1 <= data["rating"] <= 5):
        errors.append("Rating must be between 1 and 5.")

    if "comments" in data and not isinstance(data["comments"], str):
        errors.append("Comments must be a string.")

    return errors if errors else None

def validate_order_data(data):
    errors = []
    if "student_id" not in data or not isinstance(data["student_id"], int):
        errors.append("Invalid student ID.")
        
    if "items" not in data or not isinstance(data["items"], list):
        errors.append("Order items must be a list.")
        
    if "total_amount" not in data or not isinstance(data["total_amount"], float):
        errors.append("Total amount must be a float.")
    
    return errors if errors else None

def validate_admin_data(data):
    errors = []
    if "username" not in data or not isinstance(data["username"], str):
        errors.append("Username is required and must be a string.")
    
    if "email" not in data or not validate_email(data["email"]):
        errors.append("A valid email is required.")
    
    if "password" not in data or not isinstance(data["password"], str):
        errors.append("Password is required and must be a string.")
    
    return errors if errors else None

def validate_restaurant_data(data):
    errors = []
    if "name" not in data or not isinstance(data["name"], str):
        errors.append("Restaurant name is required.")
    
    if "location" in data and not isinstance(data["location"], str):
        errors.append("Location must be a string.")
    
    return errors if errors else None

def validate_menu_item_data(data):
    errors = []
    if "restaurant_id" not in data or not isinstance(data["restaurant_id"], int):
        errors.append("A valid restaurant ID is required.")
    
    if "name" not in data or not isinstance(data["name"], str):
        errors.append("Menu item name is required.")
    
    if "price" not in data or not isinstance(data["price"], (float, int)):
        errors.append("Price must be a number.")
    
    return errors if errors else None
