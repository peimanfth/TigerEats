from utils.db_connection import execute_query, fetch_data

def create_student(data):
    query = "INSERT INTO Students (first_name, last_name, email, password, balance) VALUES (%s, %s, %s, %s, %s)"
    execute_query(query, (data['first_name'], data['last_name'], data['email'], data['password'], data.get('balance', 500)))
    return fetch_data("SELECT LAST_INSERT_ID() AS student_id")[0]['student_id']

def get_student_by_email(email):
    query = "SELECT * FROM Students WHERE email = %s"
    result = fetch_data(query, (email,))
    return result[0] if result else None
