import { Button, Frog } from 'frog'
 
export const delegatesStatsFrame = new Frog({ title: 'Delegate Stats Frame' })
 
delegatesStatsFrame.frame('/', (c) => {
    //Make the respective requests to the API's in order to get the data to display

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
          <div
            style={{
              color: 'white',
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            Delegates stats Frame
          </div>
        </div>
      ),
      intents: [
        <Button.Reset>Back</Button.Reset>,
      ],
    })
  })