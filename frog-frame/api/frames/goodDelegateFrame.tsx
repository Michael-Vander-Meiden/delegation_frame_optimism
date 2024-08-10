import { Button, FrameContext } from "frog";

export function goodDelegateFrame(fid: number, c : FrameContext) {
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
            <img width="1200" height="630" alt="background" src="https://superhack-frame.s3.us-west-1.amazonaws.com/frame_images/Frame_2_stats.png" />
            <div
              style={{
                position: 'absolute',
                color: '#ffffff',
                lineHeight: 1,
                fontSize: 100,
                fontFamily: '"Oswald Bold"',
                textAlign: 'center',
                textTransform: 'uppercase',
                textShadow:
                  '5px 5px 3px #000, -5px 5px 3px #000, -5px -5px 0 #000, 5px -5px 0 #000',
                width: '100%',
                height: '100%',
                padding: '50px 200px',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {`User ${fid} has good Delegates`}
            </div>
          </div>
        ),
        intents: [
          <Button.Link href='https://warpcast.com/lauraocampo'>Share</Button.Link>,
          <Button.Reset>Reset</Button.Reset>
        ],
      })
  }