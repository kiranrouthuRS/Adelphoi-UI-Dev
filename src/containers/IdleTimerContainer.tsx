import React from 'react'
import { useIdleTimer } from 'react-idle-timer';
import { useParams,useHistory } from "react-router-dom";
import { domainPath } from "../App"

 
 function IdleTimerContainer (props) {
    const history = useHistory();
  const handleOnIdle = event => {
    history.push(`/${domainPath}/logout/`)
    console.log('user is idle', event)
    console.log('last active', getLastActiveTime())
  }
 
  const handleOnActive = event => {
    console.log('user is active', event)
    console.log('time remaining', getRemainingTime())
  }
 
  const handleOnAction = (e) => {
    console.log('user did something', e)
  }
 
  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 15,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500
  })
 
  return (
    <div>
      {/* your app here */}
    </div>
  )
} 
export default IdleTimerContainer;