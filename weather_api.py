import requests
import json
import os
from git import Repo

# NPS API setup
api_key = "jYS8DcjN83Sghuk17c4mYKntFZW5EC0OpS45EFr3"
url = "https://developer.nps.gov/api/v1/parks"
params = {"limit": 500, "api_key": api_key}

parks = []

# Function to fetch parks data
def fetch_parks(url, params):
    while url:
        response = requests.get(url, params=params)
        data = response.json()
        
        if response.status_code != 200:
            print(f"Error fetching data: {response.status_code}")
            return parks
        
        for park in data.get('data', []):
            name = park.get('fullName')
            lat = park.get('latitude')
            lon = park.get('longitude')

            if name and lat and lon:
                parks.append({
                    'name': name,
                    'latitude': float(lat),
                    'longitude': float(lon)
                })

        url = data.get('nextPage', None)

    return parks

# Fetch all parks data
parks = fetch_parks(url, params)

print(f"Found {len(parks)} parks to fetch weather for.")

# Add weather data
headers = {"User-Agent": "NP-WeatherScript (github.com/teddyflattmann/NP_Data)"}

for park in parks:
    lat = park['latitude']
    lon = park['longitude']

    try:
        point_res = requests.get(f"https://api.weather.gov/points/{lat},{lon}", headers=headers)
        point_data = point_res.json()
        forecast_url = point_data['properties']['forecast']

        forecast_res = requests.get(forecast_url, headers=headers)
        period = forecast_res.json()['properties']['periods'][0]

        park['forecast'] = period['detailedForecast']
        park['temperature'] = f"{period['temperature']}°{period['temperatureUnit']}"
        park['wind'] = f"{period['windSpeed']} {period['windDirection']}"

        print(f"Weather added for {park['name']}")
    except Exception as e:
        print(f"Error getting forecast for {park['name']}: {e}")
        park['forecast'] = 'Unavailable'

# Debug current path
print("Saving to:", os.path.abspath('parks_data.json'))

# Write JSON
try:
    with open('parks_data.json', 'w') as f:
        json.dump(parks, f, indent=2)
    print("Parks data saved to parks_data.json")
except Exception as e:
    print(f"Error writing parks_data.json: {e}")



















