/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { subHeading,fieldRow} from "./styles";
import { domainPath } from "../App"
interface Notifications1Props {
    getNotifications : (Type: any) => void;
    
  }
const Notifications1: React.FC<Notifications1Props> = props => {
          return(
            <form name="UsersForm" >
            <h1 css={subHeading}>Notification Center:</h1> 
   <div css={fieldRow} > 
   <Link to={`/${domainPath}/notifications/pending`} onClick={()=>props.getNotifications("pending")}>There are clients still in pending status - Click to view</Link>
   </div>
   <div css={fieldRow} > 
   <Link  to={`/${domainPath}/notifications/pcr`} onClick={()=>props.getNotifications("pcr")}>There are placed clients with unknown Program Completion Outcomes - Click to view</Link>
   </div>
   <div css={fieldRow} > 
   <Link  to={`/${domainPath}/notifications/roc`} onClick={()=>props.getNotifications("roc")}>There are clients with unknown Remain Out of Care outcomes - Click to view</Link>
   </div>
 </form>
            )

}

export default Notifications1;
