import requests

def get_farcaster_following_fids(fid=192336):
    url = "https://api.neynar.com/v2/farcaster/following"
    
    headers = {
        "accept": "application/json",
        "api_key": "NEYNAR_API_DOCS"
    }
    
    params = {
        "fid": fid,
        "limit": 25
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

# Example usage for getting following
following_data = get_farcaster_following_fids()
print(following_data)

print("VERIFIED USER STUFF RETURNED BELOW:")
ethereum_addresses = get_ethereum_addresses_from_fids(following_data)
print(ethereum_addresses)
