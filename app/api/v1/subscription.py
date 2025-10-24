from flask_restx import Namespace, Resource, fields
from app.services.facade import facade
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta

api = Namespace('subscription', description='Subscription operations')

# Modèle pour les données envoyées depuis le frontend
subscription_model = api.model('Subscription', {
    'user_id': fields.String(required=True, description='ID of the user'),
    'plan_name': fields.String(required=True, description='Name of the plan (Basic, Premium, etc.)'),
    'price': fields.Float(required=True, description='Price of the subscription'),
    'start_date': fields.String(required=False, description='Start date (ISO format)'),
    'status': fields.String(required=False, description='Status of subscription'),
    'coach_id': fields.String(required=False, description='ID of the coach (optional)')
})


@api.route('/')
class SubscriptionList(Resource):
    @api.expect(subscription_model)
    @api.response(201, 'Subscription successfully created')
    @api.response(400, 'Invalid input data')
    @jwt_required()
    def post(self):
        """Register a new subscription"""
        sub_data = api.payload
        
        try:
            # Transformer les données du frontend en format backend
            transformed_data = {
                'user_id': sub_data['user_id'],
                'status': sub_data.get('status', 'active'),
                'plan_name': sub_data.get('plan_name', 'Basic'),
                'price': sub_data.get('price', 0)
            }
            # coach_id est optionnel et ne doit être ajouté que s'il existe et n'est pas vide
            coach_id = sub_data.get('coach_id')
            if coach_id:
                transformed_data['coach_id'] = coach_id

            # Gérer la date de début
            if 'start_date' in sub_data and sub_data['start_date']:
                try:
                    start_date_obj = datetime.fromisoformat(sub_data['start_date'].replace('Z', '+00:00'))
                    transformed_data['begin_date'] = start_date_obj.date()
                except Exception:
                    transformed_data['begin_date'] = datetime.now().date()
            else:
                transformed_data['begin_date'] = datetime.now().date()

            # Calculer end_date selon le plan
            duration_days = {
                'Basic': 30,
                'Premium': 30,
                'Elite': 90
            }
            plan = sub_data.get('plan_name', 'Basic')
            days = duration_days.get(plan, 30)
            transformed_data['end_date'] = transformed_data['begin_date'] + timedelta(days=days)

            # Définir les options selon le plan
            if plan == 'Basic':
                transformed_data['option_nutrition'] = False
                transformed_data['option_message'] = True
            elif plan == 'Premium':
                transformed_data['option_nutrition'] = True
                transformed_data['option_message'] = True
            elif plan == 'Elite':
                transformed_data['option_nutrition'] = True
                transformed_data['option_message'] = True
            else:
                transformed_data['option_nutrition'] = False
                transformed_data['option_message'] = False

            # Créer la subscription
            new_subscription = facade.create_subscription(transformed_data)

            return {
                'id': new_subscription.id,
                'user_id': new_subscription.user_id,
                'coach_id': getattr(new_subscription, 'coach_id', None),
                'begin_date': str(new_subscription.begin_date),
                'end_date': str(new_subscription.end_date),
                'option_nutrition': new_subscription.option_nutrition,
                'option_message': new_subscription.option_message,
                'status': transformed_data['status'],
                'plan_name': transformed_data['plan_name'],
                'price': transformed_data['price']
            }, 201

        except ValueError as e:
            return {'error': str(e)}, 400
        except Exception as e:
            return {'error': f'Internal server error: {str(e)}'}, 500

    @jwt_required()
    def get(self):
        """Retrieve a list of all subscriptions"""
        subscriptions = facade.get_all_subscriptions()
        return [sub.to_dict() for sub in subscriptions], 200


@api.route('/<subscription_id>')
class SubscriptionResource(Resource):
    @api.response(200, 'Subscription details retrieved successfully')
    @api.response(404, 'Subscription not found')
    @jwt_required()
    def get(self, subscription_id):
        """Get subscription details by ID"""
        subscription = facade.get_subscription(subscription_id)
        if not subscription:
            return {'error': 'Subscription not found'}, 404
        return subscription.to_dict(), 200

    @jwt_required()
    def delete(self, subscription_id):
        """Delete a subscription"""
        current_user = get_jwt_identity()
        subscription = facade.get_subscription(subscription_id)
        
        if not subscription:
            return {'error': 'Subscription not found'}, 404
        
        # Vérifier que l'utilisateur a le droit de supprimer
        user_id = current_user.get('id') if isinstance(current_user, dict) else current_user
        if subscription.user_id != user_id:
            return {'error': 'Unauthorized'}, 403
        
        facade.delete_subscription(subscription_id)
        return {'message': 'Subscription deleted successfully'}, 200
    
@api.route('/user/<user_id>')
class UserSubscriptions(Resource):
    @jwt_required()
    def get(self, user_id):
        """Get all subscriptions for a specific user"""
        try:
            # Récupérer toutes les subscriptions
            all_subscriptions = facade.get_all_subscriptions()
            
            # Filtrer par user_id
            user_subscriptions = [
                sub for sub in all_subscriptions 
                if sub.user_id == user_id
            ]
            
            return [sub.to_dict() for sub in user_subscriptions], 200
        except Exception as e:
            return {'error': str(e)}, 400