import os
import requests
import json
import pickle
import boto3
import logging

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_farcaster_following_fids(fid=192336):
    # docs: https://docs.neynar.com/reference/following-v2
    url = "https://api.neynar.com/v2/farcaster/following"
    
    headers = {
        "accept": "application/json",
        "api_key": os.environ["NEYNAR_API_KEY"]
    }
    
    params = {
        "fid": fid,
        "limit": 100
    }
    
    fids = []
    cursor = None
    api_call_count = 0
    
    while api_call_count < 10:
        if cursor:
            params['cursor'] = cursor
        
        logger.info(f"Making API call {api_call_count + 1} with params: {params}")
        
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code != 200:
            logger.error(f"API request failed. Status Code: {response.status_code}")
            logger.error(f"Response content: {response.text}")
            break
        
        try:
            data = response.json()
        except json.JSONDecodeError:
            logger.error(f"Failed to decode JSON. Response content: {response.text}")
            break
        
        if 'users' not in data:
            logger.error(f"Unexpected response structure. Response content: {data}")
            break
        
        new_fids = [user['user']['fid'] for user in data.get('users', [])]
        fids.extend(new_fids)
        logger.info(f"Retrieved {len(new_fids)} new FIDs. Total FIDs: {len(fids)}")
        
        next_data = data.get('next', None)
        if next_data:
            cursor = next_data.get('cursor', None)
            logger.info(f"Next cursor: {cursor}")
        else:
            logger.info("No more pages to fetch.")
            break
        
        if not cursor:
            logger.info("Cursor is None, stopping pagination.")
            break
        
        api_call_count += 1
    
    logger.info(f"Retrieved {len(fids)} following FIDs for FID {fid}")
    return fids

def get_ethereum_addresses_from_fids(fids=[192336]):
    url = "https://api.neynar.com/v2/farcaster/user/bulk"
    
    headers = {
        "accept": "application/json",
        "api_key": os.environ["NEYNAR_API_KEY"]
    }
    
    all_eth_addresses = []
    
    # Split the list of FIDs into batches of 100
    for i in range(0, len(fids), 100):
        batch_fids = fids[i:i+100]
        
        # Convert the list of FIDs to a comma-separated string for the params
        params = {
            "fids": ",".join(map(str, batch_fids))
        }
        
        response = requests.get(url, headers=headers, params=params)
        
        # Assuming the response is JSON and contains Ethereum addresses for each FID
        all_eth_addresses.extend(_extract_eth_addresses(response.json()))
    
    logger.info(f"Retrieved {len(all_eth_addresses)} Ethereum addresses from {len(fids)} FIDs")
    return all_eth_addresses

def _extract_eth_addresses(response_data):
    eth_addresses = []
    for user in response_data.get('users', []):
        addresses = user.get('verified_addresses', {}).get('eth_addresses', [])
        eth_addresses.extend([{"address": addr} for addr in addresses])
    return eth_addresses

def get_top_delegates(ethereum_addresses, delegate_dict, good_delegates_dict):
    top_delegates = {}
    for address_dict in ethereum_addresses:
        address = address_dict["address"]
        if address in delegate_dict:
            delegate = delegate_dict[address]
            if delegate in good_delegates_dict and good_delegates_dict[delegate]:
                if delegate in top_delegates:
                    top_delegates[delegate]['count'] += 1
                else:
                    top_delegates[delegate] = {'address': delegate, 'count': 1}
    
    # Sort the delegates by their counts in descending order and get the top 3
    sorted_delegates = sorted(top_delegates.values(), key=lambda x: x['count'], reverse=True)
    top_3_delegates = sorted_delegates[:3]
    
    logger.info(f"Found top {len(top_3_delegates)} delegates")
    return top_3_delegates

def get_username_from_addresses(addresses):
    url = "https://api.neynar.com/v2/farcaster/user/bulk-by-address"
    
    headers = {
        "accept": "application/json",
        "api_key": os.environ["NEYNAR_API_KEY"]
    }
    
    params = {
        "addresses": ",".join(addresses),
        "address_types": "verified_addresses"
    }
    
    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        logger.error(f"API request failed. Status Code: {response.status_code}, Response: {response.text}")
        return None
    logger.info(f"Retrieved usernames for {len(addresses)} addresses")
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
    
    logger.info(f"Added usernames to {len(top_3_delegates)} delegates")
    return top_3_delegates

def lambda_handler(event, context):
    logger.info("Lambda function started")
    
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
    
    logger.info(f"Using FID: {fid}")

    # S3 bucket and file details
    bucket_name = 'superhack-frame'
    delegation_file_key = 'delegation_dict.pkl'
    good_delegates_file_key = 'good_delegates.pkl'

    logger.info(f"Downloading delegation_dict from S3: {bucket_name}/{delegation_file_key}")
    # Download the delegation_dict file from S3
    s3_response = s3.get_object(Bucket=bucket_name, Key=delegation_file_key)
    file_content = s3_response['Body'].read()

    # Load the delegation_dict pickle file
    delegate_dict = pickle.loads(file_content)
    logger.info(f"Loaded delegation_dict with {len(delegate_dict)} entries")

    logger.info(f"Downloading good_delegates from S3: {bucket_name}/{good_delegates_file_key}")
    # Download the good_delegates file from S3
    s3_response = s3.get_object(Bucket=bucket_name, Key=good_delegates_file_key)
    file_content = s3_response['Body'].read()

    # Load the good_delegates pickle file
    good_delegates_dict = pickle.loads(file_content)
    logger.info(f"Loaded good_delegates_dict with {len(good_delegates_dict)} entries")

    # Process the data
    following_data = get_farcaster_following_fids(fid)
    ethereum_addresses = get_ethereum_addresses_from_fids(following_data)
    top_3_delegates = get_top_delegates(ethereum_addresses, delegate_dict, good_delegates_dict)
    result = get_delegates_usernames(top_3_delegates)

    logger.info(f"Lambda function completed successfully. Result: {result}")
    return {
        'statusCode': 200,
        'body': json.dumps(result)  # Convert the list to a JSON string
    }