import { DelegatesResponseDTO } from "./delegatesResponseDTO.js"

export async function getStats(fid: number) : Promise<DelegatesResponseDTO>{
    
    const delegateApiURL = new URL(`${process.env.DELEGATE_API_URL}/get_stats`)

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
    return await response.json() as DelegatesResponseDTO;
}