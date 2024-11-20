import jwt
from datetime import datetime, timedelta
import json

# Load configuration from db_config.json
with open('db_config.json', 'r') as config_file:
    config = json.load(config_file)

def generate_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, config["SECRET_KEY"], algorithm="HS256")
    return token

def decode_token(token):
    try:
        payload = jwt.decode(token, config["SECRET_KEY"], algorithms=["HS256"])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def print_config():
    print(config)

if __name__ == "__main__":
    print_config()
    print(generate_token(1))