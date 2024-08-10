import { Button, Frog} from 'frog'
import { getSuggestedDelegates } from '../service/suggestedDelegatesServices.js';
import { suggestionResponseDTO } from '../service/suggestionResponseDTO.js';
import { errorFrame } from '../frames/errorFrame.js';

export const exploreDelegatesFrame = new Frog({ title: 'Explore Delegates' })

exploreDelegatesFrame.frame('/', async (c) => {

  const { frameData } = c;
  const { fid } = frameData || {}  

  if (typeof fid !== 'number' || fid === null) {
    throw new Error('Invalid type returned');
}

  let delegates : suggestionResponseDTO

  try {
    delegates = await getSuggestedDelegates(fid)
  } catch (e) {
    return errorFrame(c)
  }

    const allAddresses = delegates.map(item => item.address);
    const allCounts = delegates.map(item => item.count);

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
        <img width="1200" height="630" alt="background" src="https://superhack-frame.s3.us-west-1.amazonaws.com/frame_images/back2.png" />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            color: '#E5383B',
            fontSize: '75px',
            textTransform: 'uppercase',
            letterSpacing: '-0.030em',
            with: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}>
          <p>{`Explorar delegates`}</p>
                <ul>
                    {allAddresses.map(address => (
                        <li key={address}>{address}</li>
                    ))}
                </ul>
                <ul>
                    {allCounts.map(count => (
                        <li key={count}>{count}</li>
                    ))}
                </ul>
        </div>
      </div>
    ),
    intents: [
      <Button.Reset>Reset</Button.Reset>,
    ],
  })
  })

/*   export async function exploreDelegatesFrame(fid: number, c : FrameContext) {
    
    let delegates : suggestionResponseDTO

    try {
      delegates = await getSuggestedDelegates(fid)
    } catch (e) {
      return errorFrame(c)
    }

    console.log(delegates)
    
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
            {`${delegates}`}
          </div>
        </div>
      ),
      intents: [
        <Button.Reset>Reset</Button.Reset>,
      ],
    })
  } */