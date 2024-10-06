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
    
    fids = []
    cursor = None
    api_call_count = 0
    
    while api_call_count < 10:
        if cursor:
            params['cursor'] = cursor
        
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code != 200:
            print(f"API request failed. Status Code: {response.status_code}")
            print(f"Response content: {response.text}")
            break
        
        try:
            data = response.json()
        except json.JSONDecodeError:
            print(f"Failed to decode JSON. Response content: {response.text}")
            break
        
        if 'users' not in data:
            print(f"Unexpected response structure. Response content: {data}")
            break
        
        fids.extend([user['user']['fid'] for user in data.get('users', [])])
        
        next_data = data.get('next', None)
        if next_data:
            cursor = next_data.get('cursor', None)
        else:
            break
        
        api_call_count += 1
    
    print(f"Retrieved {len(fids)} following FIDs for FID {fid}")
    return fids

if __name__ == "__main__":
    # Test the function
    result = get_farcaster_following_fids()
    print(f"Result: {result}")