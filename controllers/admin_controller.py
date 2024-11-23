from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from models.admin_model import (
    create_admin, get_admin_by_username, create_restaurant,
    create_menu_item, update_menu_item_availability, update_student_balance,
    get_all_restaurants, delete_restaurant, delete_menu_item
)
from utils.validation import validate_admin_data, validate_menu_item_data, validate_restaurant_data
from utils.helpers import generate_token

# Define the Namespace for Admin operations
admin_ns = Namespace('admin', description='Admin management operations')

# Define models for Swagger documentation
admin_signup_model = admin_ns.model('AdminSignup', {
    'username': fields.String(required=True, description='Admin username'),
    'email': fields.String(required=True, description='Admin email address'),
    'password': fields.String(required=True, description='Admin password'),
    'role': fields.String(default='admin', description='Role of the admin')
})

admin_login_model = admin_ns.model('AdminLogin', {
    'username': fields.String(required=True, description='Admin username'),
    'password': fields.String(required=True, description='Admin password')
})

restaurant_model = admin_ns.model('Restaurant', {
    'name': fields.String(required=True, description='Restaurant name'),
    'location': fields.String(description='Restaurant location')
})

restaurant_delete_model = admin_ns.model('RestaurantDelete', {
    'restaurant_id': fields.Integer(required=True, description='ID of the restaurant')
})

menu_item_model = admin_ns.model('MenuItem', {
    'restaurant_id': fields.Integer(required=True, description='ID of the restaurant'),
    'name': fields.String(required=True, description='Name of the menu item'),
    'description': fields.String(description='Description of the menu item'),
    'price': fields.Float(required=True, description='Price of the menu item'),
    'availability': fields.Boolean(default=True, description='Availability of the menu item')
})

menu_item_delete_model = admin_ns.model('MenuItemDelete', {
    'item_id': fields.Integer(required=True, description='ID of the menu item')
})

update_availability_model = admin_ns.model('UpdateAvailability', {
    'availability': fields.Boolean(required=True, description='Availability status of the menu item')
})

update_balance_model = admin_ns.model('UpdateBalance', {
    'balance': fields.Float(required=True, description='New balance for the student')
})

# API Endpoints
@admin_ns.route('/signup')
class AdminSignup(Resource):
    @admin_ns.expect(admin_signup_model)
    @admin_ns.response(201, 'Admin created successfully')
    def post(self):
        """Sign up a new admin"""
        data = request.json
        errors = validate_admin_data(data)
        if errors:
            return {"error": errors}, 400

        admin_id = create_admin(data)
        return {"message": "Admin created successfully", "admin_id": admin_id}, 201


@admin_ns.route('/login')
class AdminLogin(Resource):
    @admin_ns.expect(admin_login_model)
    @admin_ns.response(200, 'Successful login')
    @admin_ns.response(401, 'Invalid credentials')
    def post(self):
        """Log in an admin"""
        data = request.json
        admin = get_admin_by_username(data['username'])
        if admin and admin['password'] == data['password']:
            token = generate_token(admin['admin_id'])
            return {"token": token}, 200
        else:
            return {"error": "Invalid credentials"}, 401


@admin_ns.route('/restaurants')
class RestaurantList(Resource):
    def get(self):
        """Get the list of all restaurants"""
        try:
            restaurants = get_all_restaurants()
            return jsonify(restaurants)
        except Exception as e:
            return {"error": str(e)}, 500


@admin_ns.route('/restaurant')
class RestaurantManagement(Resource):
    @admin_ns.expect(restaurant_model)
    @admin_ns.response(201, 'Restaurant added successfully')
    def post(self):
        """Add a new restaurant"""
        data = request.json
        errors = validate_restaurant_data(data)
        if errors:
            return {"error": errors}, 400

        restaurant_id = create_restaurant(data)
        return {"message": "Restaurant added successfully", "restaurant_id": restaurant_id}, 201
    
    @admin_ns.expect(restaurant_delete_model)
    @admin_ns.response(200, 'Restaurant deleted successfully')
    def delete(self):
        """Delete a restaurant by ID"""
        data = request.json
        restaurant_id = data['restaurant_id']
        delete_restaurant(restaurant_id)
        return {"message": "Restaurant deleted successfully"}, 200



@admin_ns.route('/menu_item')
class MenuItemManagement(Resource):
    @admin_ns.expect(menu_item_model)
    @admin_ns.response(201, 'Menu item added successfully')
    def post(self):
        """Add a new menu item"""
        data = request.json
        errors = validate_menu_item_data(data)
        if errors:
            return {"error": errors}, 400

        item_id = create_menu_item(data)
        return {"message": "Menu item added successfully", "item_id": item_id}, 201
    
    @admin_ns.expect(menu_item_delete_model)
    @admin_ns.response(200, 'Menu item deleted successfully')
    def delete(self):
        """Delete a menu item by its ID"""
        try:
            data = request.json
            item_id = data['item_id']
            delete_menu_item(item_id)
            return {"message": "Menu item deleted successfully"}, 200
        except KeyError:
            return {"error": "Item ID is required"}, 400
        except Exception as e:
            return {"error": str(e)}, 500

@admin_ns.route('/menu_item/<int:item_id>/availability')
class UpdateMenuItemAvailability(Resource):
    @admin_ns.expect(update_availability_model)
    @admin_ns.response(200, 'Menu item availability updated successfully')
    def patch(self, item_id):
        """Update menu item availability"""
        data = request.json
        availability = data.get("availability", True)
        update_menu_item_availability(item_id, availability)
        return {"message": "Menu item availability updated successfully"}, 200


@admin_ns.route('/student/<int:student_id>/balance')
class UpdateStudentBalance(Resource):
    @admin_ns.expect(update_balance_model)
    @admin_ns.response(200, 'Student balance updated successfully')
    def patch(self, student_id):
        """Update student balance"""
        data = request.json
        balance = data.get("balance")
        if balance is None:
            return {"error": "Balance is required"}, 400

        update_student_balance(student_id, balance)
        return {"message": "Student balance updated successfully"}, 200
