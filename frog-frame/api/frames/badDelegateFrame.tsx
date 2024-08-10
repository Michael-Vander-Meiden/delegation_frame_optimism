import { Button, FrameContext } from "frog";
import {getStats } from '../service/statsService.js';
import { DelegatesResponseDTO } from '../service/delegatesResponseDTO.js';
import { errorFrame } from '../frames/errorFrame.js';

export async function badDelegateFrame(fid: number, c : FrameContext) {

  let delegate : DelegatesResponseDTO

  try {
    delegate = await getStats(fid)
  } catch (e) {
    return errorFrame(c)
  }
  const userDelegate = delegate.delegateInfo.warpcast
  if (typeof userDelegate !== 'string' || userDelegate === null) {
    throw new Error('Invalid type returned');
  }
  const addressDelegate = delegate.delegateInfo.delegateAddress

  const delegateData = userDelegate? userDelegate : addressDelegate

    return c.res({
        image: (          
          <div style={{
            display: 'flex',
            background: '#f6f6f6',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            position: 'relative'
            }}>
            <img width="1200" height="630" alt="background" src="https://superhack-frame.s3.us-west-1.amazonaws.com/frame_images/Frame_2.1_bad_delegate_stats.png" />
            <div
              style={{
                position: 'absolute',
                color: '#E5383B',
                fontSize: '75px',
                lineHeight: '0.7',
                textTransform: 'uppercase',
                letterSpacing: '-0.030em',
                whiteSpace: 'wrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                with: '100%',
                maxWidth: '295px',
                height: '100%',
                maxHeight: '340px',
                left: '170px',
                bottom: '235px',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}>
              {`${delegateData}`}
            </div>
          </div>
        ),
        intents: [
          <Button action='/exploreDelegates'>Explore delegates</Button>,
        ],
      })
  }