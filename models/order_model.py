from utils.db_connection import execute_query, fetch_data, get_db_connection

def create_order_with_details(data):
    student_id = data.get('student_id')
    items = data.get('items')

    # Validate the input
    if not student_id or not isinstance(items, list) or not items:
        return {"error": "Invalid order data"}

    # Calculate total amount
    total_amount = 0
    for item in items:
        if 'item_id' not in item or 'quantity' not in item:
            return {"error": "Each item must include item_id and quantity"}
        query = "SELECT price FROM MenuItems WHERE item_id = %s"
        item_data = fetch_data(query, (item['item_id'],))
        if not item_data:
            return {"error": f"Item with ID {item['item_id']} does not exist"}
        total_amount += item_data[0]['price'] * item['quantity']

    # Check student's balance
    balance_query = "SELECT balance FROM Students WHERE student_id = %s"
    student_data = fetch_data(balance_query, (student_id,))
    if not student_data:
        return {"error": "Student not found"}
    current_balance = student_data[0]['balance']

    if current_balance < total_amount:
        return {"error": "Insufficient balance"}

    # Use a single database connection to ensure consistency
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Insert into Orders table
        order_query = "INSERT INTO Orders (student_id, total_amount) VALUES (%s, %s)"
        cursor.execute(order_query, (student_id, total_amount))
        connection.commit()

        # Fetch the last inserted order_id
        order_id = cursor.lastrowid

        # Insert into OrderDetails table
        for item in items:
            item_id = item['item_id']
            quantity = item['quantity']
            subtotal = fetch_data("SELECT price FROM MenuItems WHERE item_id = %s", (item_id,))[0]['price'] * quantity
            order_detail_query = """
            INSERT INTO OrderDetails (order_id, item_id, quantity, subtotal)
            VALUES (%s, %s, %s, %s)
            """
            cursor.execute(order_detail_query, (order_id, item_id, quantity, subtotal))

        # Adjust student's balance
        new_balance = current_balance - total_amount
        balance_update_query = "UPDATE Students SET balance = %s WHERE student_id = %s"
        cursor.execute(balance_update_query, (new_balance, student_id))

        # Commit all changes
        connection.commit()
        return {"order_id": order_id}

    except Exception as e:
        # Rollback in case of any failure
        connection.rollback()
        return {"error": str(e)}

    finally:
        cursor.close()
        connection.close()

def get_orders(student_id):
    query = "SELECT * FROM Orders WHERE student_id = %s"
    return fetch_data(query, (student_id,))

def get_all_orders():
    query = "SELECT * FROM Orders"
    return fetch_data(query)

def get_order_receipt(order_id):
    order_query = """
    SELECT o.order_id, o.total_amount, o.order_date, od.quantity, od.subtotal, m.name AS item_name, r.restaurant_id
    FROM Orders o
    JOIN OrderDetails od ON o.order_id = od.order_id
    JOIN MenuItems m ON od.item_id = m.item_id
    JOIN Restaurants r ON m.restaurant_id = r.restaurant_id
    WHERE o.order_id = %s
    """
    order_details = fetch_data(order_query, (order_id,))
    
    if not order_details:
        return None

    receipt = {
        "order_id": order_id,
        "order_date": order_details[0]['order_date'],
        "items": [
            {
                "item_name": detail['item_name'],
                "quantity": detail['quantity'],
                "subtotal": detail['subtotal']
            }
            for detail in order_details
        ],
        "total_amount": order_details[0]['total_amount'],
        "restaurant_id": order_details[0]['restaurant_id']
    }
    return receipt
