# app/models/review.py
from app.models.base_model import BaseModel
from app import db
from sqlalchemy.orm import validates

class Review(BaseModel):
    __tablename__ = 'Review'

    text = db.Column(db.String(500), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('User.id'),
                        nullable=False)
    coach_id = db.Column(db.String(36), db.ForeignKey('User.id'),
                         nullable=False)


    def __init__(self, text, rating, user, coach):
        super().__init__()
        if not text:
            raise ValueError("Review text is required.")
        if not (0 <= rating <= 5):
            raise ValueError("Rating must be between 0 and 5.")
        self.text = text
        self.rating = rating
        self.user_id = user
        self.coach_id = coach

    @validates('text')
    def validate_text(self, key, value):
        '''Validate the text attribute'''
        if not value or len(value) > 500:
            raise ValueError(
                "Text review must be present and with 500 characters maximum."
            )
        return value

    @validates('user_id')
    def validate_user_id(self, key, value):
        '''Validate the user_id attribute'''
        if not value or not isinstance(value, str):
            raise ValueError("User must be present and an instance of User.")
        return value

    @validates('place_id')
    def validate_place_id(self, key, value):
        '''Validate the place_id attribute'''
        if not value or not isinstance(value, str):
            raise ValueError("Place must be present and an instance of Place.")
        return value

    @validates('rating')
    def validate_rating(self, key, value):
        '''Validate the rating attribute'''
        if not (1 <= value <= 5):
            raise ValueError("Rating must be between 1 and 5.")
        if not isinstance(value, int):
            raise TypeError("Rating must be an integer.")
        return value

    def to_dict(self):
        '''Convert the Review object to a dictionary'''
        return {
            'id': self.id,
            'text': self._text,
            'user_id': self._user_id,
            'coach_id': self._coach_id,
            'rating': self._rating
        }

