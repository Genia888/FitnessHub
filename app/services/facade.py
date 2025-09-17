from app.models.user import User
from app.persistence.repository import InMemoryRepository, UserRepository

class HBnBFacade:
    def __init__(self):
        self.user_repo = UserRepository()

    # Placeholder method for creating a user
    def create_user(self, user_data):
        user = User(**user_data)
        user.hash_password(user_data['password'])
        self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        return self.user_repo.get_by_attribute('id', user_id)

    def get_user_by_email(self, email):
        return self.user_repo.get_by_attribute('email', email)
    
    # list all of users
    def get_all_users(self):
        return self.user_repo.get_all()
    
    # list all of coach
    def get_all_coach(self):
        return self.user_repo.get_all_coach()
        
    # list all of admin
    def get_all_admin(self):
        return self.user_repo.get_all_admin()
    
    # list all of diet
    def get_all_diet(self):
        return self.user_repo.get_all_diet()
    
    # list all of abonne
    def get_all_abonne(self):
        return self.user_repo.get_all_abonne()
    
    def update_user(self, user_id, update_data):
        """Update an user."""
        user = self.get_user(user_id)
        if not user:
            raise ValueError("User not found")

        user.update(update_data)
        self.user_repo.save(user)
        return user
        



# Instance globale
facade = HBnBFacade()
