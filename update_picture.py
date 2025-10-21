import requests

BASE_URL = "http://127.0.0.1:5000/api/v1"

# 1. Se connecter
login_response = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "client@test.com",
    "password": "password123"
})

data = login_response.json()
token = data['access_token']
user_id = data['user']['id']

print(f"User ID: {user_id}")

# 2. Mettre à jour UNIQUEMENT la photo
headers = {"Authorization": f"Bearer {token}"}
response = requests.put(
    f"{BASE_URL}/user/{user_id}",
    headers=headers,
    json={"picture": "https://i.pravatar.cc/150?img=25"}
)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")