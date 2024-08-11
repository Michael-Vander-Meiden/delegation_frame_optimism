
import * as dotenv from 'dotenv'
dotenv.config();

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'

import { delegatesStatsFrame } from './delegatesStatsFrame.js'

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


app.frame('/', (c) => {
  
  return c.res({
    image: `${process.env.IMAGE_URL}/Frame_1_start.png`,
    imageAspectRatio: '1.91:1',
    intents: [
      <TextInput placeholder="Enter fid..." />,
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
