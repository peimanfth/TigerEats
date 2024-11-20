from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from models.review_model import add_review, get_reviews_by_restaurant

review_ns = Namespace('review', description='Restaurant review operations')

review_model = review_ns.model('Review', {
    'student_id': fields.Integer(required=True, description='ID of the student writing the review'),
    'restaurant_id': fields.Integer(required=True, description='Restaurant ID'),
    'rating': fields.Integer(required=True, description='Rating (1-5)'),
    'comments': fields.String(description='Review comments')
})

@review_ns.route('/')
class AddReview(Resource):
    @review_ns.expect(review_model)
    @review_ns.response(201, 'Review added successfully')
    def post(self):
        """Submit a review for a restaurant"""
        data = request.json
        review_id = add_review(data)
        return jsonify({"message": "Review added successfully", "review_id": review_id})

@review_ns.route('/<int:restaurant_id>')
class GetReviews(Resource):
    def get(self, restaurant_id):
        """Get all reviews for a restaurant"""
        reviews = get_reviews_by_restaurant(restaurant_id)
        return jsonify(reviews)
