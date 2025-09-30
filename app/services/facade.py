from app.models.user import User
from app.models.review import Review
from app.models.diet import Diet
from app.persistence.repository import InMemoryRepository, UserRepository, DietRepository, ReviewRepository

class HBnBFacade:
    def __init__(self):
        self.user_repo = UserRepository()
        self.review_repo = ReviewRepository()
        self.diet_repo = DietRepository()

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
    def get_simple_user(self):
        return self.user_repo.get_simple_user()

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
        
    def delete_user(self, user_id):
        user = self.user_repo.get(user_id)
        if not user:
            raise ValueError("User not found")
        self.user_repo.delete(user_id)
        return {'message': 'User deleted successfully'}

    # Review Facade
    def create_review(self, review_data):
        """Create a new review."""
        user = self.get_user(review_data['user_id'])
        if not user:
            raise ValueError("User not found.")
        coach = self.get_user(review_data['coach_id'])
        if not coach:
            raise ValueError("Coach not found.")
        review = Review(review_data['text'], review_data['rating'], review_data['user_id'], review_data['coach_id'])
        self.review_repo.add(review)
        return review      


    def get_review(self, review_id):
        review = self.review_repo.get(review_id)
        if not review:
            raise ValueError("Review not found")
        return review

    def get_all_reviews(self):
        return self.review_repo.get_all()

    def get_reviews_by_coach(self, coach_id):
        coach = self.place_repo.get(coach_id)
        if not coach:
            raise ValueError("Coach not found")
        return [review for review in
                self.review_repo.get_all() if review.coach_id == coach_id]

    def update_review(self, review_id, review_update):
        review = self.review_repo.get(review_id)
        if not review:
            raise ValueError("Review not found")
        for key, value in review_update.items():
            if hasattr(review, key):
                setattr(review, key, value)
        self.review_repo.update(review_id, review.__dict__)
        return review

    def delete_review(self, review_id):
        review = self.review_repo.get(review_id)
        if not review:
            raise ValueError("Review not found")
        self.review_repo.delete(review_id)
        return {'message': 'Review deleted succesessfully'}



    # Diet Facade
    def create_diet(self, diet_data):
        """Create a new diet."""
        user = self.get_user(diet_data['user_id'])
        if not user:
            raise ValueError("User not found.")
        coach = self.get_user(diet_data['coach_id'])
        if not coach:
            raise ValueError("Coach not found.")
        diet = Diet(diet_data['text'], diet_data['rating'], diet_data['user_id'], diet_data['coach_id'])
        self.diet_repo.add(diet)
        return diet      


    def get_diet(self, diet_id):
        diet = self.diet_repo.get(diet_id)
        if not diet:
            raise ValueError("Diet not found")
        return diet

    def get_all_diets(self):
        return self.diet_repo.get_all()

    def update_diet(self, diet_id, diet_update):
        diet = self.review_repo.get(diet_id)
        if not diet:
            raise ValueError("Diet not found")
        for key, value in diet_update.items():
            if hasattr(diet, key):
                setattr(diet, key, value)
        self.diet_repo.update(diet_id, diet.__dict__)
        return diet

    def delete_diet(self, diet_id):
        diet = self.diet_repo.get(diet_id)
        if not diet:
            raise ValueError("Diet not found")
        self.diet_repo.delete(diet_id)
        return {'message': 'Diet deleted succesessfully'}


# Instance globale
facade = HBnBFacade()
