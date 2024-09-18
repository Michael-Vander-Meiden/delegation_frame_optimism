import os
import requests
import json
import pickle
import boto3


def get_farcaster_following_fids(fid=192336):
    url = "https://api.neynar.com/v2/farcaster/following"
    
    headers = {
        "accept": "application/json",
        "api_key": "NEYNAR_API_DOCS"
    }
    
    params = {
        "fid": fid,
        "limit": 100
    }
    
    response = requests.get(url, headers=headers, params=params)
    data = response.json()
    
    fids = [user['user']['fid'] for user in data.get('users', [])]
    
    return fids

def get_ethereum_addresses_from_fids(fids=[192336]):
    url = "https://api.neynar.com/v2/farcaster/user/bulk"
    
    headers = {
        "accept": "application/json",
        "api_key": "NEYNAR_API_DOCS"
    }
    
    # Convert the list of FIDs to a comma-separated string for the params
    params = {
        "fids": ",".join(map(str, fids))
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    # Assuming the response is JSON and contains Ethereum addresses for each FID
    return _extract_eth_addresses(response.json())

def _extract_eth_addresses(response_data):
    eth_addresses = []
    for user in response_data.get('users', []):
        addresses = user.get('verified_addresses', {}).get('eth_addresses', [])
        eth_addresses.extend([{"address": addr} for addr in addresses])
    return eth_addresses

def get_top_delegates(ethereum_addresses, delegate_dict):
    top_delegates = {}
    for address_dict in ethereum_addresses:
        address = address_dict["address"]
        if address in delegate_dict:
            delegate = delegate_dict[address]
            if delegate in top_delegates:
                top_delegates[delegate]['count'] += 1
            else:
                top_delegates[delegate] = {'address': delegate, 'count': 1}
    
    # Sort the delegates by their counts in descending order and get the top 3
    sorted_delegates = sorted(top_delegates.values(), key=lambda x: x['count'], reverse=True)
    top_3_delegates = sorted_delegates[:3]
    
    return top_3_delegates

def get_username_from_addresses(addresses):
    url = "https://api.neynar.com/v2/farcaster/user/bulk-by-address"
    
    headers = {
        "accept": "application/json",
        "api_key": "NEYNAR_API_DOCS"
    }
    
    params = {
        "addresses": ",".join(addresses),
        "address_types": "verified_addresses"
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

def _extract_usernames(response_data):
    usernames = {}
    for address, user_data in response_data.items():
        if user_data:
            username = user_data[0].get('username', 'no_farcaster_name')
            usernames[address] = username
        else:
            usernames[address] = 'no_farcaster_name'
    return usernames

def get_delegates_usernames(top_3_delegates):
    addresses = [delegate['address'] for delegate in top_3_delegates]
    response_data = get_username_from_addresses(addresses)
    usernames = _extract_usernames(response_data)
    
    for delegate in top_3_delegates:
        delegate['username'] = usernames.get(delegate['address'], 'no_farcaster_name')
    
    return top_3_delegates

def lambda_handler(event, context):
    # Initialize S3 client
    s3 = boto3.client('s3')

    # First, try to retrieve the 'fid' from multiValueQueryStringParameters
    if 'multiValueQueryStringParameters' in event and event['multiValueQueryStringParameters'] is not None:
        fid = event['multiValueQueryStringParameters'].get('fid', [None])[0]
    # If not present, fall back to using queryStringParameters
    elif 'queryStringParameters' in event and event['queryStringParameters'] is not None:
        fid = event['queryStringParameters'].get('fid', '192336')  # Default to 192336 if fid not provided
    else:
        fid = '192336'  # Default value if neither is present

    # S3 bucket and file details
    bucket_name = 'superhack-frame'
    file_key = 'delegation_dict.pkl'

    # Download the file from S3
    s3_response = s3.get_object(Bucket=bucket_name, Key=file_key)
    file_content = s3_response['Body'].read()

    # Load the pickle file
    delegate_dict = pickle.loads(file_content)

    # Process the data
    following_data = get_farcaster_following_fids(fid)
    ethereum_addresses = get_ethereum_addresses_from_fids(following_data)
    top_3_delegates = get_top_delegates(ethereum_addresses, delegate_dict)
    result = get_delegates_usernames(top_3_delegates)

    return {
        'statusCode': 200,
        'body': json.dumps(result)  # Convert the list to a JSON string
    }