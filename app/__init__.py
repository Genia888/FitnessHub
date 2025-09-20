from flask import Flask, render_template, redirect, url_for
from flask_restx import Api
from config import config
from flask_jwt_extended import JWTManager
from app.extensions import db
from app.api.v1.users import api as users_ns
from app.api.v1.reviews import api as reviews_ns
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

    CORS(app)

    authorizations = {
        'token': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Authorization',
        }
    }

    api = Api(app, version='1.0', title='Fitness HUB Backend', doc='/api/v1/', authorizations=authorizations,
              description='HBnB Application API')

    api.add_namespace(users_ns, path='/api/v1/users')
    api.add_namespace(reviews_ns, path='/api/v1/reviews')
    api.add_namespace(auth_ns, path='/api/v1/auth')

    return app
