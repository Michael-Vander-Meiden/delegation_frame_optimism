import { Button, Frog } from 'frog'
import { exploreDelegatesFrame } from './exploreDelegates.js';
 
export const delegatesStatsFrame = new Frog({ title: 'Delegate Stats Frame' })
 

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

delegatesStatsFrame.frame('/', (c) => {
    //Make the respective requests to the API's in order to get the data to display
    const number = getRandomInt(1, 10)
    console.log('number', number)
    if(number > 5) {
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
              No verified address
            </div>
          </div>
        ),
        intents: [
          <Button.Reset>Try again</Button.Reset>,
        ],
      })
    }else {
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
              No delegates
            </div>
          </div>
        ),
        intents: [
          <Button action='/exploreDelegates'>Explore delegates</Button>,
        ],
      })
    }
  })

  delegatesStatsFrame.route('/exploreDelegates', exploreDelegatesFrame)