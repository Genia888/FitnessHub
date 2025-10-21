from flask import request
from flask_restx import Namespace, Resource, fields
from app.services.facade import facade
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, date


api = Namespace("users", description="User operations")

user_model = api.model("User", {
    "first_name": fields.String(required=True, max_length=50),
    "last_name": fields.String(required=True, max_length=50),
    "birthday": fields.Date(required=True, max_length=50),
    "password": fields.String(required=True, max_length=50),
    "is_admin": fields.Boolean(required=True, default=False),
    "is_coach": fields.Boolean(required=True, default=False),
    "is_nutrition": fields.Boolean(required=True, default=False),
    "adress1": fields.String(required=True, max_length=100),
    "adress2": fields.String(required=True, max_length=100),
    "postal_code": fields.String(required=True, max_length=20),
    "city": fields.String(required=True, max_length=100),
    "allergy_comment": fields.String(required=False, max_length=10000),
    "physical_constraint": fields.String(required=False, max_length=10000),
    "coach_certif": fields.String(required=False, max_length=1000),
    "coach_experience": fields.String(required=False, max_length=10000),
    "coach_description": fields.String(required=False, max_length=10000),
    "email": fields.String(required=True),
    "size": fields.Float(required=False),
    "weight": fields.Float(required=False),
    "picture": fields.String(required=True, max_length=1000),
})

# Adding the review model
review_model = api.model('CoachReview', {
    'id': fields.String(description='Review ID'),
    'text': fields.String(description='Text of the review'),
    'rating': fields.Integer(description='Rating of the place (1-5)'),
    'user_id': fields.String(description='ID of the user')
})

@api.route('/')
class UserList(Resource):
    @api.expect(user_model, validate=True)
    @api.response(201, 'User successfully created')
    @api.response(400, 'Email already registered')
    @api.response(400, 'Invalid input data')
    def post(self):
        """Register a new user"""
        user_data = api.payload

        # Simulate email uniqueness check (to be replaced by real validation with persistence)
        existing_user = facade.get_user_by_email(user_data['email'])
        if existing_user:
            return {'error': 'Email already registered'}, 400

        # CORRECTION DU PROBLÈME DE LA DATE
        # Convertir birthday en objet date si présent
        if 'birthday' in user_data and user_data['birthday']:
            try:
                # Si c'est une string, la convertir en objet date
                if isinstance(user_data['birthday'], str):
                    user_data['birthday'] = datetime.strptime(user_data['birthday'], '%Y-%m-%d').date()
            except (ValueError, TypeError) as e:
                return {'error': 'Invalid date format for birthday. Use YYYY-MM-DD'}, 400
        
        new_user = facade.create_user(user_data)
        
        # Ne pas retourner le mot de passe dans la réponse
        return {
            'id': new_user.id, 
            'first_name': new_user.first_name, 
            'last_name': new_user.last_name, 
            'birthday': new_user.birthday.isoformat(), 
            'email': new_user.email,
            "is_admin": new_user.is_admin, 
            "is_coach": new_user.is_coach,
            "is_nutrition": new_user.is_nutrition,
            "adress1": new_user.adress1, 
            "adress2": new_user.adress2, 
            "postal_code": new_user.postal_code, 
            "city": new_user.city, 
            "allergy_comment": new_user.allergy_comment, 
            "physical_constraint": new_user.physical_constraint,
            "coach_certif": new_user.coach_certif, 
            "coach_experience": new_user.coach_experience,
            "coach_description": new_user.coach_description,
            "size": new_user.size, 
            "weight": new_user.weight,
            "picture": new_user.picture  
        }, 201

    @api.response(200, 'List of users retrieved successfully')
    def get(self):
        """Retrieve a list of all users"""
        users = facade.get_all_users()
        return [user.to_dict() for user in users], 200
    

