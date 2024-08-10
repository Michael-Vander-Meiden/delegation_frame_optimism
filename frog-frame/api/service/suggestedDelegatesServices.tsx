import { suggestionResponseDTO } from "./suggestionResponseDTO.js"

export async function getSuggestedDelegates(fid: number) : Promise<suggestionResponseDTO>{
    
    const delegateApiURL = new URL(`${process.env.DELEGATE_API_URL}/get_suggested_delegates`)

    delegateApiURL.searchParams.append('fid', fid.toString());

    const response = await fetch(delegateApiURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok){
        throw new Error(`Error get delegate info for fid ${fid}`)
    }
    return await response.json() as suggestionResponseDTO;
}