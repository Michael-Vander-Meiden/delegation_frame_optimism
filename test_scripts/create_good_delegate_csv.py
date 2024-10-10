import csv
import time
import os
import requests

def check_if_delegate_is_good(delegate_address):
    api_url = "https://vote.optimism.io/api/v1/delegates/{}".format(delegate_address)
    agora_api_key = os.getenv("AGORA_API_KEY")
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {agora_api_key}"
    }
    params = {
        "addressOrEns": delegate_address
    }

    response = requests.get(api_url, headers=headers, params=params)
    
    response_data = response.json()    
    #check if delegate is good
    if response_data.get("lastTenProps") == "10" and response_data.get("statement") != None:
        return True
    else:
        return False

# Read the input CSV file
input_file = "top_250_delegates.csv"
output_file = "good_delegates.csv"

with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
    reader = csv.DictReader(infile)
    fieldnames = reader.fieldnames + ['good_delegate']
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    writer.writeheader()

    for row in reader:
        delegate_address = row['delegate_address']
        is_good_delegate = check_if_delegate_is_good(delegate_address)
        row['good_delegate'] = str(is_good_delegate)
        writer.writerow(row)
        
        # Sleep for 1 second between requests
        time.sleep(1)

print(f"Processing complete. Results written to {output_file}")
