
import * as dotenv from 'dotenv'
dotenv.config();

import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'

import { delegatesStatsFrame } from './delegates/delegatesStatsFrame.js'

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: 'NEYNAR_FROG_FM' }),
  title: 'Delegates Frame',
})


app.frame('/', (c) => {
  const { frameData, verified } = c;
  
  if (!verified) console.log('Frame verification failed')
    console.log('frameData', frameData)
  
  const { fid } = frameData || {}
  
  console.log('fid', fid)
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: '#bcded0',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <img
          src="https://superhack-frame.s3.us-west-1.amazonaws.com/frame_images/back2.png"
          alt="Background"
          height="200px"
        />
        <div
          style={{
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          View your delegates {`API Response: ${fid}`}
        </div>
      </div>
    ),
    intents: [
      <Button action="/delegatesStats">View Stats</Button>
    ],
  })
})

app.route('/delegatesStats', delegatesStatsFrame)

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
