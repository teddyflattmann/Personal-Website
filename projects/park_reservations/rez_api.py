import requests
import json

# config
permit_id = 445857
url = f"https://www.recreation.gov/api/permitavailability/entrants/{permit_id}/availability"

# send request
headers = {
    "User-Agent": "Mozilla/5.0"  # very basic but sometimes enough
}
response = requests.get(url, headers=headers)

# first check status code
print(f"Status code: {response.status_code}")

# if bad response, print text and exit
if not response.ok:
    print(f"Error response: {response.text}")
    response.raise_for_status()

# now safely parse JSON
permit_data = response.json()

# save to file
with open("yosemite_permit_data.json", "w") as f:
    json.dump(permit_data, f, indent=2)

print("Permit data saved successfully!")



