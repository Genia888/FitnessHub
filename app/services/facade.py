from app.models.user import User
from app.models.review import Review
from app.models.message import Message
from app.models.subscription import Subscription
from app.models.nutrition_schedule import Nutrition
from app.models.workout_schedule import Workout
from app.models.product_shop import Product
from app.persistence.repository import ProductRepository, SubscriptionRepository, UserRepository, MessageRepository, NutritionRepository, ReviewRepository, WorkoutRepository
from datetime import datetime 

class HBnBFacade:
    def __init__(self):
        self.user_repo = UserRepository()
        self.review_repo = ReviewRepository()
        self.nutrition_repo = NutritionRepository()
        self.workout_repo = WorkoutRepository()
        self.message_repo = MessageRepository()
        self.subscription_repo = SubscriptionRepository()
        self.product_repo = ProductRepository()


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
    
    # list all of nutrition
    def get_all_nutrition(self):
        return self.user_repo.get_all_nutrition()
    
    # list all of abonne
    def get_simple_user(self):
        return self.user_repo.get_simple_user()

    # list all of abonne
    def get_all_abonne(self):
        return self.user_repo.get_all_abonne()
    
    # list all of abonne from a coach   
    def get_all_abonne_from_coach(self, coach_id):
        coach = self.user_repo.get(coach_id)
        if not coach:
            raise ValueError("Coach not found")
        return [self.user_repo.get(consumer.user_id) for consumer in
                coach.consumerUsers]
        
    
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


    # Message Facade
    def create_message(self, message_data):
        """Create a new message."""
        user = self.get_user(message_data['user_id'])
        if not user:
            raise ValueError("User not found.")
        coach = self.get_user(message_data['coach_id'])
        if not coach:
            raise ValueError("Coach not found.")
        message = Message(message_data['text'], message_data['is_read'], message_data['is_from_user'], message_data['user_id'], message_data['coach_id'])
        self.message_repo.add(message)
        return message      


    def get_message(self, message_id):
        message = self.message_repo.get(message_id)
        if not message:
            raise ValueError("Message not found")
        return message

    def get_all_messages(self):
        return self.message_repo.get_all()

    def get_messages_by_coach(self, coach_id):
        coach = self.user_repo.get(coach_id)
        if not coach:
            raise ValueError("Coach not found")
        return [message for message in
                self.message_repo.get_all() if message.coach_id == coach_id]


    def get_messages_by_user(self, user_id):
        user = self.user_repo.get(user_id)
        if not user:
            raise ValueError("User not found")
        return [message for message in
                self.message_repo.get_all() if message.user_id == user_id]

    def update_message(self, message_id, message_update):
        message = self.message_repo.get(message_id)
        if not message:
            raise ValueError("Message not found")
        for key, value in message_update.items():
            if hasattr(message, key):
                setattr(message, key, value)
        self.message_repo.update(message_id, message.__dict__)
        return message

    def delete_message(self, message_id):
        message = self.message_repo.get(message_id)
        if not message:
            raise ValueError("Message not found")
        self.message_repo.delete(message_id)
        return {'message': 'Review deleted succesessfully'}


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

    def get_nutrition_by_user(self, user_id):
        user = self.user_repo.get(user_id)
        if not user:
            raise ValueError("User not found")
        return [nutrition for nutrition in
                self.nutrition_repo.get_all() if nutrition.user_id == user_id]

    def get_workout_by_user(self, user_id):
        user = self.user_repo.get(user_id)
        if not user:
            raise ValueError("User not found")
        return [workout for workout in
                self.workout_repo.get_all() if workout.user_id == user_id]

    def get_reviews_by_coach(self, coach_id):
        coach = self.user_repo.get(coach_id)
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



    # workout Facade
    def create_workout(self, workout_data):
        """Create a new workout."""
        user = self.get_user(workout_data['user_id'])
        if not user:
            raise ValueError("User not found.")
        coach = self.get_user(workout_data['coach_id'])
        if not coach:
            raise ValueError("Coach not found.")
        workout = Workout(workout_data['description'], workout_data['picture'], workout_data['category'], workout_data['time'],workout_data['comment'],workout_data['date_workout'],  workout_data['user_id'], workout_data['coach_id'])
        self.workout_repo.add(workout)
        return workout      


    def get_workout(self, workout_id):
        workout = self.workout_repo.get(workout_id)
        if not workout:
            raise ValueError("workout not found")
        return workout

    def get_all_workout_schedule(self):
        return self.workout_repo.get_all()

    def update_workout(self, workout_id, workout_update):
        workout = self.review_repo.get(workout_id)
        if not workout:
            raise ValueError("workout not found")
        for key, value in workout_update.items():
            if hasattr(workout, key):
                setattr(workout, key, value)
        self.workout_repo.update(workout_id, workout.__dict__)
        return workout

    def delete_workout(self, workout_id):
        workout = self.workout_repo.get(workout_id)
        if not workout:
            raise ValueError("workout not found")
        self.workout_repo.delete(workout_id)
        return {'message': 'workout deleted succesessfully'}

    # workout Facade
    def create_nutrition(self, nutrition_data):
        """Create a new nutrition."""
        user = self.get_user(nutrition_data['user_id'])
        if not user:
            raise ValueError("User not found.")
        coach = self.get_user(nutrition_data['coach_id'])
        if not coach:
            raise ValueError("Coach not found.")
        print("affect nutrition date")
        nutrition_data["date_nutrition"] = datetime.fromisoformat(nutrition_data["date_nutrition"].replace("Z", "+00:00"))
        print("after nutrition date")
        nutrition = Nutrition(nutrition_data['description'], nutrition_data['picture'], nutrition_data['category'], nutrition_data['calories'],nutrition_data['quantity'],nutrition_data['date_nutrition'],  nutrition_data['user_id'], nutrition_data['coach_id'])
        print("suite nutrition date")
        self.nutrition_repo.add(nutrition)
        return nutrition      


    def get_nutrition(self, nutrition_id):
        nutrition = self.nutrition_repo.get(nutrition_id)
        if not nutrition:
            raise ValueError("nutrition not found")
        return nutrition

    def get_all_nutrition_schedule(self):
        return self.nutrition_repo.get_all()

    def update_nutrition(self, nutrition_id, nutrition_update):
        nutrition = self.review_repo.get(nutrition_id)
        if not nutrition:
            raise ValueError("nutrition not found")
        for key, value in nutrition_update.items():
            if hasattr(nutrition, key):
                setattr(nutrition, key, value)
        self.nutrition_repo.update(nutrition_id, nutrition.__dict__)
        return nutrition

    def delete_nutrition(self, nutrition_id):
        nutrition = self.nutrition_repo.get(nutrition_id)
        if not nutrition:
            raise ValueError("nutrition not found")
        self.nutrition_repo.delete(nutrition_id)
        return {'message': 'nutrition deleted succesessfully'}


    # Message Facade
    # Subscription Facade
    def create_subscription(self, subscription_data):
        """Create a new subscription."""
        user = self.get_user(subscription_data['user_id'])
        if not user:
            raise ValueError("User not found.")
        coach = self.get_user(subscription_data['coach_id'])
        if not coach:
            raise ValueError("Coach not found.")
        
        # Vérifier que c'est bien un coach
        if not coach.is_coach:
            raise ValueError("The specified user is not a coach.")
        
        # Créer un objet Subscription, PAS Nutrition !
        subscription = Subscription(
            subscription_data['begin_date'],
            subscription_data['end_date'],
            subscription_data['option_nutrition'],
            subscription_data['option_message'],
            subscription_data['user_id'],
            subscription_data['coach_id']
        )
        
        self.subscription_repo.add(subscription)
        return subscription     


    def get_subscription(self, subscription_id):
        subscription = self.subscription_repo.get(subscription_id)
        if not subscription:
            raise ValueError("subscription not found")
        return subscription

    def get_all_subscriptions(self):
        return self.subscription_repo.get_all()

    def get_subscriptions_by_coach(self, coach_id):
        coach = self.place_repo.get(coach_id)
        if not coach:
            raise ValueError("Coach not found")
        return [subscription for subscription in
                self.subscription_repo.get_all() if subscription.coach_id == coach_id]

    def update_subscription(self, subscription_id, subscription_update):
        subscription = self.subscription_repo.get(subscription_id)
        if not subscription:
            raise ValueError("subscription not found")
        for key, value in subscription_update.items():
            if hasattr(subscription, key):
                setattr(subscription, key, value)
        self.subscription_repo.update(subscription_id, subscription.__dict__)
        return subscription

    def delete_subscription(self, subscription_id):
        subscription = self.subscription_repo.get(subscription_id)
        if not subscription:
            raise ValueError("subscription not found")
        self.subscription_repo.delete(subscription_id)
        return {'subscription': 'Review deleted succesessfully'}


    # Placeholder method for creating a product
    def create_product(self, product_data):
        product = Product(**product_data)
        self.product_repo.add(product)
        return product

    def get_product(self, product_id):
        return self.product_repo.get_by_attribute('id', product_id)

    
    # list all of products
    def get_all_products(self):
        return self.product_repo.get_all()
    


    
    def update_product(self, product_id, update_data):
        """Update an product."""
        product = self.get_product(product_id)
        if not product:
            raise ValueError("product not found")

        product.update(update_data)
        self.product_repo.save(product)
        return product
        
    def delete_product(self, product_id):
        product = self.product_repo.get(product_id)
        if not product:
            raise ValueError("product not found")
        self.product_repo.delete(product_id)
        return {'message': 'product deleted successfully'}

# Instance globale
facade = HBnBFacade()
