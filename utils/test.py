import jwt

# Token provided
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3MzIxNjE0NDV9.N6bQWfdb6i8zDWxrJEmLCAOw8DoFRRVK6om4aN1bHXU"

# Secret key
secret_key = "LSU"

try:
    # Decode and verify the token
    decoded_payload = jwt.decode(token, secret_key, algorithms=["HS256"])
    print("Decoded Payload:", decoded_payload)
except jwt.ExpiredSignatureError:
    print("Token has expired.")
except jwt.InvalidTokenError:
    print("Invalid token.")
