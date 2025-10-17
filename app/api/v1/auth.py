from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from app.services.facade import facade


api = Namespace('auth', description='Authentication operations')

# Model for login validation
login_model = api.model('Login', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password')
})

# Model for registration validation
register_model = api.model('Register', {
    'first_name': fields.String(required=True, description='First name', max_length=50),
    'last_name': fields.String(required=True, description='Last name', max_length=50),
    'email': fields.String(required=True, description='Email address'),
    'password': fields.String(required=True, description='Password'),
    'is_coach': fields.Boolean(required=False, default=False, description='Is user a coach'),
    'is_nutrition': fields.Boolean(required=False, default=False, description='Is user a nutritionist'),
    'adress1': fields.String(required=False, default='', description='Address line 1', max_length=100),
    'adress2': fields.String(required=False, default='', description='Address line 2', max_length=100),
    'postal_code': fields.String(required=False, default='', description='Postal code', max_length=20),
    'city': fields.String(required=False, default='', description='City', max_length=100),
    'allergy_comment': fields.String(required=False, default='', description='Allergy comments', max_length=10000),
    'physical_constraint': fields.String(required=False, default='', description='Physical constraints', max_length=10000),
    'coach_certif': fields.String(required=False, default='', description='Coach certifications', max_length=1000),
    'coach_experience': fields.String(required=False, default='', description='Coach experience', max_length=10000),
    'coach_description': fields.String(required=False, default='', description='Coach description', max_length=10000),
    'size': fields.Float(required=False, default=0.0, description='Height in cm'),
    'weight': fields.Float(required=False, default=0.0, description='Weight in kg'),
    'picture': fields.String(required=False, default='', description='Profile picture URL', max_length=1000),
})


@api.route('/register')
class Register(Resource):
    @api.expect(register_model)
    @api.response(201, 'User successfully registered')
    @api.response(400, 'Email already registered or invalid input')
    def post(self):
        """Register a new user"""
        user_data = api.payload
        
        # Validation des champs requis
        if not user_data.get('email') or not user_data.get('password'):
            return {'error': 'Email and password are required'}, 400
        
        if not user_data.get('first_name') or not user_data.get('last_name'):
            return {'error': 'First name and last name are required'}, 400
        
        # Check if email already exists
        existing_user = facade.get_user_by_email(user_data['email'])
        if existing_user:
            return {'error': 'Email already registered'}, 400
        
        # Convertir birthday en objet date si présent
        if 'birthday' in user_data and user_data['birthday']:
            from datetime import datetime
            try:
                # Convertir la chaîne '1996-02-23' en objet date
                user_data['birthday'] = datetime.strptime(user_data['birthday'], '%Y-%m-%d').date()
            except (ValueError, TypeError):
                return {'error': 'Invalid date format for birthday. Use YYYY-MM-DD'}, 400
        
        # Valeurs par défaut pour les champs optionnels
        user_data.setdefault('is_coach', False)
        user_data.setdefault('is_nutrition', False)
        user_data.setdefault('is_admin', False)
        user_data.setdefault('is_subscribe', False)
        user_data.setdefault('adress1', '')
        user_data.setdefault('adress2', '')
        user_data.setdefault('postal_code', '')
        user_data.setdefault('city', '')
        user_data.setdefault('allergy_comment', '')
        user_data.setdefault('physical_constraint', '')
        user_data.setdefault('coach_certif', '')
        user_data.setdefault('coach_experience', '')
        user_data.setdefault('coach_description', '')
        user_data.setdefault('size', 0.0)
        user_data.setdefault('weight', 0.0)
        user_data.setdefault('picture', '')
        
        try:
            # Create the new user
            new_user = facade.create_user(user_data)
            
            # Create JWT token for automatic login after registration
            access_token = create_access_token(
                identity={'id': str(new_user.id), 'is_admin': new_user.is_admin}
            )
            
            return {
                'message': 'User successfully registered',
                'access_token': access_token,
                'user': {
                    'id': new_user.id,
                    'first_name': new_user.first_name,
                    'last_name': new_user.last_name,
                    'email': new_user.email,
                    'is_coach': new_user.is_coach,
                    'is_nutrition': new_user.is_nutrition,
                    'is_admin': new_user.is_admin
                }
            }, 201
            
        except ValueError as e:
            return {'error': str(e)}, 400
        except Exception as e:
            print(f"Error during registration: {str(e)}")  # Log pour debug
            return {'error': 'An error occurred during registration'}, 500


@api.route('/login')
class Login(Resource):
    @api.expect(login_model)
    @api.response(200, 'Login successful')
    @api.response(401, 'Invalid credentials')
    def post(self):
        """Authenticate user and return a JWT token"""
        credentials = api.payload
        
        # Validation
        if not credentials.get('email') or not credentials.get('password'):
            return {'error': 'Email and password are required'}, 400
        
        # Retrieve the user based on the provided email
        user = facade.get_user_by_email(credentials['email'])

        # Check if the user exists and the password is correct
        if not user or not user.verify_password(credentials['password']):
            return {'error': 'Invalid credentials'}, 401

        # Create a JWT token with the user's id and is_admin flag
        access_token = create_access_token(
            identity={'id': str(user.id), 'is_admin': user.is_admin}
        )
        
        # ✅ IMPORTANT : Retourner les infos user en plus du token
        return {
            'access_token': access_token,
            'user': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'is_coach': user.is_coach,
                'is_nutrition': user.is_nutrition,
                'is_admin': user.is_admin
            }
        }, 200

    
@api.route('/protected')
class ProtectedResource(Resource):
    @api.doc(security="token")
    @jwt_required()
    def get(self):
        """A protected endpoint that requires a valid JWT token"""
        current_user = get_jwt_identity()
        return {'message': f'Hello, user {current_user["id"]}'}, 200