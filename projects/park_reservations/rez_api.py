# imports
from datetime import date
import requests
import json
import os
from git import Repo

# config
permit_id = 445857
url = f"https://www.recreation.gov/api/permitavailability/entrants/{permit_id}/availability"

# send request
headers = {
    "User-Agent": "Mozilla/5.0" 
}
response = requests.get(url, headers=headers)

# raise error if bad response
response.raise_for_status()

# parse JSON
permit_data = response.json()

# save to file
with open("yosemite_permit_data.json", "w") as f:
    json.dump(permit_data, f, indent=2)


