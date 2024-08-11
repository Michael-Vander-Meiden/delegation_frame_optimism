import { Button, FrameContext } from "frog";

export function noDelegateFrame(fid: number, c : FrameContext) {
    return c.res({
        image: 'https://superhack-frame.s3.us-west-1.amazonaws.com/frame_images/Frame_5_no_delegate.png',
        imageAspectRatio: '1.91:1',
        intents: [
          <Button action='/exploreDelegates'>Explore delegates</Button>,
          <Button.Reset>Reset</Button.Reset>,
        ],
      })
  }