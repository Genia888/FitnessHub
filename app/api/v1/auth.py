from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token
from app.services.facade import facade
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt


api = Namespace('auth', description='Authentication operations')

# Model for input validation
login_model = api.model('Login', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password')
})

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

@api.route('/login')
class Login(Resource):
    @api.expect(login_model)
    def post(self):
        """Authenticate user and return a JWT token"""
        credentials = api.payload  # Get the email and password from the request payload
        
        # Step 1: Retrieve the user based on the provided email
        user = facade.get_user_by_email(credentials['email'])

        # Step 2: Check if the user exists and the password is correct
        if not user or not user.verify_password(credentials['password']):
            return {'error': 'Invalid credentials'}, 401

        # Step 3: Create a JWT token with the user's id and is_admin flag
        access_token = create_access_token(identity={'id': str(user.id), 'is_admin': user.is_admin})
        
        # Step 4: Return the JWT token to the client
        return {'access_token': access_token}, 200
    
@api.route('/protected')
class ProtectedResource(Resource):
    @api.doc(security="token")
    @jwt_required()
    def get(self):
        """A protected endpoint that requires a valid JWT token"""
        current_user = get_jwt_identity()
        return {'message': f'Hello, user {current_user["id"]}'}, 200
    
@api.route('/register')
class Register(Resource):
    def post(self):
        # votre logique