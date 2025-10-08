from app.extension_bcrypt import bcrypt
from app.extensions import db
from app.models.base_model import BaseModel


class Product(BaseModel):
    __tablename__ = 'Product_shop'  # Use plural for consistency

    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(2000), nullable=False)
    picture = db.Column(db.String(2000), nullable=False, unique=True)
    picture2 = db.Column(db.String(2000), nullable=False)
    picture3 = db.Column(db.String(2000), default=False)
    is_active = db.Column(db.Boolean, default=False)
    is_in_stock = db.Column(db.Boolean, default=False)
    price = db.Column(db.Float, default=False)
 
    def __init__(self, name: str, description: str, picture: str, picture2: str, picture3: str, is_active=False, is_in_stock=False, price: float=0):
        super().__init__()
        if not name or len(name) > 200:
            raise ValueError("First name is required and must be ≤ 200 characters.")
        if not description or len(description) > 2000:
            raise ValueError("Last name is required and must be ≤ 2000 characters.")
        if not picture or len(picture) > 2000:
            raise ValueError("Email is required and must be ≤ 2000 characters.")
        if not picture2 or len(picture2) > 2000:
            raise ValueError("Email is required and must be ≤ 2000 characters.")
        if not picture3 or len(picture3) > 2000:
            raise ValueError("Email is required and must be ≤ 2000 characters.")

        self.name = name
        self.description = description
        self.picture = picture
        self.picture2 = picture2
        self.picture3 = picture3
        self.is_active = is_active
        self.is_in_stock = is_in_stock
        self.price = price

    def __str__(self):
        """
        Used to return object as we want
        """
        return "{} {}".format(self.name, self.description)
    
    def to_dict(self):
        """Convert the users object to a dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "picture": self.picture,
            "picture2": self.picture2,
            "picture3": self.picture3,
            "is_active": self.is_active,
            "is_in_stock": self.is_in_stock,
            "price": self.price
        }
