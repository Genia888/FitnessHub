from flask_restx import Namespace, Resource, fields
from app.services.facade import facade
from flask_jwt_extended import jwt_required, get_jwt_identity

api = Namespace('diets', description='Diet operations')

# Define the diet model for input validation and documentation
diet_model = api.model('Diet', {
    'description': fields.String(required=True, description='Description of the diet'),
    'picture': fields.String(required=True, description='Picture of the diet'),
    'category': fields.String(required=True, description='Category of the diet'),
    'calories': fields.Float(required=True, description='Calories'),
    'quantity': fields.Float(required=True, description='Quantity'),
    'user_id': fields.String(required=True, description='ID of the user'),
    'coach_id': fields.String(required=True, description='ID of the coach')
})


@api.route('/')
class DietList(Resource):
    @api.expect(diet_model)
    @api.response(201, 'Diet successfully created')
    @api.response(400, 'Invalid input data')
    @api.doc(security="token")
    @jwt_required()
    def post(self):
        """Register a new diet"""
        diet_data = api.payload
        try:

            current_user = get_jwt_identity()
            diet_data['user_id'] = current_user['id']

            new_diet = facade.create_diet(
                diet_data
            )

            return {
                'id': new_diet.id,
                'description': new_diet.description,
                'picture': new_diet.picture,
                'category': new_diet.category,
                'calories': new_diet.calories,
                'quantity': new_diet.quantity,
                'user_id': new_diet.user_id,
                'coach_id': new_diet.coach_id
            }, 201
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.response(200, 'List of diets retrieved successfully')
    def get(self):
        """Retrieve a list of all diets"""
        diets = facade.get_all_diet()
        return [
            {
                'id': diet.id,
                'description': diet.description,
                'picture': diet.picture,
                'category': diet.category,
                'calories': diet.calories,
                'quantity': diet.quantity,
                'user_id': diet.user_id,
                'coach_id': diet.coach_id
            }
            for diet in diets
        ], 200


@api.route('/<diet_id>')
class DietResource(Resource):
    @api.response(200, 'Diet details retrieved successfully')
    @api.response(404, 'Diet not found')
    def get(self, diet_id):
        """Get diet with ID"""
        try:
            diet = facade.get_diet(diet_id)
            if not diet:
                return {'error': 'Diet not found'}, 404

            return {
                'id': diet.id,
                'description': diet.description,
                'picture': diet.picture,
                'category': diet.category,
                'calories': diet.calories,
                'quantity': diet.quantity,
                'user_id': diet.user_id,
                'coach_id': diet.coach_id
            }, 200
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.expect(diet_model)
    @api.response(200, 'Diet updated successfully')
    @api.response(404, 'Diet not found')
    @api.response(400, 'Invalid input data')
    @api.doc(security="token")
    @jwt_required()
    def put(self, diet_id):
        """Update a diet's information"""
        diet_data = api.payload
        try:
            diet = facade.get_diet(diet_id)
            if not diet:
                return {'error': 'Diet not found'}, 404

            current_user = get_jwt_identity()

            updated_diet = facade.update_diet(diet_id, diet_data)
            return {
                'id': updated_diet.id,
                'description': updated_diet.description,
                'picture': updated_diet.picture,
                'category': updated_diet.category,
                'calories': updated_diet.calories,
                'quantity': updated_diet.quantity,
                'user_id': updated_diet.user_id,
                'coach_id': updated_diet.coach_id
            }, 200
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.response(200, 'Diet deleted successfully')
    @api.response(404, 'Diet not found')
    @api.doc(security="token")
    @jwt_required()
    def delete(self, diet_id):
        """Delete a diet"""
        try:
            diet_get = facade.get_diet(diet_id)
            if not diet_get:
                return {'error': 'Diet not found'}, 404

            current_user = get_jwt_identity()

            if current_user['id'] == diet_get.user_id:
                return {'error': 'Unauthorized action'}, 403

            diet = facade.delete_diet(diet_get)
            if diet:
                return {'message': 'Diet deleted.'}, 200
            return {'error': 'Diet not found'}, 404
        except ValueError as e:
            return {'error': str(e)}, 400
