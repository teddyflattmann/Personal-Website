import os
import requests
from datetime import datetime
import pandas as pd
from google.cloud import bigquery

# compute end = two months ago
today = datetime.today()
year = today.year
month = today.month - 2
if month <= 0:
    year -= 1
    month += 12

start = "2015-01"
end = f"{year:04d}-{month:02d}"
time_filter = f"from {start} to {end}"

# pulling in imports
url = "https://api.census.gov/data/timeseries/intltrade/imports/hs"
params = {
    "get":      "GEN_VAL_MO,CTY_NAME",
    "time":     time_filter,
    "CTY_CODE": "*"
}

response = requests.get(url, params=params)
response.raise_for_status()

data = response.json()
df = pd.DataFrame(data[1:], columns=data[0])

# write service‐account and init client (once)
sa_json = os.environ["GCP_SA_KEY"]
with open("sa.json", "w") as f:
    f.write(sa_json)
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "sa.json"
client = bigquery.Client()

# defining & configuring import load
table_id = "fred-460922.fred.US_imports_by_country"
job_config = bigquery.LoadJobConfig(
    autodetect=True,
    write_disposition="WRITE_TRUNCATE"
)

# load the imports DataFrame
client.load_table_from_dataframe(df, table_id, job_config=job_config).result()
print(f"Loaded {len(df)} import rows into {table_id}")

# pulling in exports
url1 = "https://api.census.gov/data/timeseries/intltrade/exports/hs"
params1 = {
    "get":      "ALL_VAL_MO,CTY_NAME",
    "time":     time_filter,
    "CTY_CODE": "*"
}

response1 = requests.get(url1, params=params1)
response1.raise_for_status()

data1 = response1.json()
df1 = pd.DataFrame(data1[1:], columns=data1[0])

# defining & configuring export load
table_id = "fred-460922.fred.US_exports_by_country"
# (we can reuse the same job_config)

# load the exports DataFrame
client.load_table_from_dataframe(df1, table_id, job_config=job_config).result()
print(f"Loaded {len(df1)} export rows into {table_id}")





