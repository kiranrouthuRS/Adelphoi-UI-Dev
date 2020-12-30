import React from 'react'
import { useIdleTimer } from 'react-idle-timer';
import { useParams,useHistory } from "react-router-dom";
import { domainPath } from "../App"

 
 function IdleTimerContainer (props) {
    const history = useHistory();
  const handleOnIdle = event => {
    history.push(`/${domainPath}/logout/`)
    
  }
 
  const handleOnActive = event => {
    
  }
 
  const handleOnAction = (e) => {
    
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