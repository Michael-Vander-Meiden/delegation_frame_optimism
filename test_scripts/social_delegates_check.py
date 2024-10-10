import requests
import json

def get_farcaster_following_fids(fid=376182):
    url = "https://api.neynar.com/v2/farcaster/following"
    
    headers = {
        "accept": "application/json",
        "api_key": "C5407186-33EF-47CA-99D8-EBFB1E56868A"
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
        
        print(f"API call {api_call_count + 1}. Params: {params}")  # Debug print
        
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
        
        new_fids = [user['user']['fid'] for user in data.get('users', [])]
        fids.extend(new_fids)
        print(f"Retrieved {len(new_fids)} new FIDs. Total FIDs: {len(fids)}")  # Debug print
        
        next_data = data.get('next', None)
        if next_data:
            cursor = next_data.get('cursor', None)
            print(f"Next cursor: {cursor}")  # Debug print
        else:
            print("No more pages to fetch.")  # Debug print
            break
        
        if not cursor:
            print("Cursor is None, stopping pagination.")  # Debug print
            break
        
        api_call_count += 1
    
    print(f"Retrieved {len(fids)} following FIDs for FID {fid}")
    return fids

if __name__ == "__main__":
    # Test the function
    result = get_farcaster_following_fids()
    #print(f"Result: {result}")
    print(f"Total unique FIDs: {len(set(result))}")  # Print number of unique FIDs