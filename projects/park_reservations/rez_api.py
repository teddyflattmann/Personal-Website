# imports
import requests
import json
import time

# Configuration
permit_id = 445857  # Yosemite Wilderness Permit entrance ID
url = f"https://www.recreation.gov/api/permitavailability/entrants/{permit_id}/availability"

# Strong headers to mimic a real browser
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://www.recreation.gov/",
    "Origin": "https://www.recreation.gov"
}

# Function to safely fetch permit data
def fetch_permit_data(url, headers, retries=3, delay=5):
    for attempt in range(retries):
        try:
            print(f"Attempt {attempt + 1} of {retries}...")
            response = requests.get(url, headers=headers)
            response.raise_for_status()  # Raises an error for bad status codes

            # Try to decode JSON
            return response.json()

        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            if attempt < retries - 1:
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                print("Max retries exceeded.")
                raise

# Main script
if __name__ == "__main__":
    try:
        permit_data = fetch_permit_data(url, headers)

        # Save to file
        with open("yosemite_permit_data.json", "w") as f:
            json.dump(permit_data, f, indent=2)

        print("✅ Permit data fetched and saved successfully!")

    except Exception as e:
        print(f"🚨 An error occurred: {e}")
