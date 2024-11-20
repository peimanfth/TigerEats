import pymysql
import json

class TigerEatsDatabasePopulator:
    def __init__(self, config_file):
        # Load database configuration from the JSON file
        with open(config_file, 'r') as file:
            config = json.load(file)
        
        # Initialize the connection using credentials from the config file
        connection_params = {
            'host': config['host'],
            'port': config['port'],
            'user': config['user'],
            'database': config['database']
        }
        
        if 'password' in config:
            connection_params['password'] = config['password']
        
        self.connection = pymysql.connect(**connection_params)


    def clear_data(self):
        """Remove all data from all tables."""
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")  # Disable foreign key checks
                tables = ["OrderDetails", "Orders", "MenuItems", "RestaurantHours", "Reviews", "Restaurants", "Students", "Admins"]
                for table in tables:
                    cursor.execute(f"DELETE FROM {table};")
                cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")  # Re-enable foreign key checks
            
            # Commit the changes
            self.connection.commit()
            print("All data cleared successfully!")
        finally:
            self.connection.close()

    def create_sample_data(self):
        try:
            with self.connection.cursor() as cursor:
                self._insert_admins(cursor)
                self._insert_students(cursor)
                self._insert_restaurants(cursor)
                self._insert_restaurant_hours(cursor)
                self._insert_menu_items(cursor)
                self._insert_orders(cursor)
                self._insert_order_details(cursor)
                self._insert_reviews(cursor)
            
            # Commit all the changes
            self.connection.commit()
            print("Sample data inserted successfully!")
        finally:
            self.connection.close()
    
    def _insert_admins(self, cursor):
        admins = [
            ("admin1", "admin1@example.com", "adminpassword1"),
            ("admin2", "admin2@example.com", "adminpassword2")
        ]
        for username, email, password in admins:
            cursor.execute(
                "INSERT INTO Admins (username, email, password) VALUES (%s, %s, %s)",
                (username, email, password)
            )

    def _insert_students(self, cursor):
        students = [
            ("John", "Doe", "john.doe@example.com", "password123", 50.00),
            ("Jane", "Smith", "jane.smith@example.com", "password123", 30.00),
            ("Mike", "Brown", "mike.brown@example.com", "password123", 25.00)
        ]
        for first_name, last_name, email, password, balance in students:
            cursor.execute(
                "INSERT INTO Students (first_name, last_name, email, password, balance) VALUES (%s, %s, %s, %s, %s)",
                (first_name, last_name, email, password, balance)
            )

    def _insert_restaurants(self, cursor):
        restaurants = [
            ("Tiger Grill", "LSU Student Union"),
            ("Campus Deli", "PFT Building"),
            ("The Dining Hall", "South Campus Road")
        ]
        for name, location in restaurants:
            cursor.execute(
                "INSERT INTO Restaurants (name, location) VALUES (%s, %s)",
                (name, location)
            )

    def _insert_restaurant_hours(self, cursor):
        restaurant_hours = [
            (1, "Monday", "08:00:00", "20:00:00"),
            (1, "Tuesday", "08:00:00", "20:00:00"),
            (2, "Monday", "10:00:00", "18:00:00"),
            (2, "Tuesday", "10:00:00", "18:00:00"),
            (3, "Monday", "09:00:00", "22:00:00"),
            (3, "Tuesday", "09:00:00", "22:00:00")
        ]
        for restaurant_id, day_of_week, open_time, close_time in restaurant_hours:
            cursor.execute(
                "INSERT INTO RestaurantHours (restaurant_id, day_of_week, open_time, close_time) VALUES (%s, %s, %s, %s)",
                (restaurant_id, day_of_week, open_time, close_time)
            )

    def _insert_menu_items(self, cursor):
        menu_items = [
            (1, "Grilled Chicken Sandwich", "Juicy grilled chicken sandwich with lettuce and tomato", 7.99, True),
            (1, "Cheeseburger", "Classic cheeseburger with fries", 8.49, True),
            (2, "Veggie Wrap", "Fresh veggie wrap with hummus and spinach", 6.99, True),
            (2, "BLT Sandwich", "Crispy bacon, lettuce, and tomato sandwich", 5.99, True),
            (3, "Pasta Alfredo", "Creamy Alfredo pasta with garlic bread", 9.99, True),
            (3, "Caesar Salad", "Classic Caesar salad with croutons", 4.99, True)
        ]
        for restaurant_id, name, description, price, availability in menu_items:
            cursor.execute(
                "INSERT INTO MenuItems (restaurant_id, name, description, price, availability) VALUES (%s, %s, %s, %s, %s)",
                (restaurant_id, name, description, price, availability)
            )

    def _insert_orders(self, cursor):
        orders = [
            (1, 16.48, "Completed"),
            (2, 9.99, "Pending"),
            (3, 12.98, "Completed")
        ]
        for student_id, total_amount, status in orders:
            cursor.execute(
                "INSERT INTO Orders (student_id, total_amount, status) VALUES (%s, %s, %s)",
                (student_id, total_amount, status)
            )

    def _insert_order_details(self, cursor):
        order_details = [
            (1, 1, 1, 7.99),
            (1, 2, 1, 8.49),
            (2, 5, 1, 9.99),
            (3, 3, 2, 12.98)
        ]
        for order_id, item_id, quantity, subtotal in order_details:
            cursor.execute(
                "INSERT INTO OrderDetails (order_id, item_id, quantity, subtotal) VALUES (%s, %s, %s, %s)",
                (order_id, item_id, quantity, subtotal)
            )

    def _insert_reviews(self, cursor):
        reviews = [
            (1, 1, 5, "Great food and quick service!"),
            (2, 2, 4, "Good sandwiches, but a bit slow."),
            (3, 3, 3, "Average experience, nothing special.")
        ]
        for student_id, restaurant_id, rating, comments in reviews:
            cursor.execute(
                "INSERT INTO Reviews (student_id, restaurant_id, rating, comments) VALUES (%s, %s, %s, %s)",
                (student_id, restaurant_id, rating, comments)
            )

# Usage
if __name__ == "__main__":
    # Specify the path to the configuration file
    config_file = "db_config.json"
    populator = TigerEatsDatabasePopulator(config_file)
    # populator.clear_data()  # Clear data before populating, if desired
    populator.create_sample_data()
