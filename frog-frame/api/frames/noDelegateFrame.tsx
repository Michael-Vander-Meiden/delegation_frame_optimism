import { Button, FrameContext } from "frog";

export function noDelegateFrame(fid: number, c : FrameContext) {
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
            <img width="1200" height="630" alt="background" src="https://superhack-frame.s3.us-west-1.amazonaws.com/frame_images/Frame_5_no_delegate.png" />
          </div>
        ),
        intents: [
          <Button action='/exploreDelegates'>Explore delegates</Button>,
        ],
      })
  }