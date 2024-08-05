import requests

agora_api_url = "https://vote.optimism.io/api/v1/delegates"
agora_api_key = "6cd7cc83-be72-4126-9413-70027f674cad"

#Function

def call_votes_api(endpoint, token, delegate_address, limit=10, offset=0):
    
    specific_endpoint = endpoint + "/" + delegate_address + "/votes"
    print(specific_endpoint)

    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    params = {
        "addressOrEnsName": delegate_address,
        "limit": limit,
        "offset": offset
    }
    response = requests.get(specific_endpoint, headers=headers, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": response.status_code, "message": response.text}

delegate_address = "0x6EdA5aCafF7F5964E1EcC3FD61C62570C186cA0C"
limit= 10
offset= 0 
result = call_votes_api(agora_api_url, agora_api_key, delegate_address, limit, offset)

print(result)