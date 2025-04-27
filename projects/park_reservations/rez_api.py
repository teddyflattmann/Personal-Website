#imports
from datetime import date
import requests
import json
import os
from git import Repo

#config
url= f"https://www.recreation.gov/api/permitavailability/entrants/{permit_id}/availability"

#send requests
headers = {
    "User-Agent": "Mozilla/5.0"  # some Recreation.gov endpoints need a simple user agent
}
response = requests.get(url, headers=headers)

#raise error if base response
permit_data = response.json()

# Save to file
with open("yosemite_permit_data.json", "w") as f:
    json.dump(permit_data, f, indent=2)

