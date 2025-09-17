from datetime import datetime
import uuid
from app.extension_bcrypt import bcrypt
from app.extensions import db
from sqlalchemy.orm import validates, relationship
from app.models import user
from app.models.base_model import BaseModel

class User(BaseModel):
    __tablename__ = 'users'  # Use plural for consistency

    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_diet = db.Column(db.Boolean, default=False)
    is_coach = db.Column(db.Boolean, default=False)
    is_abonne = db.Column(db.Boolean, default=False)
    adresse1 = db.Column(db.String(100), nullable=False)
    adresse2 = db.Column(db.String(100), nullable=False)
    code_postal = db.Column(db.String(20), nullable=False)
    ville = db.Column(db.String(100), nullable=False)
    texte_allergie = db.Column(db.String(10000), nullable=False)
    limitation_exercice = db.Column(db.String(10000), nullable=False)
    coach_certif = db.Column(db.String(1000), nullable=False)
    coach_experience = db.Column(db.String(10000), nullable=False)
    coach_description = db.Column(db.String(10000), nullable=False)
    taille = db.Column(db.Float, nullable=False)
    poids = db.Column(db.Float, nullable=False)
    photo = db.Column(db.String(1000), nullable=False)

    def __init__(self, first_name: str, last_name: str, email: str, password: str, is_admin=False, is_coach=False, is_diet=False, is_abonne=False, adresse1="", adresse2="", code_postal="", ville="", texte_allergie="", limitation_exercice="", coach_certif="", coach_experience="", coach_description="", taille="", poids="", photo=""):
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
        self.is_diet = is_diet
        self.is_abonne = is_abonne
        self.adresse1 = adresse1
        self.adresse2 = adresse2
        self.code_postal = code_postal
        self.ville = ville
        self.texte_allergie = texte_allergie
        self.limitation_exercice = limitation_exercice
        self.coach_certif = coach_certif
        self.coach_experience = coach_experience
        self.coach_description = coach_description
        self.taille = taille
        self.poids = poids
        self.photo = photo
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
            "is_diet": self.is_diet,
            "is_abonne": self.is_abonne,
            "password": self.password, 
            "adresse1": self.adresse1,
            "adresse2": self.adresse2, 
            "code_postal": self.code_postal,
            "ville": self.ville,
            "texte_allergie": self.texte_allergie,
            "limitation_exercice": self.limitation_exercice,
            "coach_certif": self.coach_certif,
            "coach_experience": self.coach_experience,
            "coach_description": self.coach_description,
            "taille": self.taille,
            "poids": self.poids,
            "photo": self.photo
        }
