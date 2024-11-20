from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from models.order_model import create_order_with_details, get_orders, get_order_receipt

order_ns = Namespace('order', description='Order management operations')

# Define models for Swagger documentation
order_item_model = order_ns.model('OrderItem', {
    'item_id': fields.Integer(required=True, description='ID of the menu item'),
    'quantity': fields.Integer(required=True, description='Quantity of the item')
})

order_model = order_ns.model('Order', {
    'student_id': fields.Integer(required=True, description='ID of the student placing the order'),
    'items': fields.List(fields.Nested(order_item_model), required=True, description='List of items in the order')
})

@order_ns.route('/')
class PlaceOrder(Resource):
    @order_ns.expect(order_model)
    @order_ns.response(201, 'Order placed successfully')
    def post(self):
        """Place a new order"""
        data = request.json
        result = create_order_with_details(data)
        if 'error' in result:
            return jsonify({"error": result['error']}), 400
        return jsonify({"message": "Order placed successfully", "order_id": result['order_id']})

@order_ns.route('/<int:student_id>')
class GetOrders(Resource):
    @order_ns.response(200, 'Orders retrieved successfully')
    def get(self, student_id):
        """Retrieve all orders for a student"""
        orders = get_orders(student_id)
        return jsonify(orders)

@order_ns.route('/receipt/<int:order_id>')
class OrderReceipt(Resource):
    @order_ns.response(200, 'Receipt retrieved successfully')
    @order_ns.response(404, 'Order not found')
    def get(self, order_id):
        """Retrieve the receipt for a specific order"""
        receipt = get_order_receipt(order_id)
        if not receipt:
            return jsonify({"error": "Order not found"}), 404
        return jsonify(receipt)
