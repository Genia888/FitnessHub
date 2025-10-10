from datetime import datetime
import uuid
from app.extension_bcrypt import bcrypt
from app.extensions import db
from sqlalchemy.orm import validates, relationship
from app.models import user
from app.models.base_model import BaseModel

class Workout(BaseModel):
    __tablename__ = 'Workout_schedule'  # Use plural for consistency

    description = db.Column(db.String(10000), nullable=False)
    picture = db.Column(db.String(1000), nullable=False)
    category = db.Column(db.String(36), nullable=False)
    time = db.Column(db.Float, default=0)
    comment = db.Column(db.String(1000), default=0)
    date_workout = db.Column(db.DateTime, default=0)
    user_id = db.Column(db.String(36), db.ForeignKey('User.id'),
                        nullable=False)
    coach_id = db.Column(db.String(36), db.ForeignKey('User.id'),
                         nullable=False)
    
    def __init__(self, description: str, picture: str, category: str, time: float, comment: str, date_workout,  user, coach ):
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
        self.time = time
        self.user_id = user
        self.coach_id = coach
        self.comment = comment
        self.date_workout = date_workout

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
            'time': self.time,
            'comment': self.comment,
            'date_workout': self.date_workout.isoformat(),
            'user_id': self.user_id,
            'coach_id': self.coach_id
        }
