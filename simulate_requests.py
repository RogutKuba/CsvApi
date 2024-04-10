import requests

# Assuming there is an endpoint to check the current request count for a user
# Replace 'http://api.example.com' with the actual API endpoint
# Replace 'user_id' with the actual user ID parameter
api_endpoint = 'http://api.example.com/user_request_count'
user_id = 'test_user'

# Simulate 5 requests
for _ in range(5):
    requests.get(api_endpoint, params={'user_id': user_id})

# Check the updated request count
response = requests.get(api_endpoint, params={'user_id': user_id})
if response.status_code == 200:
    request_count = response.json().get('request_count')
    print(f"Request count for user {user_id} is now: {request_count}")
else:
    print(f"Failed to retrieve request count, status code: {response.status_code}")

