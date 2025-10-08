# app/models/message.py
from app.models.base_model import BaseModel
from app import db
from sqlalchemy.orm import validates

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


    def __init__(self, begin_date, end_date, option_message, option_nutrition, user, coach):
        super().__init__()
        #if not text:
        #    raise ValueError("Message text is required.")
        self.begin_date = begin_date
        self.end_date = end_date
        self.user_id = user
        self.coach_id = coach
        self.option_nutrition = option_nutrition
        self.option_message = option_message

    @validates('user_id')
    def validate_user_id(self, key, value):
        '''Validate the user_id attribute'''
        if not value or not isinstance(value, str):
            raise ValueError("User must be present and an instance of User.")
        return value

    def to_dict(self):
        '''Convert the Message object to a dictionary'''
        return {
            'id': self.id,
            'begin_date': self._begin_date,
            'end_date': self._end_date,
            'option_nutrition': self._option_nutrition,
            'option_message': self._option_message,
            'user_id': self._user_id,
            'coach_id': self._coach_id
        }

