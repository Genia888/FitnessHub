from flask_restx import Namespace, Resource, fields
from app.services.facade import facade
from flask_jwt_extended import jwt_required, get_jwt_identity

api = Namespace('subscription', description='Subscription operations')

# Define the review model for input validation and documentation
message_model = api.model('Subscription', {
    'begin_date': fields.Date(required=True, description='Date of the subscription'),
    'end_date': fields.Date(required=True, description='End of the subscription'),
    'option_nutrition': fields.Boolean(required=True, description='Nutrition T/F'),
    'option_message': fields.Boolean(required=True, description='Message T/F'),
    'user_id': fields.String(required=True, description='ID of the user'),
    'coach_id': fields.String(required=True, description='ID of the coach')
})


@api.route('/')
class messageList(Resource):
    @api.expect(message_model)
    @api.response(201, 'message successfully created')
    @api.response(400, 'Invalid input data')
    @api.doc(security="token")
    @jwt_required()
    def post(self):
        """Register a new message"""
        message_data = api.payload
        try:

            current_user = get_jwt_identity()
            message_data['user_id'] = current_user['id']

            new_message = facade.create_message(
                message_data
            )

            return {
                'id': new_message.id,
                'begin_date': new_message.begin_date,
                'end_date': new_message.end_date,
                'option_nutrition': new_message.option_nutrition,
                'option_message': new_message.option_message,
                'user_id': new_message.user_id,
                'coach_id': new_message.coach_id
            }, 201
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.response(200, 'List of messages retrieved successfully')
    def get(self):
        """Retrieve a list of all messages"""
        messages = facade.get_all_messages()
        return [
            {
                'id': message.id,
                'begin_date': new_message.begin_date,
                'end_date': new_message.end_date,
                'option_nutrition': new_message.option_nutrition,
                'option_message': new_message.option_message,
                'user_id': message.user_id,
                'coach_id': message.coach_id
            }
            for message in messages
        ], 200


@api.route('/<message_id>')
class MessageResource(Resource):
    @api.response(200, 'message details retrieved successfully')
    @api.response(404, 'message not found')
    def get(self, message_id):
        """Get message with ID"""
        try:
            message = facade.get_message(message_id)
            if not message:
                return {'error': 'message not found'}, 404

            return {
                'id': message.id,
                'begin_date': new_message.begin_date,
                'end_date': new_message.end_date,
                'option_nutrition': new_message.option_nutrition,
                'option_message': new_message.option_message,
                'user_id': message.user_id,
                'coach_id': message.coach_id
            }, 200
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.expect(message_model)
    @api.response(200, 'message updated successfully')
    @api.response(404, 'message not found')
    @api.response(400, 'Invalid input data')
    @api.doc(security="token")
    @jwt_required()
    def put(self, message_id):
        """Update a message's information"""
        message_data = api.payload
        try:
            message = facade.get_message(message_id)
            if not message:
                return {'error': 'message not found'}, 404

            current_user = get_jwt_identity()

            updated_message = facade.update_message(message_id, message_data)
            return {
                'id': updated_message.id,
                'text': updated_message.text,
                'date_message': updated_message.date_message,
                'is_read': updated_message.is_read,
                'user_id': updated_message.user_id,
                'coach_id': updated_message.coach_id
            }, 200
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.response(200, 'message deleted successfully')
    @api.response(404, 'message not found')
    @api.doc(security="token")
    @jwt_required()
    def delete(self, message_id):
        """Delete a message"""
        try:
            message_get = facade.get_message(message_id)
            if not message_get:
                return {'error': 'message not found'}, 404

            current_user = get_jwt_identity()

            if current_user['id'] == message_get.user_id:
                return {'error': 'Unauthorized action'}, 403

            message = facade.delete_message(message_id)
            if message:
                return {'message': 'message deleted.'}, 200
            return {'error': 'message not found'}, 404
        except ValueError as e:
            return {'error': str(e)}, 400


@api.route('/coach/<coach_id>/messages')
class PlaceReviewList(Resource):
    @api.response(200, 'List of messages for the coach retrieved successfully')
    @api.response(404, 'Message not found')
    def get(self, coach_id):
        """Get all messages for a specific place"""
        try:
            coach_messages = facade.get_messages_by_coach(coach_id)
            return [
                {
                    'id': message.id,
                    'text': message.text,
                    'date_message': message.date_message,
                    'is_read': message.is_read,
                }
                for message in coach_messages
            ], 200
        except ValueError as e:
            return {'error': str(e)}, 400
