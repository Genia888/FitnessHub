from datetime import datetime
import uuid
from app.extension_bcrypt import bcrypt
from app.extensions import db
from sqlalchemy.orm import validates, relationship
from app.models import user
from app.models.base_model import BaseModel

class User(BaseModel):
    __tablename__ = 'User'  # Use plural for consistency

    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_nutrition = db.Column(db.Boolean, default=False)
    is_coach = db.Column(db.Boolean, default=False)
    is_subscribe = db.Column(db.Boolean, default=False)
    adress1 = db.Column(db.String(100), nullable=False)
    adress2 = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    allergy_comment = db.Column(db.String(10000), nullable=False)
    physical_constraint = db.Column(db.String(10000), nullable=False)
    coach_certif = db.Column(db.String(1000), nullable=False)
    coach_experience = db.Column(db.String(10000), nullable=False)
    coach_description = db.Column(db.String(10000), nullable=False)
    size = db.Column(db.Float, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    picture = db.Column(db.String(1000), nullable=False)
    reviews = db.relationship('Review', backref='Author', lazy=True, foreign_keys='Review.coach_id')

    def __init__(self, first_name: str, last_name: str, email: str, password: str, is_admin=False, is_coach=False, is_nutrition=False, is_subscribe=False, adress1="", adress2="", postal_code="", city="", allergy_comment="", physical_constraint="", coach_certif="", coach_experience="", coach_description="", size="", weight="", picture=""):
        super().__init__()
        if not first_name or len(first_name) > 50:
            raise ValueError("First name is required and must be ≤ 50 characters.")
        if not last_name or len(last_name) > 50:
            raise ValueError("Last name is required and must be ≤ 50 characters.")
        if not email or len(email) > 100:
            raise ValueError("Email is required and must be ≤ 100 characters.")
        if '@' not in email:
            raise ValueError("Invalid email format.")
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.is_admin = is_admin
        self.is_coach = is_coach
        self.is_nutrition = is_nutrition
        self.is_subscribe = is_subscribe
        self.adress1 = adress1
        self.adress2 = adress2
        self.postal_code = postal_code
        self.city = city
        self.allergy_comment = allergy_comment
        self.physical_constraint = physical_constraint
        self.coach_certif = coach_certif
        self.coach_experience = coach_experience
        self.coach_description = coach_description
        self.size = size
        self.weight = weight
        self.picture = picture
        self.hash_password(password)

    def hash_password(self, password):
        """Hashes the password before storing it."""
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        """Verifies if the provided password matches the hashed password."""
        return bcrypt.check_password_hash(self.password, password)

    def __str__(self):
        """
        Used to return object as we want
        """
        return "{} {}".format(self.first_name, self.last_name)
    
    def to_dict(self):
        """Convert the users object to a dictionary."""
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "is_admin": self.is_admin,
            "is_coach": self.is_coach,
            "is_nutrition": self.is_nutrition,
            "is_subscribe": self.is_subscribe,
            "password": self.password, 
            "adress1": self.adress1,
            "adress2": self.adress2, 
            "code_postal": self.code_postal,
            "ville": self.ville,
            "texte_allergie": self.texte_allergie,
            "limitation_exercice": self.limitation_exercice,
            "coach_certif": self.coach_certif,
            "coach_experience": self.coach_experience,
            "coach_description": self.coach_description,
            "taille": self.taille,
            "poids": self.poids,
            "photo": self.photo,
            "reviews": [{'id': review.id, 'text': review.text, 'rating': review.rating}
                          for review in self.reviews]
        }
