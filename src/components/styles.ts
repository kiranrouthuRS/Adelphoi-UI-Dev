/** @jsx jsx */
import { css } from "@emotion/core";

export const flexRow = css`
  display: flex;
  flex-direction: row;
`;

export const backdrop = css`
  z-index: 5 !important;
  color: #fff;
`;

export const flexCol = css`
  display: flex;
  flex-direction: column;
`;

export const wrap = css`
  ${flexRow}
  box-sizing: border-box;
`;

export const mainContent = css`
  margin-top: 12px;
  width: 100%;
  box-sizing: border-box;
`;

export const heading = css`
  font-size: 32px;
  font-weight: bold;
  color: #8284e5;
`;

export const subHeading = css`
  font-size: 30px;
  font-weight: bold;
  color: #8284e5;
`;

export const fullWidth = css`
  width: 100%;
  margin-bottom: 24px;
`;

export const fieldRow = css`
  @media all and (min-width: 520px) {
    ${flexRow}
    justify-content: space-between;
    margin-bottom: 16px;
  }
`;

export const twoCol = css`
  @media all and (min-width: 520px) {
    margin-bottom: 20px;
    margin-right: 8px;
    width: 100%;
    :last-child {
      margin-right: 0;
    }
  }
  flex-direction: column;
  margin-bottom: 8px;
  & > span {
    color: red;
  }
`;

export const inputField = css`
  box-sizing: border-box;
  min-width: 0px;
  display: inline;
  background-color: #f5f5f5;
  border-radius: 0;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #8284e5;
  width: 100%;
  height: 44px;
  -webkit-appearance: none;
  font-family: inherit !important;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  margin: 0px;
  padding: 8px;
  :disabled {
    color: #999999;
  }
}
`;

export const datePicker = css`
  ${inputField}
  flex-direction: row !important;
  & > div {
    font-family: "Quicksand", Helvetica, sans-serif !important;
  }
`;

export const label = css`
  display: block;
  font-weight: bold;
  font-size: 18px;
  color: #000;
  margin-bottom: 5px;
`;

export const txtLabel = css`
  ${label}
  font-size: 16px;
`;

export const label1 = css`
font-weight: bold;
font-size: 18px;
color: #000;
margin-bottom: 5px;
  `;

export const fieldBox = css`
  display: inline-block;
  padding: 12px;
  border-bottom: 1px solid #8284e5;
  background-color: #f5f5f5;
  margin-right: 5px;
  width: 135px;
`;
export const fieldBox1 = css`
  display: inline-block;
  padding: 12px;
  // border-bottom: 1px solid #8284e5;
  // background-color: #f5f5f5;
  margin-right: 5px;
  width: 135px;
`;

export const radioBox = css`
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #8284e5;
  background-color: #f5f5f5;
  margin-right: 5px;
  margin-bottom: 5px;
  width: 150px;
  & label {
    margin-left: 5px;
  }
`;

export const chkBox = css`
  padding: 16px;
  border-bottom: 1px solid #8284e5;
  background-color: #f5f5f5;
  margin-right: 5px;
  margin-bottom: 16px;
`;

export const selectField = css`
  ${inputField}

  background-image:
      linear-gradient(45deg, transparent 50%, #8284e5 50%),
      linear-gradient(135deg, #8284e5 50%, transparent 50%);
  background-position: calc(100% - 20px) calc(1em + 2px),
    calc(100% - 15px) calc(1em + 2px), calc(100% - 2.5em) 0.5em;
  background-size: 5px 5px, 5px 5px, 1px 1.5em;
  background-repeat: no-repeat;
`;

export const tableRow = css`
  cursor: pointer;
`;

export const tableHeader = css`
  background-color: #e3e4fb;
  font-weight: bold;
`;

export const dataTable = css`
  & th,
  & td {
    font-family: "Quicksand", Helvetica, sans-serif !important;
  }
`;

export const panel = css`
  flex-direction: column;
`;

export const panelHeader = css`
  background-color: #e3e4fb !important;
`;

export const panelHeading = css`
  font-weight: bold;
  font-size: 18px;
  background-color: #e3e4fb !important;
`;

export const txtDetail = css`
  color: #8284e5;
  font-weight: bold;
`;

export const outerCircle = css`
background: #000;
border-radius: 50%;
height: 150px;
color: #fff;
width: 150px;
position: relative;
  `;
export const innerCircle  = css`
position: absolute;
color: #000;
background: #fff;
border-radius: 50%;
height: 80px;
width: 80px;
/*
 Put top edge and left edge in the center
*/
top: 70%;
left: 60%;
margin: -51px 0px 0px -39px;
  `;

// export const circle = css`
//   background: #000000;
//   border-radius: 50%;
//   color: #fff;
//   display: block;
//   height: 0;
//   overflow: hidden;
//   padding-top: 100%;
//   position: relative;
//   width: 100%;
//   `;

//   export const smallCircle = css`
//   background: #FFFFFF;
//   border: "10px solid white";
//   border-radius: 50%;
//   color: #fff;
//   display: flex; 
//     justify-content: space-between;
//   height: 0;
//   overflow: hidden;
//   padding-top: 100%;
  
//   width: 40%;
//   `;

  export const smallcircleContent = css`
  align-items: center;
  display: flex;
  height: 100%;
  hyphens: auto;
  justify-content: center;
  left: 50%;
  padding: 0.75em;
  position: absolute;
  text-align: center;
  transform: translate(-50%, -50%);
  top: 50%;
  width: 100%;
  `;

  export const circleContent = css`
  align-items: center;
  display: flex;
  height: 100%;
  hyphens: auto;
  justify-content: center;
  left: 50%;
  padding: 0.75em;
  position: absolute;
  text-align: center;
  transform: translate(-60%, -77%);
  top: 50%;
  width: 100%;
  `;


  export const container = css`
  max-width: 66vmin;
  width: 66%;
  `;
