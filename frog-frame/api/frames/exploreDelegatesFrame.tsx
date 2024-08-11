import { Button, Frog } from 'frog';
import { getSuggestedDelegates } from '../service/suggestedDelegatesServices.js';
import { suggestionResponseDTO } from '../service/suggestionResponseDTO.js';
import { errorFrame } from '../frames/errorFrame.js';

export const exploreDelegatesFrame = new Frog({ title: 'Explore Delegates' });

exploreDelegatesFrame.frame('/', async (c) => {

  const { frameData } = c;
  const { fid } = frameData || {};  


  if (typeof fid !== 'number' || fid === null) {
    throw new Error('Invalid type returned');
  }

  let delegates: suggestionResponseDTO

  try {
    delegates = await getSuggestedDelegates(fid);


    if (delegates.length === 0) {
      return errorFrame(c)
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
            boxSizing: 'border-box',
            alignItems: 'center',
            lineHeight: 1.4,
            padding: '0 120px',
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            textAlign: 'center', 
          }}>
            <h1>{`Suggested delegates`}</h1>
            <div style={{
                display: 'flex',
                width: '100%',
                maxWidth: '100%',
                overflowX: 'auto',
                justifyContent: 'center'
            }}>
                  <ul style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1',
                    listStyleType: 'none',
                    padding: 0,
                    margin: '0 10px',
                    width: '20%',
                  }}>
                    {delegates.map((item, index) => (
                      <li key={index} style={{ margin: '10px 0', padding: '5px', borderBottom: '1px solid #ddd' }}>{item.address}</li>
                    ))}
                  </ul>
                
                  <ul style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1',
                    listStyleType: 'none',
                    padding: 0,
                    margin: '0 10px',
                    width: '20%',
                  }}>
                    {delegates.map((item, index) => (
                      <li key={index} style={{ margin: '10px 0', padding: '5px', borderBottom: '1px solid #ddd' }}>{item.count}</li>
                    ))}
                  </ul>
            </div>
        </div>
      </div>
    ),
    intents: [
      <Button.Reset>Reset</Button.Reset>,
    ],
  });
});