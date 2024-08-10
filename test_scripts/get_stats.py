
import os
import requests
import json
from web3 import Web3


fid = "192336"


# get verified ethereum address from farcaster ID
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
#check delegate from ethereum address

# check if delegate voted in most recent vote
def get_stats_function(fid):

    #Create dictionary that we will return
    return_package = {"hasVerifiedAddress": False, "hasDelegate": False, "isGoodDelegate": False, "delegateInfo": {}}

    #check if there is a verified ethereum address
    eth_addresses = get_ethereum_addresses_from_fids([fid])
    
    if len(eth_addresses) == 0:
        return return_package
    
    return_package["hasVerifiedAddress"] = True
    eth_address = eth_addresses[0]

    #TODO check if there is a delegate

    #TODO check if it is a good delegate

    #TODO return delegate info (delgate name or ENS)

    return return_package


print(get_stats_function(test_fid))




