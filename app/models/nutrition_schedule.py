from datetime import datetime
import uuid
from app.extension_bcrypt import bcrypt
from app.extensions import db
from sqlalchemy.orm import validates, relationship
from app.models import user
from app.models.base_model import BaseModel

class Nutrition(BaseModel):
    __tablename__ = 'Nutrition_schedule'  # Use plural for consistency

    description = db.Column(db.String(10000), nullable=False)
    picture = db.Column(db.String(1000), nullable=False)
    category = db.Column(db.String(36), nullable=False)
    calories = db.Column(db.Float, default=0)
    quantity = db.Column(db.Float, default=0)
    date_nutrition = db.Column(db.DateTime)
    user_id = db.Column(db.String(36), db.ForeignKey('User.id'),
                        nullable=False)
    coach_id = db.Column(db.String(36), db.ForeignKey('User.id'),
                         nullable=False)
    

    def __init__(self, description: str, picture: str, category: str, calories: float, quantity: float, date_nutrition: datetime, user, coach ):
        super().__init__()
        if not description or len(description) > 10000:
            raise ValueError("Description is required and must be ≤ 10000 characters.")
        if not picture or len(picture) > 1000:
            raise ValueError("Picture is required and must be ≤ 1000 characters.")
        if not category or len(category) > 36:
            raise ValueError("Category is required and must be ≤ 36 characters.")
        self.description = description
        self.picture = picture
        self.category = category
        self.calories = calories
        self.quantity = quantity
        self.date_nutrition = date_nutrition
        self.user_id = user
        self.coach_id = coach


    def __str__(self):
        """
        Used to return object as we want
        """
        return "{} {}".format(self.description)
    
    def to_dict(self):
        '''Convert the Review object to a dictionary'''
        return {
            'id': self.id,
            'description': self.description,
            'picture': self.picture,
            'category': self.category,
            'calories': self.calories,
            'quantity': self.quantity,
            'date_nutrition': self.date_nutrition.isoformat(),
            'user_id': self.user_id,
            'coach_id': self.coach_id
        }
