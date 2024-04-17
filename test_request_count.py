import requests

# Assuming there is an endpoint to authenticate and get a token
auth_response = requests.post("http://localhost:8000/api/authenticate", data={"username": "testuser", "password": "testpass"})
auth_token = auth_response.json().get("auth_token")

# Send a request to the test endpoint using the auth token
headers = {"Authorization": f"Bearer {auth_token}"}
test_response = requests.get("http://localhost:8000/api/test", headers=headers)

# Check the user's request count
request_count_response = requests.get("http://localhost:8000/api/user/request_count", headers=headers)
request_count = request_count_response.json().get("request_count")

print(f"User request count: {request_count}")
