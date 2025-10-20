#!/usr/bin/env python3
"""
Script de suppression des données de test UNIQUEMENT
Supprime seulement client@test.com et coach@test.com
Usage: python clean_test_data.py
"""

import requests

BASE_URL = "http://127.0.0.1:5000/api/v1"

# Emails des comptes de test à supprimer
TEST_EMAILS = ["client@test.com", "coach@test.com"]
TEST_PASSWORD = "password123"

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

def get_user_token_and_id(email, password):
    """Se connecte et récupère le token et l'ID"""
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json={
            "email": email,
            "password": password
        })
        
        if response.status_code == 200:
            data = response.json()
            return data['access_token'], data['user']['id']
        else:
            return None, None
    except Exception as e:
        return None, None

def delete_user_data(user_id, token):
    """Supprime toutes les données associées à un utilisateur"""
    headers = {"Authorization": f"Bearer {token}"}
    deleted = []
    
    # 1. Supprimer les workouts
    try:
        response = requests.get(f"{BASE_URL}/workout/?user_id={user_id}", headers=headers)
        if response.status_code == 200:
            workouts = response.json()
            for workout in workouts:
                del_response = requests.delete(f"{BASE_URL}/workout/{workout['id']}", headers=headers)
                if del_response.status_code in [200, 204]:
                    deleted.append("workout")
    except Exception as e:
        print_warning(f"Erreur lors de la suppression des workouts: {e}")
    
    # 2. Supprimer les nutrition
    try:
        response = requests.get(f"{BASE_URL}/nutrition/?user_id={user_id}", headers=headers)
        if response.status_code == 200:
            nutrition = response.json()
            for meal in nutrition:
                del_response = requests.delete(f"{BASE_URL}/nutrition/{meal['id']}", headers=headers)
                if del_response.status_code in [200, 204]:
                    deleted.append("nutrition")
    except Exception as e:
        print_warning(f"Erreur lors de la suppression de la nutrition: {e}")
    
    # 3. Supprimer les messages
    try:
        response = requests.get(f"{BASE_URL}/message/?user_id={user_id}", headers=headers)
        if response.status_code == 200:
            messages = response.json()
            for message in messages:
                del_response = requests.delete(f"{BASE_URL}/message/{message['id']}", headers=headers)
                if del_response.status_code in [200, 204]:
                    deleted.append("message")
    except Exception as e:
        print_warning(f"Erreur lors de la suppression des messages: {e}")
    
    # 4. Supprimer les subscriptions
    try:
        response = requests.get(f"{BASE_URL}/subscription/?user_id={user_id}", headers=headers)
        if response.status_code == 200:
            subscriptions = response.json()
            for sub in subscriptions:
                del_response = requests.delete(f"{BASE_URL}/subscription/{sub['id']}", headers=headers)
                if del_response.status_code in [200, 204]:
                    deleted.append("subscription")
    except Exception as e:
        print_warning(f"Erreur lors de la suppression des subscriptions: {e}")
    
    # 5. Supprimer l'utilisateur lui-même
    try:
        response = requests.delete(f"{BASE_URL}/user/{user_id}", headers=headers)
        if response.status_code in [200, 204]:
            deleted.append("user")
            return True, deleted
    except Exception as e:
        print_warning(f"Erreur lors de la suppression de l'utilisateur: {e}")
    
    return False, deleted

def main():
    print("\n" + "="*60)
    print("🗑️  SUPPRESSION DES DONNÉES DE TEST UNIQUEMENT")
    print("="*60 + "\n")
    
    print_info("Ce script supprime UNIQUEMENT :")
    print("   - client@test.com et toutes ses données")
    print("   - coach@test.com et toutes ses données")
    print("\n❗ Les autres utilisateurs ne seront PAS affectés\n")
    
    confirmation = input("Continuer ? (tapez 'oui'): ")
    
    if confirmation.lower() != 'oui':
        print_info("Suppression annulée")
        return
    
    print()
    
    for email in TEST_EMAILS:
        print_info(f"Traitement de {email}...")
        
        # Se connecter
        token, user_id = get_user_token_and_id(email, TEST_PASSWORD)
        
        if not token or not user_id:
            print_warning(f"Utilisateur {email} non trouvé (déjà supprimé ou n'existe pas)")
            continue
        
        # Supprimer toutes les données
        success, deleted = delete_user_data(user_id, token)
        
        if success:
            print_success(f"{email} et ses données supprimés ({len(deleted)} éléments)")
        else:
            print_warning(f"Suppression partielle pour {email}")
        
        print()
    
    print("="*60)
    print_success("NETTOYAGE DES DONNÉES DE TEST TERMINÉ")
    print("="*60)
    print(f"\n💡 Utilisez {Colors.GREEN}python create_test_data.py{Colors.END} pour recréer les données de test\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print_warning("\n\nScript interrompu par l'utilisateur")
    except Exception as e:
        print_error(f"Erreur inattendue: {e}")