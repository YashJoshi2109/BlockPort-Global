import requests
import json

BASE_URL = "http://localhost:8000/api/v1"


def test_register():
    data = {
        "email": "test3@example.com",
        "password": "Yashjoshi@2110",
        "confirm_password": "Yashjoshi@2110",
        "full_name": "Test User 3",
        "role": "importer"
    }

    response = requests.post(
        f"{BASE_URL}/auth/register",
        json=data
    )
    print("\nRegister Response:", response.status_code)
    print(json.dumps(response.json(), indent=2))
    return response.json()


def test_login():
    data = {
        "email": "test3@example.com",
        "password": "Yashjoshi@2110"
    }

    response = requests.post(
        f"{BASE_URL}/auth/login",
        json=data
    )
    print("\nLogin Response:", response.status_code)
    print(json.dumps(response.json(), indent=2))
    return response.json()


if __name__ == "__main__":
    print("Testing registration...")
    try:
        user = test_register()
    except Exception as e:
        print("Registration failed:", e)

    print("\nTesting login...")
    try:
        token = test_login()
    except Exception as e:
        print("Login failed:", e)
