from flask import Flask, redirect, send_from_directory
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
    app = Flask(__name__, static_folder='..', static_url_path='')

    @app.route("/")
    def home():
        return redirect("/api/v1/")

    app.config.from_object(config[config_name])
    jwt.init_app(app)
    db.init_app(app)
    bcrypt.init_app(app)

    # Configuration CORS corrigée - ACCEPTE TOUTES LES ORIGINES
    CORS(app, 
         resources={r"/api/*": {
             "origins": "*",  # ✅ Accepte toutes les origines
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": False,  # ✅ Changé à False car origins="*"
             "expose_headers": ["Content-Type", "Authorization"]
         }})

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

    # Routes pour servir les fichiers statiques
    @app.route('/pages/<path:filename>')
    def serve_pages(filename):
        return send_from_directory('../pages', filename)

    @app.route('/scripts/<path:filename>')
    def serve_scripts(filename):
        return send_from_directory('../scripts', filename)

    @app.route('/styles/<path:filename>')
    def serve_styles(filename):
        return send_from_directory('../styles', filename)

    @app.route('/assets/<path:subpath>/<path:filename>')
    def serve_assets(subpath, filename):
        return send_from_directory(f'../assets/{subpath}', filename)

    @app.route('/vendor/<path:subpath>/<path:filename>')
    def serve_vendor(subpath, filename):
        return send_from_directory(f'../vendor/{subpath}', filename)

    return app