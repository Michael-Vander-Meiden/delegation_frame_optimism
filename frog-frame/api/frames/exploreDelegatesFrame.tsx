import { Button, Frog, FrameContext } from 'frog';
import { getSuggestedDelegates } from '../service/suggestedDelegatesServices.js';
import { suggestionResponseDTO } from '../service/suggestionResponseDTO.js';
import { errorFrame } from '../frames/errorFrame.js';

export const exploreDelegatesFrame = new Frog({ title: 'Explore Delegates' });

exploreDelegatesFrame.frame('/', async ( c: FrameContext) => {

  const { frameData } = c;
  const { fid } = frameData || {};  

  if (typeof fid !== 'number' || fid === null) {
    throw new Error('Invalid type returned');
  }

  let delegates: suggestionResponseDTO

  try {
    delegates = await getSuggestedDelegates(fid);


    if (delegates.length === 0) {
      const failedMessage = 'No delegates found.';
      return failedMessage;
    }

  } catch (e) {
    return errorFrame(c);
  }

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
            flexDirection: 'column',
            position: 'absolute',
            color: '#E5383B',
            fontSize: '30px',
            textTransform: 'uppercase',
            letterSpacing: '-0.030em',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            lineHeight: 1.4,
            padding: '0 120px',
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            textAlign: 'center', 
          }}>
          <h1>{`Suggested delegates`}</h1>
          <h2>{`Address`}</h2>
          <ul style={{ listStyleType: 'none', padding: 0, margin: '20px 0', fontSize: '30px' }}>
            {delegates.map((item, index) => (
              <li key={index} style={{ margin: '10px 0' }}>{item.address}</li>
            ))}
          </ul>
          <h2>{`Following accounts delegating to this address `}</h2>
          <ul style={{ listStyleType: 'none', padding: 0, margin: '20px 0', fontSize: '30px' }}>
            {delegates.map((item, index) => (
              <li key={index} style={{ margin: '10px 0' }}>{item.count}</li>
            ))}
          </ul>
        </div>
      </div>
    ),
    intents: [
      <Button.Reset>Reset</Button.Reset>,
    ],
  });
});