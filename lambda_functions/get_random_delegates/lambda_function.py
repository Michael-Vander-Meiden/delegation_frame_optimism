import os
import json
import pickle
import boto3
import random
import requests
import logging

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

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
    
    logger.info(f"Making API request to Neynar with addresses: {addresses}")
    response = requests.get(url, headers=headers, params=params)
    logger.info(f"API Response: Status Code {response.status_code}")
    
    if response.status_code != 200:
        logger.error(f"API request failed. Status Code: {response.status_code}, Response: {response.text}")
        return None
    
    logger.info(f"API Response Content: {response.text}")
    return response.json()

def _extract_usernames(response_data):
    logger.info(f"Extracting usernames from response data: {response_data}")
    usernames = {}
    for address, user_data in response_data.items():
        if user_data and len(user_data) > 0:
            username = user_data[0].get('username', 'no_farcaster_name')
            usernames[address.lower()] = username
        else:
            usernames[address.lower()] = 'no_farcaster_name'
    logger.info(f"Extracted usernames: {usernames}")
    return usernames

def get_delegates_usernames(random_delegates):
    addresses = [delegate['address'] for delegate in random_delegates]
    logger.info(f"Getting usernames for addresses: {addresses}")
    response_data = get_username_from_addresses(addresses)
    
    if response_data is None:
        logger.warning("No response data from API, setting all usernames to 'no_farcaster_name'")
        for delegate in random_delegates:
            delegate['username'] = 'no_farcaster_name'
    else:
        usernames = _extract_usernames(response_data)
        for delegate in random_delegates:
            delegate['username'] = usernames.get(delegate['address'].lower(), 'no_farcaster_name')
    
    logger.info(f"Final delegates with usernames: {random_delegates}")
    return random_delegates

def lambda_handler(event, context):
    logger.info("Lambda function started")
    
    # Initialize S3 client
    s3 = boto3.client('s3')

    # S3 bucket and file details
    bucket_name = 'superhack-frame'
    good_delegates_file_key = 'good_delegates.pkl'

    logger.info(f"Downloading file from S3: {bucket_name}/{good_delegates_file_key}")
    # Download the good_delegates file from S3
    s3_response = s3.get_object(Bucket=bucket_name, Key=good_delegates_file_key)
    file_content = s3_response['Body'].read()

    # Load the good_delegates pickle file
    good_delegates_dict = pickle.loads(file_content)
    logger.info(f"Loaded {len(good_delegates_dict)} delegates from pickle file")

    # Filter good delegates
    good_delegates = [{"address": addr} for addr, is_good in good_delegates_dict.items() if is_good]
    logger.info(f"Filtered {len(good_delegates)} good delegates")

    # Randomly select 3 good delegates
    random_delegates = random.sample(good_delegates, min(3, len(good_delegates)))
    logger.info(f"Randomly selected delegates: {random_delegates}")

    # Get usernames for the random delegates
    result = get_delegates_usernames(random_delegates)

    logger.info(f"Lambda function completed successfully. Result: {result}")
    return {
        'statusCode': 200,
        'body': json.dumps(result)
    }
