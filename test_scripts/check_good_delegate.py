import os
import requests

import pdb

# Set the API key in your environment before running the script.
# For example, in your terminal: export AGORA_API_KEY="your_api_key_here"

agora_api_url = "https://vote.optimism.io/api/v1"
agora_api_key = os.getenv("AGORA_API_KEY")  # Access the API key from environment variables

# Function to call the votes API
def call_votes_api(endpoint, token, delegate_address, limit=10, offset=0):
    specific_endpoint = f"{endpoint}/delegates/{delegate_address}/votes"

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
        data = response.json()
        vote_proposal_ids = [vote["proposalId"] for vote in data.get("data", [])]
        print([vote["proposalTitle"] for vote in data.get("data", [])])
        return vote_proposal_ids
    else:
        return {"error": response.status_code, "message": response.text}
    

def call_proposals_api(endpoint, token, limit=10, offset=0):
    specific_endpoint = f"{endpoint}/proposals"
    print(specific_endpoint)
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    params = {
        "limit": limit,
        "offset": offset,
        "filter": "everything",
    }
    response = requests.get(specific_endpoint, headers=headers, params=params)
    
    if response.status_code == 200:
        data = response.json()
        # Extracting proposal IDs
        proposal_ids = [proposal["id"] for proposal in data.get("data", [])]
        print([proposal["markdowntitle"] for proposal in data.get("data", [])])
        return proposal_ids
    else:
        return {"error": response.status_code, "message": response.text}

# Example usage
delegate_address = "0x6EdA5aCafF7F5964E1EcC3FD61C62570C186cA0C"
limit = 10
offset = 0
recent_delegate_votes = call_votes_api(agora_api_url, agora_api_key, delegate_address, limit, offset)
recent_proposals = call_proposals_api(agora_api_url, agora_api_key, limit, offset)

# Convert list to a set for O(1) lookups
set_proposals = set(recent_proposals)

# Count elements in delegate_voets that are also in recent_proposals
common_elements_count = sum(1 for item in recent_delegate_votes if item in recent_proposals)
print(common_elements_count)
