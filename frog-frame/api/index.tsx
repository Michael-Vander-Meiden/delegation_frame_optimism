
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

/* ADDRESS AND USERNAME FUNCTIONS */
function truncateMiddle (text: string, maxLength: number) : string{
  if (text.length <= maxLength) return text
  const start = Math.ceil((maxLength - 3) / 2)
  const end = Math.floor((maxLength - 3) / 2)
  return text.slice(0, start) + '...' + text.slice(-end)
}

app.frame('/delegatesStats', async (c) => {
  const { frameData } = c;
  const { fid } = frameData || {}

//TODO MOCKED
//const fid = 192336

  if (typeof fid !== 'number' || fid === null ){
    return c.res({
      image: `/Frame_6_error.png`,
      imageAspectRatio: '1.91:1',
      intents: [
        <Button.Reset>Try again</Button.Reset>,
      ],
    })
  }

  const delegate = await getStats(fid);

  /* NO VERIFIED ADDRESS FRAME */

  if (!delegate.hasVerifiedAddress){
      return c.res({
        image: `/Frame_4_not_verified.png`,
        imageAspectRatio: '1.91:1',
        intents: [
            <Button.Reset>Try again</Button.Reset>,
        ],
    })
  }
  
  /* NO DELEGATE FRAME */

  if(!delegate.hasDelegate) {
    return c.res({
      image: `/Frame_5_no delegate_explore.png`,
      imageAspectRatio: '1.91:1',
      intents: [
        <Button action='/socialRecommendation'>Social Graph</Button>,
        <Button action='/randomRecommendation'>Random</Button>,
        <Button.Reset>Reset</Button.Reset>,
      ],
    })
  }

  const userDelegate = delegate.delegateInfo.warpcast
  const addressDelegate = truncateMiddle(delegate.delegateInfo.delegateAddress, 11)

  const delegateData = (userDelegate !== null && userDelegate !== '') ? userDelegate : addressDelegate;


  /* TODO MOCKED DELEGATE FRAME */
  //delegate.isGoodDelegate = false

  /* BAD DELEGATE FRAME */
  if(!delegate.isGoodDelegate) {
    return c.res({
        image: (
          <div style={{
              display: 'flex',
              background: '#f6f6f6',
              width: '100%',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              position: 'relative',
              overflow: 'hidden'
          }}>
              <img width="1200" height="630" alt="background" src={`/Frame_2.1_bad_delegate_stats_dynamic.png`} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}} />
              
              <div
                  style={{
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'absolute',
                      color: '#161B33',
                      fontSize: '75px',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.035em',
                      width: '90%',
                      padding: '10px',
                      top: '6%',
                      height: '30%',
                      overflow: 'hidden',
                      lineHeight: 0.6,
                      textAlign: 'right',
                      transform: 'translateX(-60px)'
                  }}
              >
                  <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                      flexWrap: 'wrap'
                  }}>
                      <div style={{ marginRight: '10px' }}>Did</div>
                      <div style={{display: 'flex', color: '#E5383B', margin: '0 10px' }}>{delegateData}</div>
                      <div style={{ marginLeft: '10px' }}>vote</div>
                      <div style={{ marginLeft: '10px' }}>in</div>
                      <div style={{ marginLeft: '10px' }}>the</div>
                      <div style={{ marginLeft: '10px' }}>ten</div>
                      <div style={{ marginLeft: '10px' }}>most</div>
                      <div style={{ marginLeft: '10px' }}>recent</div>
                      <div style={{ marginLeft: '10px' }}>proposals?</div>
                  </div>
              </div>
          </div>
      ),
        intents: [
          <Button action='/socialRecommendation'>Social Graph</Button>,
          <Button action='/randomRecommendation'>Random</Button>,
          <Button.Reset>Reset</Button.Reset>
        ],
      })
  }


  if (typeof userDelegate !== 'string' || userDelegate === null) {
    throw new Error('Invalid type returned');
  }

  const vercelLink = 'https://optimism-frame.vercel.app/api'

  /* GOOD DELEGATE FRAME */
    return c.res({
      image: (
          <div style={{
            display: 'flex',
            background: '#f6f6f6',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <img width="1200" height="630" alt="background" src={`/Frame_2_stats_dynamic.png`} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}} />
            
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute',
                    color: '#161B33',
                    fontSize: '75px',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.035em',
                    width: '90%',
                    padding: '10px',
                    top: '6%',
                    height: '30%',
                    overflow: 'hidden',
                    lineHeight: 0.6,
                    textAlign: 'right',
                    transform: 'translateX(-60px)'
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ marginRight: '10px' }}>Did</div>
                    <div style={{display: 'flex', color: '#E5383B', margin: '0 10px' }}>{delegateData}</div>
                    <div style={{ marginLeft: '10px' }}>vote</div>
                    <div style={{ marginLeft: '10px' }}>in</div>
                    <div style={{ marginLeft: '10px' }}>the</div>
                    <div style={{ marginLeft: '10px' }}>ten</div>
                    <div style={{ marginLeft: '10px' }}>most</div>
                    <div style={{ marginLeft: '10px' }}>recent</div>
                    <div style={{ marginLeft: '10px' }}>proposals?</div>
                </div>
            </div>
        </div>
      ),
        intents: [
          <Button.Link href={`https://warpcast.com/~/compose?text=Most%20Farcaster%20users%20haven%E2%80%99t%20chosen%20an%20Optimism%20delegate%20yet%2C%20and%20over%20half%20of%20users%20have%20an%20inactive%20delegate.%20Check%20yours%20now!%20%F0%9F%94%B4%E2%9C%A8&embeds[]=${vercelLink}`}>Share</Button.Link>,
          <Button.Reset>Reset</Button.Reset>
        ],
      })

})


// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
