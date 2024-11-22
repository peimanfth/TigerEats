from flask import Flask
from flask_restx import Api
from controllers.auth_controller import auth_ns
from controllers.order_controller import order_ns
from controllers.menu_controller import menu_ns
from controllers.review_controller import review_ns
from controllers.admin_controller import admin_ns

from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Load configuration from config.py
# app.config.from_object('config')


# Initialize Flask-RESTX
api = Api(app, title='TigerEats API', version='1.0', description='API for TigerEats Food Ordering System')

# Register namespaces
api.add_namespace(auth_ns)  # Updated for Swagger
api.add_namespace(menu_ns)
api.add_namespace(order_ns)
api.add_namespace(review_ns)
api.add_namespace(admin_ns)
# app.register_blueprint(auth_bp)
# app.register_blueprint(order_bp)
# app.register_blueprint(menu_bp)
# app.register_blueprint(review_bp)
# app.register_blueprint(admin_bp)

if __name__ == '__main__':
    app.run(debug=True)
