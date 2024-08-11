import { Button, FrameContext } from "frog";

export function errorFrame(c : FrameContext) {
    return c.res({
      image: `${process.env.IMAGE_URL}/Frame_6_error.png`,
      imageAspectRatio: '1.91:1',
      intents: [
        <Button.Reset>Try again</Button.Reset>,
      ],
    })
  }