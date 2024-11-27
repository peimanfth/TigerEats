import pymysql
import json

class TigerEatsDatabasePopulator:
    def __init__(self, config_file):
        with open(config_file, 'r') as file:
            config = json.load(file)
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
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
                tables = ["OrderDetails", "Orders", "MenuItems", "RestaurantHours", "Reviews", "Restaurants", "Students", "Admins"]
                for table in tables:
                    cursor.execute(f"DELETE FROM {table};")
                cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
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
            self.connection.commit()
            print("Sample data inserted successfully!")
        finally:
            self.connection.close()
    
    def _insert_admins(self, cursor):
        admins = [
            ("admin1", "admin1@lsu.edu", "adminpassword1"),
            ("admin2", "admin2@lsu.edu", "adminpassword2")
        ]
        for username, email, password in admins:
            cursor.execute(
                "INSERT INTO Admins (username, email, password) VALUES (%s, %s, %s)",
                (username, email, password)
            )

    def _insert_students(self, cursor):
        students = [
            ("John", "Doe", f"john.doe@lsu.edu", "password123", 50.00),
            ("Jane", "Smith", f"jane.smith@lsu.edu", "password123", 45.00),
            ("Mike", "Brown", f"mike.brown@lsu.edu", "password123", 30.00),
            ("Emily", "Davis", f"emily.davis@lsu.edu", "password123", 25.00),
            ("Alex", "Taylor", f"alex.taylor@lsu.edu", "password123", 20.00)
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
            ("The Dining Hall", "South Campus Road"),
            ("Union Bistro", "Union Square"),
            ("Green Leaf Cafe", "Library Circle")
        ]
        for name, location in restaurants:
            cursor.execute(
                "INSERT INTO Restaurants (name, location) VALUES (%s, %s)",
                (name, location)
            )

    def _insert_restaurant_hours(self, cursor):
        restaurant_hours = []
        for restaurant_id in range(1, 6):
            days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
            if restaurant_id <= 2:  # These restaurants work on Sunday as well
                days.append("Sunday")
            for day in days:
                restaurant_hours.append((restaurant_id, day, "08:00:00", "20:00:00"))
        for restaurant_id, day_of_week, open_time, close_time in restaurant_hours:
            cursor.execute(
                "INSERT INTO RestaurantHours (restaurant_id, day_of_week, open_time, close_time) VALUES (%s, %s, %s, %s)",
                (restaurant_id, day_of_week, open_time, close_time)
            )
    def _insert_menu_items(self, cursor):
        menu_items = [
            # Tiger Grill
            (1, "Grilled Chicken Sandwich", "Juicy grilled chicken with fresh lettuce and tomato on a toasted bun", 7.99, True),
            (1, "Classic Cheeseburger", "Beef patty with melted cheese, lettuce, tomato, and a side of fries", 8.49, True),
            (1, "BBQ Pulled Pork Sandwich", "Tender pulled pork smothered in BBQ sauce, served with coleslaw", 9.49, True),
            (1, "Crispy Chicken Tenders", "Golden-fried chicken tenders with honey mustard sauce", 6.99, True),
            (1, "Buffalo Wings", "Spicy buffalo wings served with ranch dipping sauce", 8.99, True),

            # Campus Deli
            (2, "Veggie Wrap", "Fresh veggies wrapped in a spinach tortilla with hummus spread", 6.99, True),
            (2, "BLT Sandwich", "Bacon, lettuce, and tomato served on toasted sourdough bread", 5.99, True),
            (2, "Turkey Club", "Smoked turkey, crispy bacon, lettuce, and tomato on multigrain bread", 7.99, True),
            (2, "Tuna Salad Sandwich", "Creamy tuna salad served on a soft ciabatta roll", 6.49, True),
            (2, "Avocado Toast", "Toasted bread topped with smashed avocado and a sprinkle of chili flakes", 5.99, True),

            # The Dining Hall
            (3, "Pasta Alfredo", "Creamy Alfredo sauce tossed with fettuccine, served with garlic bread", 9.99, True),
            (3, "Caesar Salad", "Crisp romaine lettuce, parmesan, croutons, and Caesar dressing", 4.99, True),
            (3, "Margherita Pizza", "Classic pizza topped with fresh mozzarella, tomatoes, and basil", 8.49, True),
            (3, "Beef Lasagna", "Layered pasta with seasoned beef, marinara sauce, and melted cheese", 10.49, True),
            (3, "Vegetable Stir Fry", "Mixed vegetables sautéed in a savory soy sauce, served with rice", 8.99, True),

            # Union Bistro
            (4, "Espresso", "Rich and creamy espresso made with freshly ground beans", 2.99, True),
            (4, "Cappuccino", "Espresso topped with steamed milk and a layer of foam", 3.99, True),
            (4, "Chocolate Croissant", "Flaky croissant filled with rich chocolate", 3.49, True),
            (4, "Quiche Lorraine", "Savory pie with eggs, cheese, and bacon", 4.99, True),
            (4, "Spinach and Feta Pastry", "Puff pastry filled with spinach and feta cheese", 4.49, True),

            # Green Leaf Cafe
            (5, "Greek Salad", "Fresh greens, cucumbers, tomatoes, olives, and feta with Greek dressing", 6.99, True),
            (5, "Veggie Bowl", "Quinoa topped with roasted vegetables and tahini dressing", 8.49, True),
            (5, "Smoothie Bowl", "Blended fruit topped with granola, coconut, and fresh berries", 7.49, True),
            (5, "Avocado Salad", "Sliced avocado, mixed greens, and a citrus vinaigrette", 6.99, True),
            (5, "Falafel Wrap", "Crispy falafel balls wrapped in pita with hummus and tzatziki", 7.49, True)
        ]
        for restaurant_id, name, description, price, availability in menu_items:
            cursor.execute(
                "INSERT INTO MenuItems (restaurant_id, name, description, price, availability) VALUES (%s, %s, %s, %s, %s)",
                (restaurant_id, name, description, price, availability)
            )


    def _insert_orders(self, cursor):
        orders = []
        for i in range(1, 16):
            student_id = (i % 5) + 1
            total_amount = round(20 + i * 2.5, 2)
            status = "Completed" if i % 3 == 0 else "Pending"
            orders.append((student_id, total_amount, status))
        for student_id, total_amount, status in orders:
            cursor.execute(
                "INSERT INTO Orders (student_id, total_amount, status) VALUES (%s, %s, %s)",
                (student_id, total_amount, status)
            )

    def _insert_order_details(self, cursor):
        order_details = []
        for i in range(1, 51):
            order_id = (i % 15) + 1
            item_id = (i % 25) + 1
            quantity = (i % 3) + 1
            subtotal = round(quantity * (5.99 + (i % 5)), 2)
            order_details.append((order_id, item_id, quantity, subtotal))
        for order_id, item_id, quantity, subtotal in order_details:
            cursor.execute(
                "INSERT INTO OrderDetails (order_id, item_id, quantity, subtotal) VALUES (%s, %s, %s, %s)",
                (order_id, item_id, quantity, subtotal)
            )

    def _insert_reviews(self, cursor):
        reviews = [
            (1, 1, 5, "The grilled chicken sandwich was amazing! Quick and friendly service."),
            (2, 2, 4, "Great vegetarian options. The veggie wrap was fresh, but service could be faster."),
            (3, 3, 3, "The pasta Alfredo was decent, but the portion size was small."),
            (4, 4, 5, "Union Bistro offers excellent coffee and desserts! Highly recommended."),
            (5, 5, 4, "Green Leaf Cafe has healthy choices. The salads were fresh and tasty."),
        ]
        for student_id, restaurant_id, rating, comments in reviews:
            cursor.execute(
                "INSERT INTO Reviews (student_id, restaurant_id, rating, comments) VALUES (%s, %s, %s, %s)",
                (student_id, restaurant_id, rating, comments)
            )

# Usage
if __name__ == "__main__":
    config_file = "db_config.json"
    populator = TigerEatsDatabasePopulator(config_file)
    # populator.clear_data()  # Uncomment to clear existing data
    populator.create_sample_data()
