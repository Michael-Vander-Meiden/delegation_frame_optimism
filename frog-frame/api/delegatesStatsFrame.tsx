import { Frog } from 'frog'
import { exploreDelegatesFrame } from './frames/exploreDelegatesFrame.js';
import {getStats } from './service/statsService.js';
import { DelegatesResponseDTO } from './service/delegatesResponseDTO.js';
import { errorFrame } from './frames/errorFrame.js';
import { noVerifiedAddressFrame } from './frames/noVerifiedAddressFrame.js';
import { noDelegateFrame } from './frames/noDelegateFrame.js';
import { goodDelegateFrame } from './frames/goodDelegateFrame.js';
import { badDelegateFrame } from './frames/badDelegateFrame.js';
 
export const delegatesStatsFrame = new Frog({ title: 'Delegate Stats Frame' })
 
delegatesStatsFrame.frame('/', async (c) => {
  /* const { frameData, verified } = c;
  const { fid } = frameData || {}    */ 
  const { inputText } = c;
  const fid = inputText === undefined ? c.frameData?.fid : Number(inputText)

  if(fid === undefined) {
    return errorFrame(c)
  }

  let delegate : DelegatesResponseDTO

  try {
    delegate = await getStats(fid)
  } catch (e) {
    return errorFrame(c)
  } 
  
/*   delegate.hasVerifiedAddress = true
  delegate.hasDelegate = true
  delegate.isGoodDelegate = true */

  if(!delegate.hasVerifiedAddress) {
    return noVerifiedAddressFrame(c)
  }   

  if(!delegate.hasDelegate) {
    return noDelegateFrame(fid, c)
  }

  if(!delegate.isGoodDelegate) {
    return badDelegateFrame(fid, c)
  }

  return goodDelegateFrame(fid, c)    
})

delegatesStatsFrame.route('/exploreDelegates', exploreDelegatesFrame)