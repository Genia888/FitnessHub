from flask import Flask, redirect
from flask_restx import Api
from config import config
from flask_jwt_extended import JWTManager
from app.extensions import db
from app.api.v1.user import api as user_ns
from app.api.v1.review import api as review_ns
from app.api.v1.message import api as message_ns
from app.api.v1.subscription import api as subscription_ns
from app.api.v1.nutrition_schedule import api as nutrition_ns
from app.api.v1.workout_schedule import api as workout_ns
from app.api.v1.product_shop import api as product_ns
from app.api.v1.auth import api as auth_ns
from app.extension_bcrypt import bcrypt
from flask_cors import CORS

jwt = JWTManager()

def create_app(config_name='default'):
    app = Flask(__name__)

    @app.route("/")
    def home():
        return redirect("/api/v1/")

    app.config.from_object(config[config_name])
    jwt.init_app(app)
    db.init_app(app)
    bcrypt.init_app(app)

    CORS(app, 
         resources={r"/api/*": {"origins": "*"}},
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         supports_credentials=True)

    authorizations = {
        'token': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Authorization',
        }
    }

    api = Api(app, version='1.0', title='Fitness HUB Backend', doc='/api/v1/', authorizations=authorizations,
              description='HBnB Application API')

    api.add_namespace(user_ns, path='/api/v1/user')
    api.add_namespace(review_ns, path='/api/v1/review')
    api.add_namespace(message_ns, path='/api/v1/message')
    api.add_namespace(subscription_ns, path='/api/v1/subscription')
    api.add_namespace(nutrition_ns, path='/api/v1/nutrition')
    api.add_namespace(workout_ns, path='/api/v1/workout')
    api.add_namespace(product_ns, path='/api/v1/product_shop')
    api.add_namespace(auth_ns, path='/api/v1/auth')

    return app
