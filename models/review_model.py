from utils.db_connection import execute_query, fetch_data

def add_review(data):
    query = """
    INSERT INTO Reviews (student_id, restaurant_id, rating, comments)
    VALUES (%s, %s, %s, %s)
    """
    execute_query(query, (data['student_id'], data['restaurant_id'], data['rating'], data['comments']))
    return fetch_data("SELECT LAST_INSERT_ID() AS review_id")[0]['review_id']

def get_reviews_by_restaurant(restaurant_id):
    query = "SELECT * FROM Reviews WHERE restaurant_id = %s"
    return fetch_data(query, (restaurant_id,))
