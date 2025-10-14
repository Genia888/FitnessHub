from flask_restx import Namespace, Resource, fields
from app.services.facade import facade
from flask_jwt_extended import jwt_required, get_jwt_identity

api = Namespace('message', description='Message operations')

# Define the review model for input validation and documentation
message_model = api.model('Message', {
    'text': fields.String(required=True, description='Text of the coach'),
    'is_read': fields.Boolean(required=True, description='Message read T/F'),
    'is_from_user': fields.Boolean(required=True, description='Message from user'),
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
            if message_data['user_id'] == current_user['id']:
                message_data['is_from_user'] = 1
            else:
                message_data['is_from_user'] = 0

            new_message = facade.create_message(
                message_data
            )

            return {
                'id': new_message.id,
                'text': new_message.text,
                'is_read': new_message.is_read,
                'is_from_user': new_message.is_from_user,
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
                'text': message.text,
                'is_read': message.is_read,
                'is_from_user': message.is_from_user,
                'user_id': message.user_id,
                'coach_id': message.coach_id,
                'created_at': message.created_at.isoformat()
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
                'text': message.text,
                'is_read': message.is_read,
                'is_from_user': message.is_from_user,
                'user_id': message.user_id,
                'coach_id': message.coach_id,
                'created_at': message.created_at.isoformat()
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
                'is_read': updated_message.is_read,
                'is_from_user': updated_message.is_from_user,
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
        """Get all messages for a specific coach"""
        try:
            coach_messages = facade.get_messages_by_coach(coach_id)
            return [
                {
                    'id': message.id,
                    'text': message.text,
                    'created_at': message.created_at.isoformat(),
                    'is_read': message.is_read,
                    'is_from_user': message.is_from_user,
                }
                for message in coach_messages
            ], 200
        except ValueError as e:
            return {'error': str(e)}, 400

@api.route('/user/<user_id>/messages')
class PlaceReviewList(Resource):
    @api.response(200, 'List of messages for the user retrieved successfully')
    @api.response(404, 'Message not found')
    def get(self, user_id):
        """Get all messages for a specific user"""
        try:
            user_messages = facade.get_messages_by_user(user_id)
            return [
                {
                    'id': message.id,
                    'text': message.text,
                    'created_at': message.created_at.isoformat(),
                    'is_read': message.is_read,
                    'is_from_user': message.is_from_user,
                }
                for message in user_messages
            ], 200
        except ValueError as e:
            return {'error': str(e)}, 400
