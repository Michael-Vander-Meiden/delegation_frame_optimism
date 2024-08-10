
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
def get_delegate_from_ethereum_address(eth_address):
    api_url = "https://vote.optimism.io/api/v1//delegates/{}/delegatees".format(eth_address)
    agora_api_key = os.getenv("AGORA_API_KEY")
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {agora_api_key}"
    }
    params = {
        "addressOrEnsName": eth_address
    }
    response = requests.get(api_url, headers=headers, params=params)
    
    #should return empty list if no delegate
    if len(response.json()) == 0:
        return False
    
    #return delegate address if delegate exists
    delegate_address= response.json()[0]["to"]
    if response.status_code == 200:
        return delegate_address
    else:
        return {"error": response.status_code, "message": response.text}

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
    statement = response_data.get("statement", None)
    if statement is None:
        return (False, None)
    else:
        warpcast_name = statement.get("warpcast", None)


    #check if delegate is good
    if response.json()["lastTenProps"]=="10":
        return (True, warpcast_name)
    else:
        return (False, warpcast_name)

# check if delegate voted in most recent vote
def get_stats_function(fid):

    #Create dictionary that we will return
    return_package = {"hasVerifiedAddress": False, "hasDelegate": False, "isGoodDelegate": False, "delegateInfo": None}

    #check if there is a verified ethereum address
    eth_addresses = get_ethereum_addresses_from_fids([fid])
    
    if len(eth_addresses) == 0:
        return return_package
    
    return_package["hasVerifiedAddress"] = True
    eth_address = eth_addresses[0]

    #check if there is a delegate
    delegate_address = get_delegate_from_ethereum_address(eth_address)
    return_package["hasDelegate"] = delegate_address
    if not delegate_address:
        return return_package

    #check if it is a good delegate AND check warpcast name
    
    is_good_delegate, delegate_warpcast = check_if_delegate_is_good(delegate_address)

    return_package["isGoodDelegate"] = is_good_delegate
    return_package["delegateInfo"] = {"delegateAddress": delegate_address, "warpcast": delegate_warpcast}

    return return_package


print(get_stats_function(fid))




