#imports
from datetime import date
import requests
import json
import os
from git import Repo

#config
api_key= "aaa34f3c-a9bc-4d59-8408-165b76ab114f"
base_url= "https://ridb.recreation.gov/api/v1/reservations"
headers= {"apikey": api_key}

#start_date & end_date
start_date = "2023-01-01"
end_date= date.today().isoformat()

#parameters
parameters= {"limit": 1000, "offset":0, "dateOfPurchaseStart": start_date, "dateOfPurchaseEnd": end_date}

#pagination_loop
while True:
  #send_request_get_response
  response = requests.get(base_url, headers=headers, params=parameters)
  
  #error_check
  response.raise_for_status()

  #turn_json_into_python_object
  rez_data = response.json().get("rez_data",[])

  #terminate_if_no_more_records
  if not rez_data: break

  #append_all_data_to_master_list
  all_records.extend(rez_data)

  #continue_advancing_through_all_pages
  PARAMS["offset"] += PARAMS["limit"]