@api.route('/<user_id>')
class UserResource(Resource):
    @api.response(200, 'User details retrieved successfully')
    @api.response(404, 'User not found')
    def get(self, user_id):
        """Get user details by ID"""
        user = facade.get_user(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        return user.to_dict(), 200              
    
    @api.doc(security="token")
    @jwt_required()
    def delete(self, user_id):
        """Delete a user"""
        current_user_id = get_jwt_identity()
        claims = get_jwt()
        is_admin = claims.get("is_admin", False)

        try:
            user = facade.get_user(user_id)
            if not user:
                return {'error': 'User not found'}, 404

            # Vérifier que l'utilisateur supprime son propre compte ou est admin
            # current_user_id peut être un dict ou une string selon la configuration JWT
            user_id_to_check = current_user_id.get('id') if isinstance(current_user_id, dict) else current_user_id
            
            if user_id_to_check != user_id and not is_admin:
                return {'error': 'Unauthorized action'}, 403
            
            result = facade.delete_user(user_id)
            return result, 200
        except ValueError as e:
            return {'error': str(e)}, 404

    @api.expect(user_model, validate=True)
    @api.response(200, 'User updated successfully')
    @api.response(404, 'User not found')
    @api.response(400, 'Invalid input data')
    @api.doc(security="token")
    @jwt_required()
    def put(self, user_id):
        """Update user details with ID"""
        user_data = api.payload

        current_user = get_jwt_identity()

        # CORRECTION: Gérer le cas où current_user est un dict ou une string
        current_user_id = current_user.get('id') if isinstance(current_user, dict) else current_user

        if current_user_id != user_id:
            return {'error': 'Unauthorized action'}, 403

        # CORRECTION DU PROBLÈME DE LA DATE pour la mise à jour
        if 'birthday' in user_data and user_data['birthday']:
            try:
                if isinstance(user_data['birthday'], str):
                    user_data['birthday'] = datetime.strptime(user_data['birthday'], '%Y-%m-%d').date()
            except (ValueError, TypeError) as e:
                return {'error': 'Invalid date format for birthday. Use YYYY-MM-DD'}, 400

        try:
            updated_user = facade.update_user(user_id, user_data)
            return {
                'id': updated_user.id,
                'first_name': updated_user.first_name,
                'last_name': updated_user.last_name,
                'email': updated_user.email
            }, 200
        except ValueError as e:
            return {'error': str(e)}, 404
        
@api.route('/coach/')
class Coach(Resource):
    @api.response(200, 'List of coach retrieved successfully')
    def get(self):
        """Retrieve a list of all coach"""
        users = facade.get_all_coach()
        return [user.to_dict() for user in users], 200
    
@api.route('/nutrition/')
class Nutrition(Resource):
    @api.response(200, 'List of coach of nutrition retrieved successfully')
    def get(self):
        """Retrieve a list of all coach of nutrition"""
        users = facade.get_all_nutrition()
        return [user.to_dict() for user in users], 200
    
@api.route('/admin/')
class Admin(Resource):
    @api.response(200, 'List of admin retrieved successfully')
    def get(self):
        """Retrieve a list of all admin"""
        users = facade.get_all_admin()
        return [user.to_dict() for user in users], 200

@api.route('/all_simple_user/')
class SimpleUser(Resource):
    @api.response(200, 'List of simple user retrieved successfully')
    def get(self):
        """Retrieve a list of all simple user"""
        users = facade.get_simple_user()
        return [user.to_dict() for user in users], 200

@api.route('/abonne/')
class Abonne(Resource):
    @api.response(200, 'List of abonne retrieved successfully')
    def get(self):
        """Retrieve a list of all abonne"""
        users = facade.get_all_abonne()
        return [user.to_dict() for user in users], 200

@api.route('/coach/<coach_id>/users')
class CoachUserList(Resource):
    @api.response(200, 'List of users from coach')
    @api.response(404, 'coach not found')
    def get(self, coach_id):
        """Get all users for a specific coach"""
        try:
            coach_users = facade.get_all_abonne_from_coach(coach_id)
            return [user.to_dict() for user in coach_users], 200
        except ValueError as e:
            return {'error': str(e)}, 400


@api.route('/admin/<user_id>')
class AdminUserModify(Resource):
    @api.expect(user_model, validate=True)
    @api.response(200, 'User updated successfully')
    @api.response(404, 'User not found')
    @api.response(400, 'Invalid input data')
    @api.response(403, 'Unauthorized - Admin privileges required')
    @api.doc(security="token")
    @jwt_required()
    def put(self, user_id):
        """Update user details with ID (Admin only)"""
        user_data = api.payload

        current_user = get_jwt_identity()

        # Vérifier que l'utilisateur est admin
        is_admin = current_user.get('is_admin', False) if isinstance(current_user, dict) else False
        
        if not is_admin:
            return {'error': 'Admin privileges required'}, 403

        email = user_data.get('email')

        # Ensure email uniqueness
        if email:
            existing_user = facade.get_user_by_email(email)
            if existing_user and existing_user.id != user_id:
                return {'error': 'Email already in use'}, 400

        # CORRECTION DU PROBLÈME DE LA DATE
        if 'birthday' in user_data and user_data['birthday']:
            try:
                if isinstance(user_data['birthday'], str):
                    user_data['birthday'] = datetime.strptime(user_data['birthday'], '%Y-%m-%d').date()
            except (ValueError, TypeError) as e:
                return {'error': 'Invalid date format for birthday. Use YYYY-MM-DD'}, 400

        try:
            updated_user = facade.update_user(user_id, user_data)
            return {
                'id': updated_user.id,
                'first_name': updated_user.first_name,
                'last_name': updated_user.last_name,
                'email': updated_user.email
            }, 200
        except ValueError as e:
            return {'error': str(e)}, 404