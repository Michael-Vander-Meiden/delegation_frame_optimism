import { Button, Frog } from 'frog'
 
export const exploreDelegatesFrame = new Frog({ title: 'Explore Delegates' })

exploreDelegatesFrame.frame('/', (c) => {
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'black',
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
        <img width="1200" height="630" alt="background" src="https://superhack-frame.s3.us-west-1.amazonaws.com/frame_images/back2.png" />
        <div
          style={{
            position: 'absolute',
            color: '#E5383B',
            fontSize: 70,
            textTransform: 'uppercase',
            letterSpacing: '-0.025em',
            lineHeight: 1,
            width: '100%',
            height: '100%',
            padding: '40px 250px',
          }}
        >
          Explore Delegates
        </div>
      </div>
    ),
    intents: [
      <Button.Reset>Reset</Button.Reset>,
    ],
  })
  })