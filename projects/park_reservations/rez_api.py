#imports
from datetime import date
import requests
import json
import os
from git import Repo

#config
api_key= "9b0d066f-1604-49af-802e-05e9d6ad1609"
base_url= "https://ridb.recreation.gov/api/v1/reservations"
headers= {"apikey": api_key}

#parameters
parameters = {
    "facilityId": 232446,
    "StartDate": "2023-01-01",
    "EndDate": "2025-04-27",
    "limit": 1000,
    "offset": 0,
    "apikey": api_key
}

#pagination_loop
while True:
  #send_request_get_response
  response = requests.get(base_url, headers=headers, params=parameters)
  
  #error_check
  response.raise_for_status()

  #turn_json_into_python_object
  rez_data = response.json().get("RECDATA",[])

  #terminate_if_no_more_records
  if not rez_data: break

  #append_all_data_to_master_list
  all_records.extend(rez_data)

  #continue_advancing_through_all_pages
  parameters["offset"] += parameters["limit"]
