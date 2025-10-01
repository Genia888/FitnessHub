# app/models/message.py
from app.models.base_model import BaseModel
from app import db
from sqlalchemy.orm import validates

class Message(BaseModel):
    __tablename__ = 'Message'

    date_message = db.Column(db.DateTime, nullable=False)
    text = db.Column(db.String(10000), nullable=False)
    is_read = db.Column(db.Boolean, nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('User.id'),
                        nullable=False)
    coach_id = db.Column(db.String(36), db.ForeignKey('User.id'),
                         nullable=False)


    def __init__(self, text, is_read, date_message, user, coach):
        super().__init__()
        if not text:
            raise ValueError("Message text is required.")
        self.text = text
        self.is_read = is_read
        self.user_id = user
        self.coach_id = coach
        self.date_message = date_message

    @validates('text')
    def validate_text(self, key, value):
        '''Validate the text attribute'''
        if not value or len(value) > 10000:
            raise ValueError(
                "Text review must be present and with 10000 characters maximum."
            )
        return value

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
            'text': self._text,
            'user_id': self._user_id,
            'coach_id': self._coach_id,
            'is_read': self._is_read,
            'date_message': self._date_message
        }

