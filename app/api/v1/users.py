from flask import request
from flask_restx import Namespace, Resource, fields
from app.services.facade import facade
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

api = Namespace("users", description="User operations")

user_model = api.model("User", {
    "first_name": fields.String(required=True, max_length=50),
    "last_name": fields.String(required=True, max_length=50),
    "password": fields.String(required=True, max_length=50),
    "is_admin" : fields.Boolean(required=True, default=False),
    "is_coach" : fields.Boolean(required=True, default=False),
    "is_diet" : fields.Boolean(required=True, default=False),
    "adresse1": fields.String(required=True, max_length=100),
    "adresse2": fields.String(required=True, max_length=100),
    "code_postal": fields.String(required=True, max_length=20),
    "ville": fields.String(required=True, max_length=100),
    "texte_allergie": fields.String(Require=True, max_length=10000),
    "limitation_exercice": fields.String(Require=True, max_length=10000),
    "coach_certif": fields.String(Require=True, max_length=1000),
    "coach_experience": fields.String(Require=True, max_length=10000),
    "coach_description": fields.String(Require=True, max_length=10000),
    "email": fields.String(required=True),
    "taille": fields.Float(Require=True),
    "poids": fields.Float(Require=True),
    "photo": fields.String(required=True, max_length=1000),
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

        
        new_user = facade.create_user(user_data)
        return {'id': new_user.id, 'first_name': new_user.first_name, 'last_name': new_user.last_name, 
                "password": new_user.password, 'email': new_user.email,
                "is_admin": new_user.is_admin, "is_coach": new_user.is_coach,
                "is_diet": new_user.is_diet, "password": new_user.password, 
                "adresse1": new_user.adresse1, "adresse2": new_user.adresse2, 
                "code_postal": new_user.code_postal, "ville": new_user.ville, 
                "texte_allergie": new_user.texte_allergie, "limitation_exercice": new_user.limitation_exercice,
                "coach_certif" : new_user.coach_certif, "coach_experience" : new_user.coach_experience,
                  "coach_description": new_user.coach_description,
                    "taille" : new_user.taille, "poids" : new_user.poids,
                  "photo": new_user.photo  }, 201

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
        return {'id': user.id, 'first_name': user.first_name, 'last_name': user.last_name, 'email': user.email,
                "is_admin": user.is_admin, "is_coach": user.is_coach,
                "is_diet": user.is_diet, "is_abonne": user.is_abonne, "password": user.password, 
                "adresse1": user.adresse1, "adresse2": user.adresse2, 
                "code_postal": user.code_postal, "ville": user.ville, "texte_allergie": user.texte_allergie,
            "limitation_exercice": user.limitation_exercice,
            "coach_certif": user.coach_certif,
            "coach_experience": user.coach_experience,
            "coach_description": user.coach_description,
            "taille": user.taille,
            "poids": user.poids,
            "photo": user.photo
                }, 200              
    
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

        if current_user['id'] != user_id:
            return {'error': 'Unauthorized action'}, 403

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
    
@api.route('/diet/')
class Diet(Resource):
    @api.response(200, 'List of diet retrieved successfully')
    def get(self):
        """Retrieve a list of all diet"""
        users = facade.get_all_diet()
        return [user.to_dict() for user in users], 200
    
@api.route('/admin/')
class Admin(Resource):
    @api.response(200, 'List of admin retrieved successfully')
    def get(self):
        """Retrieve a list of all admin"""
        users = facade.get_all_admin()
        return [user.to_dict() for user in users], 200

@api.route('/abonne/')
class Abonne(Resource):
    @api.response(200, 'List of abonne retrieved successfully')
    def get(self):
        """Retrieve a list of all abonne"""
        users = facade.get_all_abonne()
        return [user.to_dict() for user in users], 200

@api.route('/users/')
class AdminUserCreate(Resource):
    @jwt_required()
    def post(self):
        """Register a new user for admin"""
        current_user = get_jwt_identity()
        if not current_user.get('is_admin'):
            return {'error': 'Admin privileges required'}, 403

        user_data = request.json
        email = user_data.get('email')

        # Check if email is already in use
        if facade.get_user_by_email(email):
            return {'error': 'Email already registered'}, 400

        # Logic to create a new user
        pass

class AdminUserModify(Resource):
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

        if current_user['id'] != user_id:
            return {'error': 'Unauthorized action'}, 403

        email = user_data.get('email')

        # Ensure email uniqueness
        if email:
            existing_user = facade.get_user_by_email(email)
            if existing_user and existing_user.id != user_id:
                return {'error': 'Email already in use'}, 400

        
        if not current_user.get('is_admin'):
            return {'error': 'Admin privileges required'}, 403

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
        

