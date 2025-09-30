from abc import ABC, abstractmethod
from app.extensions import db
from app.models.user import User
from app.models.review import Review
from app.models.diet import Diet
from sqlalchemy import and_ 
from sqlalchemy.sql.expression import false

class Repository(ABC):
    @abstractmethod
    def add(self, obj):
        pass

    @abstractmethod
    def get(self, obj_id):
        pass

    @abstractmethod
    def get_all(self):
        pass

    @abstractmethod
    def update(self, obj_id, data):
        pass

    @abstractmethod
    def delete(self, obj_id):
        pass

    @abstractmethod
    def get_by_attribute(self, attr_name, attr_value):
        pass


class InMemoryRepository:
    """A simple in-memory repository for testing (not used with SQLAlchemy)."""
    def __init__(self):
        self._data = {}

    def add(self, obj):
        self._data[obj.id] = obj

    def get(self, obj_id):
        return self._data.get(obj_id)

    def get_all(self):
        return list(self._data.values())

    def update(self, obj_id, data):
        obj = self.get(obj_id)
        if obj:
            for key, value in data.items():
                setattr(obj, key, value)
        return obj

    def delete(self, obj_id):
        return self._data.pop(obj_id, None)

    def get_by_attribute(self, attr, value):
        for obj in self._data.values():
            if getattr(obj, attr, None) == value:
                return obj
        return None


# SQLAlchemy repositories
class BaseRepository:
    def __init__(self, model):
        self.model = model

    def add(self, obj):
        db.session.add(obj)
        db.session.commit()

    def get(self, obj_id):
        return self.model.query.get(obj_id)

    def get_all(self):
        return self.model.query.all()

    def update(self, obj_id, data):
        obj = self.get(obj_id)
        if obj:
            for key, value in data.items():
                setattr(obj, key, value)
            db.session.commit()
        return obj

    def delete(self, obj_id):
        obj = self.get(obj_id)
        if obj:
            db.session.delete(obj)
            db.session.commit()
        return obj

    def get_by_attribute(self, attr, value):
        return self.model.query.filter(getattr(self.model, attr) == value).first()



    def save(self, obj):
        db.session.add(obj)
        db.session.commit()

class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__(User)

    def get_all_coach(self):
        return self.model.query.filter_by(is_coach=True).all()

    def get_simple_user(self):
        return self.model.query.filter_by(is_subscribe=False , is_admin=False , is_diet=False , is_coach=False).all()

    def get_all_abonne(self):
        return self.model.query.filter_by(is_subscribe=True).all()

    def get_all_diet(self):
        return self.model.query.filter_by(is_diet=True).all()

    def get_all_admin(self):
        return self.model.query.filter_by(is_admin=True).all()

    def get_user_by_email(self, email):
        return self.model.query.filter_by(email=email).first()

class ReviewRepository(BaseRepository):
    def __init__(self):
        super().__init__(Review)

class DietRepository(BaseRepository):
    def __init__(self):
        super().__init__(Diet)