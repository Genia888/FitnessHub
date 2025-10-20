#!/usr/bin/env python3
"""
Script de création de données de test pour subscriber.html
Usage: python create_test_data.py
"""

import requests
import json
from datetime import datetime, timedelta

# Configuration
BASE_URL = "http://127.0.0.1:5000/api/v1"

# Couleurs pour le terminal
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_success(msg):
    print(f"{Colors.GREEN}✅ {msg}{Colors.END}")

def print_error(msg):
    print(f"{Colors.RED}❌ {msg}{Colors.END}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ️  {msg}{Colors.END}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠️  {msg}{Colors.END}")

# ============================================
# 1. Créer un client (utilisateur)
# ============================================
def create_client():
    print_info("Création d'un utilisateur client...")
    
    client_data = {
        "email": "client@test.com",
        "password": "password123",
        "first_name": "John",
        "last_name": "Doe",
        "weight": 75.5,
        "size": 1.80,
        "is_coach": False,
        "physical_constraint": "Lose 5kg and build muscle"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=client_data)
        
        if response.status_code == 201:
            data = response.json()
            print_success(f"Client créé: {data['user']['email']}")
            print_info(f"ID: {data['user']['id']}")
            return data['access_token'], data['user']['id']
        else:
            # Si l'utilisateur existe déjà, on se connecte
            print_warning("Client existe déjà, connexion...")
            login_response = requests.post(f"{BASE_URL}/auth/login", json={
                "email": client_data["email"],
                "password": client_data["password"]
            })
            
            if login_response.status_code == 200:
                data = login_response.json()
                print_success(f"Connecté: {data['user']['email']}")
                print_info(f"ID: {data['user']['id']}")
                return data['access_token'], data['user']['id']
            else:
                print_error(f"Erreur: {login_response.text}")
                return None, None
    except Exception as e:
        print_error(f"Erreur lors de la création du client: {e}")
        return None, None

# ============================================
# 2. Créer un coach
# ============================================
def create_coach():
    print_info("Création d'un coach...")
    
    coach_data = {
        "email": "coach@test.com",
        "password": "password123",
        "first_name": "Jane",
        "last_name": "Smith",
        "is_coach": True,
        "coach_experience": "5 years of professional training",
        "coach_description": "Certified fitness trainer specializing in weight loss and muscle building",
        "coach_certif": "NASM Certified Personal Trainer"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=coach_data)
        
        if response.status_code == 201:
            data = response.json()
            print_success(f"Coach créé: {data['user']['email']}")
            print_info(f"ID: {data['user']['id']}")
            return data['user']['id']
        else:
            # Si le coach existe déjà, on récupère son ID
            print_warning("Coach existe déjà, récupération de l'ID...")
            login_response = requests.post(f"{BASE_URL}/auth/login", json={
                "email": coach_data["email"],
                "password": coach_data["password"]
            })
            
            if login_response.status_code == 200:
                data = login_response.json()
                print_success(f"Coach trouvé: {data['user']['email']}")
                print_info(f"ID: {data['user']['id']}")
                return data['user']['id']
            else:
                print_error(f"Erreur: {login_response.text}")
                return None
    except Exception as e:
        print_error(f"Erreur lors de la création du coach: {e}")
        return None

