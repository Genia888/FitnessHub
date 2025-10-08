from flask_restx import Namespace, Resource, fields
from app.services.facade import facade
from flask_jwt_extended import jwt_required, get_jwt_identity

api = Namespace('nutrition_schedule', description='Nutrition schedule operations')

# Define the nutrition model for input validation and documentation
nutrition_model = api.model('nutrition', {
    'description': fields.String(required=True, description='Description of the nutrition'),
    'picture': fields.String(required=True, description='Picture of the nutrition'),
    'category': fields.String(required=True, description='Category of the nutrition'),
    'calories': fields.Float(required=True, description='Calories'),
    'quantity': fields.Float(required=True, description='Quantity'),
    'date_nutrition': fields.Date(required=True, description='Date od nutrition'),
    'user_id': fields.String(required=True, description='ID of the user'),
    'coach_id': fields.String(required=True, description='ID of the coach')
})


@api.route('/')
class nutritionList(Resource):
    @api.expect(nutrition_model)
    @api.response(201, 'nutrition successfully created')
    @api.response(400, 'Invalid input data')
    @api.doc(security="token")
    @jwt_required()
    def post(self):
        """Register a new nutrition"""
        nutrition_data = api.payload
        try:

            current_user = get_jwt_identity()
            nutrition_data['user_id'] = current_user['id']

            new_nutrition = facade.create_nutrition(
                nutrition_data
            )

            return {
                'id': new_nutrition.id,
                'description': new_nutrition.description,
                'picture': new_nutrition.picture,
                'category': new_nutrition.category,
                'calories': new_nutrition.calories,
                'quantity': new_nutrition.quantity,
                'date_nutrition': new_nutrition.date_nutrition,
                'user_id': new_nutrition.user_id,
                'coach_id': new_nutrition.coach_id
            }, 201
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.response(200, 'List of nutritions retrieved successfully')
    def get(self):
        """Retrieve a list of all nutritions"""
        nutritions = facade.get_all_nutrition_schedule()
        return [
            {
                'id': nutrition.id,
                'description': nutrition.description,
                'picture': nutrition.picture,
                'category': nutrition.category,
                'calories': nutrition.calories,
                'quantity': nutrition.quantity,
                'date_nutrition': nutrition.date_nutrition,
                'user_id': nutrition.user_id,
                'coach_id': nutrition.coach_id
            }
            for nutrition in nutritions
        ], 200


@api.route('/<nutrition_id>')
class nutritionResource(Resource):
    @api.response(200, 'nutrition details retrieved successfully')
    @api.response(404, 'nutrition not found')
    def get(self, nutrition_id):
        """Get nutrition with ID"""
        try:
            nutrition = facade.get_nutrition(nutrition_id)
            if not nutrition:
                return {'error': 'nutrition not found'}, 404

            return {
                'id': nutrition.id,
                'description': nutrition.description,
                'picture': nutrition.picture,
                'category': nutrition.category,
                'calories': nutrition.calories,
                'quantity': nutrition.quantity,
                'date_nutrition': nutrition.date_nutrition,
                'user_id': nutrition.user_id,
                'coach_id': nutrition.coach_id
            }, 200
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.expect(nutrition_model)
    @api.response(200, 'nutrition updated successfully')
    @api.response(404, 'nutrition not found')
    @api.response(400, 'Invalid input data')
    @api.doc(security="token")
    @jwt_required()
    def put(self, nutrition_id):
        """Update a nutrition's information"""
        nutrition_data = api.payload
        try:
            nutrition = facade.get_nutrition(nutrition_id)
            if not nutrition:
                return {'error': 'nutrition not found'}, 404

            current_user = get_jwt_identity()

            updated_nutrition = facade.update_nutrition(nutrition_id, nutrition_data)
            return {
                'id': updated_nutrition.id,
                'description': updated_nutrition.description,
                'picture': updated_nutrition.picture,
                'category': updated_nutrition.category,
                'calories': updated_nutrition.calories,
                'quantity': updated_nutrition.quantity,
                'date_nutrition': nutrition.date_nutrition,
                'user_id': updated_nutrition.user_id,
                'coach_id': updated_nutrition.coach_id
            }, 200
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.response(200, 'nutrition deleted successfully')
    @api.response(404, 'nutrition not found')
    @api.doc(security="token")
    @jwt_required()
    def delete(self, nutrition_id):
        """Delete a nutrition"""
        try:
            nutrition_get = facade.get_nutrition(nutrition_id)
            if not nutrition_get:
                return {'error': 'nutrition not found'}, 404

            current_user = get_jwt_identity()

            if current_user['id'] == nutrition_get.user_id:
                return {'error': 'Unauthorized action'}, 403

            nutrition = facade.delete_nutrition(nutrition_get)
            if nutrition:
                return {'message': 'nutrition deleted.'}, 200
            return {'error': 'nutrition not found'}, 404
        except ValueError as e:
            return {'error': str(e)}, 400
