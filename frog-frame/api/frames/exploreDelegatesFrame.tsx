import { Button, Frog } from 'frog';
import { getSuggestedDelegates } from '../service/suggestedDelegatesServices.js';
import { suggestionResponseDTO } from '../service/suggestionResponseDTO.js';
import { errorFrame } from '../frames/errorFrame.js';

export const exploreDelegatesFrame = new Frog({ title: 'Explore Delegates' });

exploreDelegatesFrame.frame('/', async (c) => {

  const { frameData } = c;
  const { fid } = frameData || {};  

  //const fid = 192336
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
        <img width="1200" height="630" alt="background" src={`${process.env.IMAGE_URL}/Frame_3_rec.png`}/>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            color: '#161B33',
            fontSize: '70px',
            textTransform: 'uppercase',
            letterSpacing: '-0.030em',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            boxSizing: 'border-box',
            alignItems: 'center',
            lineHeight: 1.4,
            padding: '0px 50px',
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            textAlign: 'center', 
          }}>
            <h1></h1>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                maxWidth: '100%',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '10px'
            }}>
                  <ul style={{
                    display: 'flex',
                    flexDirection: 'column',
                    listStyleType: 'none',
                    padding: '0',
                    margin: '0',
                    width: '40%',
                    boxSizing: 'border-box'
                  }}>
                    {delegates.map((item, index) => (
                      <li key={index} style={{
                        margin: '10px 0',
                        padding: '5px',
                        borderBottom: '1px solid #ddd',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>{item.address}</li>
                    ))}
                  </ul>
                
                  <ul style={{
                    display: 'flex',
                    flexDirection: 'column',
                    listStyleType: 'none',
                    padding: 0,
                    margin: '0',
                    width: '20%',
                    boxSizing: 'border-box',
                  }}>
                    {delegates.map((item, index) => (
                      <li key={index} style={{ margin: '10px 0',
                        padding: '5px',
                        borderBottom: '1px solid #ddd',
                        justifyContent: 'flex-end', }}>{item.count}</li>
                    ))}
                  </ul>
            </div>
        </div>
      </div>
    ),
    intents: [
      <Button.Link href={`https://vote.optimism.io/delegates/${delegates[0].address}`}>1st Delegate</Button.Link>,
      <Button.Link href={`https://vote.optimism.io/delegates/${delegates[1].address}`}>2st Delegate</Button.Link>,
      <Button.Link href={`https://vote.optimism.io/delegates/${delegates[2].address}`}>3st Delegate</Button.Link>,
      <Button.Reset>Reset</Button.Reset>,
    ],
  });
});