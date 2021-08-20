/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { subHeading,fieldRow} from "./styles";
import { domainPath } from "../App"

const PageNotFound: React.FC = props => {
          return(
            <h1>Access is Denied</h1>
            )

}

export default PageNotFound;