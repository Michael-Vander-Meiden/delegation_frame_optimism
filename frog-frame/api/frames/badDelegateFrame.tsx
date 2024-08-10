import { Button, FrameContext } from "frog";

export function badDelegateFrame(fid: number, c : FrameContext) {
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
                fontSize: '55px',
                textAlign: 'center',
                lineHeight: '0.7',
                textTransform: 'uppercase',
                letterSpacing: '-0.030em',
                whiteSpace: 'wrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '250',
                height: '100%',
                left: '190px',
                bottom: '210px',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {`User ${fid}`}
            </div>
          </div>
        ),
        intents: [
          <Button action='/exploreDelegates'>Explore delegates</Button>,
        ],
      })
  }