import requests
import json
from web3 import Web3

def check_op_token_balance(addresses, infura_url):
    # Replace with the OP token contract address on Optimism
    OP_TOKEN_ADDRESS = '0x4200000000000000000000000000000000000042'
    
    # ERC-20 token standard ABI
    OP_token_abi = 
        # Connect to the Optimism network
    w3 = Web3(Web3.HTTPProvider(infura_url))
    
    # Load the OP token contract
    op_token_contract = w3.eth.contract(address=OP_TOKEN_ADDRESS, abi=OP_token_abi)
    
    balances = {}
    
    for address in addresses:
        import pdb; pdb.set_trace()
        print(op_token_contract.functions.delegates({address}).call())
    
    return balances

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
#following_data = get_farcaster_following_fids()
#print(following_data)

#print("VERIFIED USER STUFF RETURNED BELOW:")
#ethereum_addresses = get_ethereum_addresses_from_fids(following_data)
#print(ethereum_addresses)

infura_url = "https://optimism-mainnet.infura.io/v3/725e219fd58a4afcb8e2f4a3e5a40d91"
test_addresses = ["0xa7162D7678dab477Be0ABc927a19cc4575d67Acd", "0x700e2cdeb777be3886ba58bd9aae619c53693844"]
#op_balances = check_op_token_balance(test_addresses, infura_url)
#print(op_balances)
