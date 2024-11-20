from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from models.student_model import create_student, get_student_by_email
from utils.helpers import generate_token

# Define the Namespace for auth
auth_ns = Namespace('auth', description='Authentication operations')

# Define the input model for signup and login
user_signup_model = auth_ns.model('UserSignup', {
    'first_name': fields.String(required=True, description='First name of the user'),
    'last_name': fields.String(required=True, description='Last name of the user'),
    'email': fields.String(required=True, description='Email address'),
    'password': fields.String(required=True, description='Password')
})

user_login_model = auth_ns.model('UserLogin', {
    'email': fields.String(required=True, description='Email address'),
    'password': fields.String(required=True, description='Password')
})

# Define signup and login routes with documentation
@auth_ns.route('/signup')
class Signup(Resource):
    @auth_ns.expect(user_signup_model)
    @auth_ns.response(201, 'User created successfully')
    @auth_ns.response(400, 'Validation error')
    def post(self):
        """Sign up a new user"""
        data = request.json
        student_id = create_student(data)
        return jsonify({"message": "User created successfully", "user_id": student_id})

@auth_ns.route('/login')
class Login(Resource):
    @auth_ns.expect(user_login_model)
    @auth_ns.response(200, 'Successful login')
    @auth_ns.response(401, 'Invalid credentials')
    def post(self):
        """Log in a user"""
        data = request.json
        student = get_student_by_email(data['email'])
        if student and student['password'] == data['password']:
            token = generate_token(student['student_id'])
            return jsonify({"token": token})
        else:
            return jsonify({"error": "Invalid credentials"}), 401
