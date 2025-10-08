from flask_restx import Namespace, Resource, fields
from app.services.facade import facade
from flask_jwt_extended import jwt_required, get_jwt_identity

api = Namespace('subscription', description='Subscription operations')

# Define the review model for input validation and documentation
subscription_model = api.model('Subscription', {
    'begin_date': fields.Date(required=True, description='Date of the subscription'),
    'end_date': fields.Date(required=True, description='End of the subscription'),
    'option_nutrition': fields.Boolean(required=True, description='Nutrition T/F'),
    'option_message': fields.Boolean(required=True, description='Message T/F'),
    'user_id': fields.String(required=True, description='ID of the user'),
    'coach_id': fields.String(required=True, description='ID of the coach')
})


@api.route('/')
class SubscriptionList(Resource):
    @api.expect(subscription_model)
    @api.response(201, 'Subscription successfully created')
    @api.response(400, 'Invalid input data')
    @api.doc(security="token")
    @jwt_required()
    def post(self):
        """Register a new subscription"""
        sub_data = api.payload
        try:

            current_user = get_jwt_identity()
            sub_data['user_id'] = current_user['id']

            new_subscription = facade.create_subscription(
                sub_data
            )

            return {
                'id': new_subscription.id,
                'begin_date': new_subscription.begin_date,
                'end_date': new_subscription.end_date,
                'option_nutrition': new_subscription.option_nutrition,
                'option_message': new_subscription.option_message,
                'user_id': new_subscription.user_id,
                'coach_id': new_subscription.coach_id
            }, 201
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.response(200, 'List of messages retrieved successfully')
    def get(self):
        """Retrieve a list of all messages"""
        subscriptions = facade.get_all_subscriptions()
        return [
            {
                'id': subs.id,
                'begin_date': subs.begin_date,
                'end_date': subs.end_date,
                'option_nutrition': subs.option_nutrition,
                'option_message': subs.option_message,
                'user_id': subs.user_id,
                'coach_id': subs.coach_id
            }
            for subs in subscriptions
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
                'begin_date': message.begin_date,
                'end_date': message.end_date,
                'option_nutrition': message.option_nutrition,
                'option_message': message.option_message,
                'user_id': message.user_id,
                'coach_id': message.coach_id
            }, 200
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.expect(subscription_model)
    @api.response(200, 'subscription updated successfully')
    @api.response(404, 'subscription not found')
    @api.response(400, 'Invalid input data')
    @api.doc(security="token")
    @jwt_required()
    def put(self, subscription_id):
        """Update a message's information"""
        subscription_data = api.payload
        try:
            subscription = facade.get_subscription(subscription_id)
            if not subscription:
                return {'error': 'message not found'}, 404

            current_user = get_jwt_identity()

            updated_subscription = facade.update_subscription(subscription_id, subscription_data)
            return {
                'id': updated_subscription.id,
                'begin_date': updated_subscription.begin_date,
                'end_date': updated_subscription.end_date,
                'option_nutrition': updated_subscription.option_nutrition,
                'option_message': updated_subscription.option_message,
                'user_id': updated_subscription.user_id,
                'coach_id': updated_subscription.coach_id
            }, 200
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.response(200, 'subscription deleted successfully')
    @api.response(404, 'subscription not found')
    @api.doc(security="token")
    @jwt_required()
    def delete(self, subscription_id):
        """Delete a subscription"""
        try:
            subscription_get = facade.get_subscription(subscription_id)
            if not subscription_get:
                return {'error': 'subscription not found'}, 404

            current_user = get_jwt_identity()

            if current_user['id'] == subscription_get.user_id:
                return {'error': 'Unauthorized action'}, 403

            subscription = facade.delete_subscription(subscription_id)
            if subscription:
                return {'message': 'subscription deleted.'}, 200
            return {'error': 'subscription not found'}, 404
        except ValueError as e:
            return {'error': str(e)}, 400
