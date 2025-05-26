import os
import requests
import pandas as pd
from google.cloud import bigquery


# defining endpoint and parameters for FRED api
api_key = os.environ["FRED_API_KEY"]
url = "https://api.stlouisfed.org/fred/series/observations"
parameters= {
    "series_id": "CPIAUCSL",     #CPI data for all urban consumers 
    "api_key": api_key,
    "file_type": "json",
    "observation_start": "2010-01-01"}

# fetching data
req = requests.get(url, params=parameters)
if req.status_code == 200:
    data = req.json()["observations"]
else: 
    print(f"error fetching data: status code {req.status_code}")

# load into dataframe
df_cpi = pd.DataFrame(data)
df_cpi["date"] = pd.to_datetime(df_cpi["date"])
df_cpi["value"] = pd.to_numeric(df_cpi["value"], errors="coerce") #setting errors to appear as NaN

# preview dataframe
print(df_cpi.head())

# write to local CSV
csv_path="cpi_data.csv"
df_cpi.to_csv(csv_path, index=False)

# write to google bigquery
# pointing to service-account
sa_json = os.environ["GCP_SA_KEY"]
with open("sa.json", "w") as f:
    f.write(sa_json)
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "sa.json"

# initializing client
client = bigquery.Client()

# defining destination table
table_id = "fred-460922.fred.cpi_data"

# configuring load job to a full replace
job_config = bigquery.LoadJobConfig(
    source_format = bigquery.SourceFormat.CSV,
    skip_leading_rows = 1,
    autodetect=True,
    write_disposition="WRITE_TRUNCATE"  # replace table each run; use "WRITE_APPEND" to add rows
)

# loading the DataFrame
with open(csv_path, "rb") as f:
    load_job = client.load_table_from_file(
        f, 
        table_id, 
        job_config=job_config)  

# wait for the job to complete
load_job.result()

print(f"✅ Loaded {load_job.output_rows} rows into `{table_id}`.")
