
import * as dotenv from 'dotenv'
dotenv.config();

import { Button, Frog} from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'

import { DelegatesResponseDTO } from './service/delegatesResponseDTO.js';
import { suggestedDelegates, suggestionResponseDTO } from './service/suggestionResponseDTO.js';
import { randomDelegates, randomResponseDTO } from './service/randomResponseDTO.js';

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  hub: neynar({ apiKey: 'NEYNAR_FROG_FM' }),
  title: 'Delegates Frame',
  verify: 'silent',
  imageOptions: {
    fonts: [
      {
        name: 'Koulen',
        weight: 400,
        source: 'google',
      }
    ]
  }
})

/* API CALL GET_STATS */
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
    console.log(`Error get delegate info for fid ${fid}`)
  }
  let data : DelegatesResponseDTO = await response.json();
  return data
}

/* API CALL GET_SUGGESTED_DELEGATES */
export async function getSuggestedDelegates(fid: number): Promise<suggestionResponseDTO> {

  const delegateApiURL = new URL(`${process.env.DELEGATE_API_URL}/get_suggested_delegates`);

  delegateApiURL.searchParams.append('fid', fid.toString());

  const response = await fetch(delegateApiURL, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  })

  if (!response.ok){
    console.log(`Error getSuggestedDelegates for fid ${fid}`)
  }
  let data : suggestionResponseDTO = await response.json()
  return data
}

/* API CALL GET_RANDOM_DELEGATES */
export async function getRandomDelegates(): Promise<randomResponseDTO> {

  const delegateApiURL = new URL(`${process.env.DELEGATE_API_URL}/get_random_delegates`);

  const response = await fetch(delegateApiURL, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  })

  if (!response.ok){
    console.log(`Error getRandomDelegates`)
  }
  let data : randomResponseDTO = await response.json()
  return data
}

app.frame('/', (c) => {
  
  return c.res({
    image: `/Frame_1_start_NEW.jpg`,
    imageAspectRatio: '1.91:1',
    intents: [
      <Button action="/delegatesStats">View Stats</Button>
    ],
  })
})


// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
