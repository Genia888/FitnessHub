#!/usr/bin/env python3
"""
Script pour afficher les utilisateurs de test
Usage: python show_test_users.py
"""

import requests
import json

BASE_URL = "http://127.0.0.1:5000/api/v1"

# Couleurs
class Colors:
    GREEN = '\033[92m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    YELLOW = '\033[93m'
    END = '\033[0m'

def print_header(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def get_user_info(email, password):
    """Récupère les infos d'un utilisateur"""
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json={
            "email": email,
            "password": password
        })
        
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except Exception as e:
        return None

def main():
    print_header("👥 UTILISATEURS DE TEST DISPONIBLES")
    
    # Client
    print(f"\n{Colors.CYAN}📧 CLIENT (Utilisateur){Colors.END}")
    client_data = get_user_info("client@test.com", "password123")
    
    if client_data:
        user = client_data['user']
        print(f"  Email:    {Colors.GREEN}client@test.com{Colors.END}")
        print(f"  Password: {Colors.GREEN}password123{Colors.END}")
        print(f"  ID:       {Colors.YELLOW}{user['id']}{Colors.END}")
        print(f"  Nom:      {user.get('first_name', '')} {user.get('last_name', '')}")
        print(f"  Type:     Subscriber")
        print(f"\n  🔗 Dashboard: {Colors.BLUE}http://127.0.0.1:5000/pages/subscriber.html{Colors.END}")
    else:
        print(f"  {Colors.YELLOW}⚠️  Utilisateur non trouvé{Colors.END}")
    
    # Coach
    print(f"\n{Colors.CYAN}👨‍🏫 COACH{Colors.END}")
    coach_data = get_user_info("coach@test.com", "password123")
    
    if coach_data:
        user = coach_data['user']
        print(f"  Email:    {Colors.GREEN}coach@test.com{Colors.END}")
        print(f"  Password: {Colors.GREEN}password123{Colors.END}")
        print(f"  ID:       {Colors.YELLOW}{user['id']}{Colors.END}")
        print(f"  Nom:      {user.get('first_name', '')} {user.get('last_name', '')}")
        print(f"  Type:     Coach")
        print(f"\n  🔗 Dashboard: {Colors.BLUE}http://127.0.0.1:5000/pages/trainer.html{Colors.END}")
    else:
        print(f"  {Colors.YELLOW}⚠️  Coach non trouvé{Colors.END}")
    
    print("\n" + "="*60)
    print(f"\n💡 Conseil: Utilisez {Colors.GREEN}python create_test_data.py{Colors.END} pour créer ces utilisateurs\n")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ Erreur: {e}")