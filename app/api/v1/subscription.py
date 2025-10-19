from flask_restx import Namespace, Resource, fields
from app.services.facade import facade
from flask_jwt_extended import jwt_required, get_jwt_identity

api = Namespace('subscription', description='Subscription operations')

# Define the subscription model for input validation and documentation
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

            new_subscription = facade.create_subscription(sub_data)

            return {
                'id': new_subscription.id,
                'begin_date': new_subscription.begin_date.isoformat(),
                'end_date': new_subscription.end_date.isoformat(),
                'option_nutrition': new_subscription.option_nutrition,
                'option_message': new_subscription.option_message,
                'user_id': new_subscription.user_id,
                'coach_id': new_subscription.coach_id
            }, 201
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.response(200, 'List of subscriptions retrieved successfully')
    def get(self):
        """Retrieve a list of all subscriptions"""
        subscriptions = facade.get_all_subscriptions()
        return [
            {
                'id': subs.id,
                'begin_date': subs.begin_date.isoformat(),
                'end_date': subs.end_date.isoformat(),
                'option_nutrition': subs.option_nutrition,
                'option_message': subs.option_message,
                'user_id': subs.user_id,
                'coach_id': subs.coach_id
            }
            for subs in subscriptions
        ], 200


@api.route('/<subscription_id>')
class SubscriptionResource(Resource):
    @api.response(200, 'Subscription details retrieved successfully')
    @api.response(404, 'Subscription not found')
    def get(self, subscription_id):
        """Get subscription details by ID"""
        try:
            subscription = facade.get_subscription(subscription_id)
            if not subscription:
                return {'error': 'Subscription not found'}, 404

            return {
                'id': subscription.id,
                'begin_date': subscription.begin_date.isoformat(),
                'end_date': subscription.end_date.isoformat(),
                'option_nutrition': subscription.option_nutrition,
                'option_message': subscription.option_message,
                'user_id': subscription.user_id,
                'coach_id': subscription.coach_id
            }, 200
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.expect(subscription_model)
    @api.response(200, 'Subscription updated successfully')
    @api.response(404, 'Subscription not found')
    @api.response(400, 'Invalid input data')
    @api.doc(security="token")
    @jwt_required()
    def put(self, subscription_id):
        """Update a subscription's information"""
        subscription_data = api.payload
        try:
            subscription = facade.get_subscription(subscription_id)
            if not subscription:
                return {'error': 'Subscription not found'}, 404

            current_user = get_jwt_identity()

            updated_subscription = facade.update_subscription(subscription_id, subscription_data)
            return {
                'id': updated_subscription.id,
                'begin_date': updated_subscription.begin_date.isoformat(),
                'end_date': updated_subscription.end_date.isoformat(),
                'option_nutrition': updated_subscription.option_nutrition,
                'option_message': updated_subscription.option_message,
                'user_id': updated_subscription.user_id,
                'coach_id': updated_subscription.coach_id
            }, 200
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.response(200, 'Subscription deleted successfully')
    @api.response(404, 'Subscription not found')
    @api.response(403, 'Unauthorized action')
    @api.doc(security="token")
    @jwt_required()
    def delete(self, subscription_id):
        """Delete a subscription"""
        try:
            subscription = facade.get_subscription(subscription_id)
            if not subscription:
                return {'error': 'Subscription not found'}, 404

            current_user = get_jwt_identity()

            # Vérifier que l'utilisateur est bien le propriétaire de la subscription
            if current_user['id'] != subscription.user_id:
                return {'error': 'Unauthorized action'}, 403

            result = facade.delete_subscription(subscription_id)
            if result:
                return {'message': 'Subscription deleted successfully'}, 200
            return {'error': 'Subscription not found'}, 404
        except ValueError as e:
            return {'error': str(e)}, 400