# ============================================
# 3. Créer une subscription (lien client-coach)
# ============================================
def create_subscription(client_id, coach_id, token):
    print_info("Création de l'abonnement client-coach...")
    
    today = datetime.now()
    end_date = today + timedelta(days=365)
    
    subscription_data = {
        "user_id": client_id,
        "coach_id": coach_id,
        "begin_date": today.strftime("%Y-%m-%d"),
        "end_date": end_date.strftime("%Y-%m-%d"),
        "option_nutrition": True,
        "option_message": True
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{BASE_URL}/subscription", json=subscription_data, headers=headers)
        
        if response.status_code == 201:
            print_success("Abonnement créé avec succès")
            return True
        else:
            print_error(f"Erreur lors de la création de l'abonnement: {response.text}")
            return False
    except Exception as e:
        print_error(f"Erreur: {e}")
        return False

# ============================================
# 4. Créer des exercices (workout)
# ============================================
def create_workouts(client_id, token):
    print_info("Création des exercices...")
    
    workouts = [
        {
            "user_id": client_id,
            "category": "Upper Body",
            "description": "Push-ups: 3 sets of 15 reps, Pull-ups: 3 sets of 10 reps",
            "time": 30
        },
        {
            "user_id": client_id,
            "category": "Cardio",
            "description": "Running: 5km at moderate pace",
            "time": 45
        },
        {
            "user_id": client_id,
            "category": "Lower Body",
            "description": "Squats: 4 sets of 12 reps, Lunges: 3 sets of 10 reps per leg",
            "time": 40
        },
        {
            "user_id": client_id,
            "category": "Full Body",
            "description": "Burpees: 3 sets of 15, Mountain climbers: 3 sets of 20",
            "time": 35
        },
        {
            "user_id": client_id,
            "category": "Yoga",
            "description": "Flexibility and balance exercises",
            "time": 60
        }
    ]
    
    headers = {"Authorization": f"Bearer {token}"}
    created = 0
    
    for workout in workouts:
        try:
            response = requests.post(f"{BASE_URL}/workout", json=workout, headers=headers)
            if response.status_code == 201:
                created += 1
            else:
                print_warning(f"Workout non créé: {workout['category']}")
        except Exception as e:
            print_error(f"Erreur: {e}")
    
    print_success(f"{created}/{len(workouts)} exercices créés")
    return created > 0

# ============================================
# 5. Créer un plan nutritionnel
# ============================================
def create_nutrition(client_id, token):
    print_info("Création du plan nutritionnel...")
    
    meals = [
        {
            "user_id": client_id,
            "category": "Breakfast",
            "description": "Oatmeal with fruits, nuts and honey",
            "calories": 400
        },
        {
            "user_id": client_id,
            "category": "Morning Snack",
            "description": "Greek yogurt with berries",
            "calories": 150
        },
        {
            "user_id": client_id,
            "category": "Lunch",
            "description": "Grilled chicken with quinoa and vegetables",
            "calories": 600
        },
        {
            "user_id": client_id,
            "category": "Afternoon Snack",
            "description": "Almonds and an apple",
            "calories": 200
        },
        {
            "user_id": client_id,
            "category": "Dinner",
            "description": "Grilled salmon with sweet potato and broccoli",
            "calories": 550
        }
    ]
    
    headers = {"Authorization": f"Bearer {token}"}
    created = 0
    
    for meal in meals:
        try:
            response = requests.post(f"{BASE_URL}/nutrition", json=meal, headers=headers)
            if response.status_code == 201:
                created += 1
            else:
                print_warning(f"Repas non créé: {meal['category']}")
        except Exception as e:
            print_error(f"Erreur: {e}")
    
    print_success(f"{created}/{len(meals)} repas créés")
    return created > 0

# ============================================
# 6. Créer des messages
# ============================================
def create_messages(client_id, token):
    print_info("Création des messages...")
    
    messages = [
        {
            "user_id": client_id,
            "text": "Hello coach! I'm excited to start my fitness journey!",
            "is_from_user": True
        },
        {
            "user_id": client_id,
            "text": "Hi John! Great to have you here. Let's work together to achieve your goals!",
            "is_from_user": False
        },
        {
            "user_id": client_id,
            "text": "I finished today's upper body workout. It was challenging but I feel great!",
            "is_from_user": True
        },
        {
            "user_id": client_id,
            "text": "Excellent work! Remember to stretch and stay hydrated. How's your nutrition going?",
            "is_from_user": False
        },
        {
            "user_id": client_id,
            "text": "I'm following the meal plan perfectly. The breakfast is delicious!",
            "is_from_user": True
        }
    ]
    
    headers = {"Authorization": f"Bearer {token}"}
    created = 0
    
    for message in messages:
        try:
            response = requests.post(f"{BASE_URL}/message", json=message, headers=headers)
            if response.status_code == 201:
                created += 1
            else:
                print_warning(f"Message non créé")
        except Exception as e:
            print_error(f"Erreur: {e}")
    
    print_success(f"{created}/{len(messages)} messages créés")
    return created > 0

# ============================================
# MAIN - Exécution du script
# ============================================
def main():
    print("\n" + "="*60)
    print("🚀 CRÉATION DES DONNÉES DE TEST POUR SUBSCRIBER.HTML")
    print("="*60 + "\n")
    
    # 1. Créer le client
    client_token, client_id = create_client()
    if not client_id:
        print_error("Impossible de créer le client. Arrêt du script.")
        return
    
    print()
    
    # 2. Créer le coach
    coach_id = create_coach()
    if not coach_id:
        print_error("Impossible de créer le coach. Arrêt du script.")
        return
    
    print()
    
    # 3. Créer la subscription
    create_subscription(client_id, coach_id, client_token)
    print()
    
    # 4. Créer les exercices
    create_workouts(client_id, client_token)
    print()
    
    # 5. Créer le plan nutritionnel
    create_nutrition(client_id, client_token)
    print()
    
    # 6. Créer les messages
    create_messages(client_id, client_token)
    print()
    
    # Résumé final
    print("="*60)
    print("✅ DONNÉES DE TEST CRÉÉES AVEC SUCCÈS")
    print("="*60)
    print(f"\n📧 Email: client@test.com")
    print(f"🔑 Password: password123")
    print(f"🆔 User ID: {client_id}")
    print(f"\n🔗 Connexion: http://127.0.0.1:5000/pages/connexion.html")
    print(f"📊 Dashboard: http://127.0.0.1:5000/pages/subscriber.html")
    print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print_warning("\n\nScript interrompu par l'utilisateur")
    except Exception as e:
        print_error(f"Erreur inattendue: {e}")