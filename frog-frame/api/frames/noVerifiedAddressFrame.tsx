import { Button, FrameContext } from "frog";

export function noVerifiedAddressFrame(c : FrameContext) {
    return c.res({
        image: `${process.env.IMAGE_URL}/Frame_4_not_verified.png`,
        imageAspectRatio: '1.91:1',
        intents: [
            <Button.Reset>Try again</Button.Reset>,
        ],
    })
  }