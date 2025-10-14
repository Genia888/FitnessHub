from flask_restx import Namespace, Resource, fields
from app.services.facade import facade
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime 
api = Namespace('workout_schedule', description='Workout schedule operations')

# Define the workout model for input validation and documentation
workout_model = api.model('workout', {
    'description': fields.String(required=True, description='Description of the workout'),
    'picture': fields.String(required=True, description='Picture of the workout'),
    'category': fields.String(required=True, description='Category of the workout'),
    'comment': fields.String(required=True, description='Calories'),
    'time': fields.Float(required=True, description='Quantity'),
    'date_workout': fields.DateTime(required=True, description='Date od workout'),
    'user_id': fields.String(required=True, description='ID of the user'),
    'coach_id': fields.String(required=True, description='ID of the coach')
})


@api.route('/')
class WorkoutList(Resource):
    @api.expect(workout_model)
    @api.response(201, 'workout successfully created')
    @api.response(400, 'Invalid input data')
    @api.doc(security="token")
    @jwt_required()
    def post(self):
        """Register a new workout"""
        workout_data = api.payload
        try:

            current_user = get_jwt_identity()
            #workout_data['user_id'] = current_user['id']

            new_workout = facade.create_workout(
                workout_data
            )

            return {
                'id': new_workout.id,
                'description': new_workout.description,
                'picture': new_workout.picture,
                'category': new_workout.category,
                'time': new_workout.time,
                'comment': new_workout.comment,
                'date_workout': new_workout.date_workout,
                'user_id': new_workout.user_id,
                'coach_id': new_workout.coach_id
            }, 201
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.response(200, 'List of workouts retrieved successfully')
    def get(self):
        """Retrieve a list of all workouts"""
        workouts = facade.get_all_workout_schedule()
        return [
            {
                'id': workout.id,
                'description': workout.description,
                'picture': workout.picture,
                'category': workout.category,
                'time': workout.time,
                'comment': workout.comment,
                'date_workout': workout.date_workout.isoformat(),
                'user_id': workout.user_id,
                'coach_id': workout.coach_id
            }
            for workout in workouts
        ], 200


@api.route('/<workout_id>')
class WorkoutResource(Resource):
    @api.response(200, 'workout details retrieved successfully')
    @api.response(404, 'workout not found')
    def get(self, workout_id):
        """Get workout with ID"""
        try:
            workout = facade.get_workout(workout_id)
            if not workout:
                return {'error': 'workout not found'}, 404

            return {
                'id': workout.id,
                'description': workout.description,
                'picture': workout.picture,
                'category': workout.category,
                'time': workout.time,
                'comment': workout.comment,
                'date_workout': workout.date_workout,
                'user_id': workout.user_id,
                'coach_id': workout.coach_id
            }, 200
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.expect(workout_model)
    @api.response(200, 'workout updated successfully')
    @api.response(404, 'workout not found')
    @api.response(400, 'Invalid input data')
    @api.doc(security="token")
    @jwt_required()
    def put(self, workout_id):
        """Update a workout's information"""
        workout_data = api.payload
        try:
            workout = facade.get_workout(workout_id)
            if not workout:
                return {'error': 'workout not found'}, 404

            current_user = get_jwt_identity()

            updated_workout = facade.update_workout(workout_id, workout_data)
            return {
                'id': updated_workout.id,
                'description': updated_workout.description,
                'picture': updated_workout.picture,
                'category': updated_workout.category,
                'time': updated_workout.time,
                'comment': updated_workout.comment,
                'date_workout': workout.date_workout,
                'user_id': updated_workout.user_id,
                'coach_id': updated_workout.coach_id
            }, 200
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.response(200, 'workout deleted successfully')
    @api.response(404, 'workout not found')
    @api.doc(security="token")
    @jwt_required()
    def delete(self, workout_id):
        """Delete a workout"""
        try:
            workout_get = facade.get_workout(workout_id)
            if not workout_get:
                return {'error': 'workout not found'}, 404

            current_user = get_jwt_identity()

            if current_user['id'] != workout_get.coach_id:
                return {'error': 'Unauthorized action'}, 403

            workout = facade.delete_workout(workout_get)
            if workout:
                return {'message': 'workout deleted.'}, 200
            return {'error': 'workout not found'}, 404
        except ValueError as e:
            return {'error': str(e)}, 400


@api.route('/user/<user_id>/workout')
class WorkoutUserList(Resource):
    @api.response(200, 'List of workout for a user')
    @api.response(404, 'User not found')
    def get(self, user_id):
        """Get all workout for a specific user"""
        try:
            workouts = facade.get_workout_by_user(user_id)
            
            return [
                {
                    'id': workout.id,
                    'description': workout.description,
                    'picture': workout.picture,
                    'category': workout.category,
                    'time': workout.time,
                    'comment': workout.comment,
                    'date_workout': workout.date_workout.isoformat(),
                    'user_id': workout.user_id,
                    'coach_id': workout.coach_id
                }
                for workout in workouts
            ], 200
        except ValueError as e:
            return {'error': str(e)}, 400
