# app/models/subscription.py
from app.models.base_model import BaseModel
from app import db
from sqlalchemy.orm import validates
import json
import datetime

# Define a custom function to serialize datetime objects
def serialize_datetime(obj):
    if isinstance(obj, datetime.date):
        return obj.isoformat()
    raise TypeError("Type not serializable")

class Subscription(BaseModel):
    __tablename__ = 'Subscription'

    begin_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    option_nutrition = db.Column(db.Boolean, nullable=False)
    option_message = db.Column(db.Boolean, nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('User.id'),
                        nullable=False)
    coach_id = db.Column(db.String(36), db.ForeignKey('User.id'),
                         nullable=False)
    
    def __init__(self, begin_date, end_date, option_message, option_nutrition, user_id, coach_id):
        super().__init__()
        self.begin_date = begin_date
        self.end_date = end_date
        self.user_id = user_id
        self.coach_id = coach_id
        self.option_nutrition = option_nutrition
        self.option_message = option_message

    @validates('user_id')
    def validate_user_id(self, key, value):
        '''Validate the user_id attribute'''
        if not value or not isinstance(value, str):
            raise ValueError("User must be present and an instance of User.")
        return value

    def to_dict(self):
        '''Convert the Subscription object to a dictionary'''
        return {
            'id': self.id,
            'begin_date': self.begin_date.isoformat() if self.begin_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'option_nutrition': self.option_nutrition,
            'option_message': self.option_message,
            'user_id': self.user_id,
            'coach_id': self.coach_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }