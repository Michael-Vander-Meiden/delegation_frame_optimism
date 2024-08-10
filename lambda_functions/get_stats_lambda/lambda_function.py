import os
import requests
import json

def get_ethereum_addresses_from_fids(fids=[192336]):
    url = "https://api.neynar.com/v2/farcaster/user/bulk"
    
    headers = {
        "accept": "application/json",
        "api_key": os.environ['NEYANR_API_KEY']  # Store your API key in environment variables
    }
    
    params = {
        "fids": ",".join(map(str, fids))
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    return _extract_eth_addresses(response.json())

def _extract_eth_addresses(response_data):
    eth_addresses = []
    for user in response_data.get('users', []):
        addresses = user.get('verified_addresses', {}).get('eth_addresses', [])
        eth_addresses.extend(addresses)
    return eth_addresses

def get_stats_function(fid):
    return_package = {"hasVerifiedAddress": False, "hasDelegate": False, "isGoodDelegate": False, "delegateInfo": {}}

    eth_addresses = get_ethereum_addresses_from_fids([fid])
    
    if len(eth_addresses) == 0:
        return return_package
    
    return_package["hasVerifiedAddress"] = True
    eth_address = eth_addresses[0]

    # TODO: Implement delegate checks
    
    return return_package

def lambda_handler(event, context):
    fid = event.get('fid', '192336')  # Default to 192336 if no fid provided
    result = get_stats_function(fid)
    return {
        'statusCode': 200,
        'body': json.dumps(result)
    }
