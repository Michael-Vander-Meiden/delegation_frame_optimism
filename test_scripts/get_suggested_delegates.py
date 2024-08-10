import pickle
import requests
import json

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
        eth_addresses.extend(addresses)
    return eth_addresses

def get_top_delegates(ethereum_addresses, delegate_dict):
    top_delegates = {}
    for address in ethereum_addresses:
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




with open('/Users/michael/Downloads/delegation_dict.pkl', 'rb') as file:
    delegate_dict = pickle.load(file)


following_data = get_farcaster_following_fids()
ethereum_addresses = get_ethereum_addresses_from_fids(following_data)
print(get_top_delegates(ethereum_addresses, delegate_dict))