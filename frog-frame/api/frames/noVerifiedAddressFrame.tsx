import { Button, FrameContext } from "frog";

export function noVerifiedAddressFrame(c : FrameContext) {
    return c.res({
        image: 'https://superhack-frame.s3.us-west-1.amazonaws.com/frame_images/Frame_4_not_verified.png',
        imageAspectRatio: '1.91:1',
        intents: [
            <Button.Reset>Try again</Button.Reset>,
        ],
    })
  }