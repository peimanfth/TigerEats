import pymysql
import json

def get_db_connection():
    with open("db_config.json", 'r') as file:
        config = json.load(file)
    connection_params = {
        'host': config['host'],
        'port': config['port'],
        'user': config['user'],
        'database': config['database']
    }
    
    if 'password' in config:
        connection_params['password'] = config['password']
    
    connection = pymysql.connect(**connection_params)
    return connection

def execute_query(query, params=None):
    connection = get_db_connection()
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    cursor.execute(query, params)
    connection.commit()
    cursor.close()
    connection.close()

def fetch_data(query, params=None):
    connection = get_db_connection()
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    cursor.execute(query, params)
    result = cursor.fetchall()
    cursor.close()
    connection.close()
    return result
