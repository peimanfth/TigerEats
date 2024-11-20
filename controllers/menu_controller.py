from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from models.menu_model import add_menu_item, get_menu_items

menu_ns = Namespace('menu', description='Menu item management operations')

menu_item_model = menu_ns.model('MenuItem', {
    'restaurant_id': fields.Integer(required=True, description='Restaurant ID'),
    'name': fields.String(required=True, description='Name of the menu item'),
    'description': fields.String(description='Description of the menu item'),
    'price': fields.Float(required=True, description='Price of the menu item'),
    'availability': fields.Boolean(description='Availability of the item')
})

@menu_ns.route('/')
class AddMenuItem(Resource):
    @menu_ns.expect(menu_item_model)
    @menu_ns.response(201, 'Menu item added successfully')
    def post(self):
        """Add a new menu item"""
        data = request.json
        item_id = add_menu_item(data)
        return jsonify({"message": "Menu item added successfully", "item_id": item_id})

@menu_ns.route('/<int:restaurant_id>')
class GetMenu(Resource):
    def get(self, restaurant_id):
        """Get all menu items for a restaurant"""
        items = get_menu_items(restaurant_id)
        return jsonify(items)
