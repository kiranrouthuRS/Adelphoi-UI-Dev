/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { useHistory } from "react-router-dom";
import { Formik, ErrorMessage, FormikErrors } from "formik";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { domainPath } from "../App"
import { downloadDataReport } from "../api/api"
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import {
  wrap,
  subHeading,
  fieldRow,
  mainContent,
  twoCol,
  inputField,
  tableHeader,
  tableRow,
  dataTable,
  txtDetail
} from "./styles";
import React, { useState, useEffect } from "react";

const logout = css`
                position: relative;
                top: -25px;
                right: 25px;
                radius: 2px;
                
                @media all and (max-width: 520px) {
                  top: 0;
                  right: 0;
                }
              `;
interface ClientSearchProps {
  clientList: any;
  onFormSubmit: (client_code: string, ssn: string, first_name: string, last_name: string, dob: string) => void;
  clearData: () => void;
  isLoading: boolean;
  hasError: boolean;
  error: string;
  headerColor: string;
  user: any;
}

interface FormValues {
  first_name: string;
  last_name: string;
  client_code: string;
  ssn: string;
}

const initialValues: FormValues = {
  first_name: "",
  last_name: "",
  client_code: "",
  ssn : ""
};

const ClientSearch: React.FC<ClientSearchProps> = props => {
  const history = useHistory();
  /** */
  let { clientList } = props;
  useEffect(() => {
    props.clearData()
}, []);
  clientList = clientList.map(sec=>sec.sections)
  const client = domainPath === "adelphoiDDD" ? [] : clientList.map(q => q[0].questions)
  const getlabel = () => {
    let label = domainPath === "persues-house" ? "Client Code / SSN Number" : "Client Code";
    return label;
   }
  const ClientLableName = getlabel()
  const downloadDump = async (e) => {
    const is_accessToken: any = props.user && props.user.user.accessToken; 
    await downloadDataReport(is_accessToken)  
  }
 const tableCellCount = domainPath === "persues-house" ? 4 : 3
  return (
    <div css={wrap}>
      <div css={mainContent}>
      <div css={fieldRow} style={{ justifyContent: "center" }}>
      <Button
                type="submit"
                size="small"
                variant="contained"
                style={{
                  marginRight: 10,
                  backgroundColor: props.headerColor,
                  color: "#fff"
                }}
                css={txtDetail}
                onClick={downloadDump}
              >
                Download FirstMatch Data Report
              </Button>
            </div>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validate={values => {
            const errors: FormikErrors<FormValues> = {};
            if (!values.client_code && !values.ssn && !values.first_name && !values.last_name) {
              errors.client_code = "Enter either of the fields";
            }
            return errors;
          }}
          onSubmit={async (values, helpers) => {
            const code: any = values.client_code ? parseInt(values.client_code) : ""
            const ssncode: any = values.ssn ? parseInt(values.ssn) : ""
            await props.onFormSubmit(code,ssncode, values.first_name, values.last_name,"" );
            // helpers.resetForm();
          }}
        >
          {({ values, handleSubmit, handleChange }) => (
            <form name="clientSearchForm" onSubmit={handleSubmit}>
              <TableRow>
                <TableCell>
                  <input
                    type="text"
                    name="client_code"
                    css={inputField}
                    placeholder="Client Code"
                    value={values.client_code || ""}
                    onChange={handleChange}
                  />
                  <div style={{color: "red"}}>
                  <ErrorMessage component="span" name="client_code" />
                  </div>
                </TableCell>
                {domainPath === "persues-house" && (
                  <TableCell>
                  <input
                    type="text"
                    name="ssn"
                    css={inputField}
                    placeholder="SSN Number"
                    value={values.ssn || ""}
                    onChange={handleChange}
                  />
                  <ErrorMessage component="span" name="ssn" />
                </TableCell>
                )}
                <TableCell>
                  <input
                    type="text"
                    name="first_name"
                    css={inputField}
                    placeholder="First Name"
                    value={values.first_name || ""}
                    onChange={handleChange}
                  />
                  <ErrorMessage component="span" name="first_name" />
                  </TableCell>
                  <TableCell>
                  <input
                    type="text"
                    name="last_name"
                    css={inputField}
                    placeholder="Last Name"
                    value={values.last_name || ""}
                    onChange={handleChange}
                  />
                  <ErrorMessage component="span" name="last_name" />
                </TableCell>
                
                <Button
                  type="submit"
                  size="small"
                  variant="contained"
                  style={{ marginRight: 10, 
                    backgroundColor: props.headerColor,
                    color: "#fff",height: "44px", marginTop: "15px"  }}
                 
                >
                  <SearchIcon />
                </Button>
              </TableRow>
            </form>
          )}
        </Formik>
        <div>
          <h1 css={subHeading} style= {{color: props.headerColor}}>Client List</h1>
          {domainPath === "persues-housessss" ?
            <Table aria-label="clients table" css={dataTable}>
              <TableHead>
                <TableRow css={tableHeader}>
                  <TableCell>Client Name</TableCell>
                  <TableCell>Client Code</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Gender</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientList.length > 0 ? (
                  clientList.map(cl => (
                    <TableRow
                      hover
                      key={cl.client_code || undefined}
                      onClick={() =>
                        history.push(
                          `existing-client/client-details/${cl.client_code}`
                        )
                      }
                      css={tableRow}
                    >
                      <TableCell>{cl.name}</TableCell>
                      <TableCell>{cl.client_code}</TableCell>
                      <TableCell>{cl.age}</TableCell>
                      <TableCell>
                        {cl.gender && cl.gender.toString() === "1"
                          ? "Female"
                          : "Male"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow key={9999}>
                      <TableCell colSpan={4} style={{ textAlign: "center" }}>
                        No results found
                </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
            :

            <Table aria-label="clients table" css={dataTable}>
              <TableHead>
                <TableRow css={tableHeader}>
                {client.length > 0 && client.flat().map((cl,i) => 
                  // <React.Fragment>
                  i < tableCellCount && (
                  <TableCell>{cl.question}</TableCell>
                  
                ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {clientList.questions.length > 0 ? ( */}
                {client.length > 0 ? client.map((cl,i) => (
                  <TableRow
                    hover
                    key={i}
                    onClick={() =>
                      history.push(
                        `existing-client/client-details/${cl.find(id=> id.question === "Client Code").answer}`
                      )
                    }
                    css={tableRow}
                  >
                    <TableCell>{cl[0].answer}</TableCell>
                    <TableCell>{cl[1].answer}</TableCell>
                    <TableCell>{cl[2].answer}</TableCell>
                    {domainPath === "persues-house" &&
                    <TableCell>{cl[3].answer}</TableCell>
                    }

                    {/* <TableCell>
                      {cl.gender && cl.gender.toString() === "1"
                        ? "Female"
                        : "Male"}
                    </TableCell> */}
                  </TableRow>
                ))
                  : (
                    <TableRow key={9999}>
                      <TableCell colSpan={4} style={{ textAlign: "center" }}>
                        No results found
                  </TableCell>
                    </TableRow>
                  )}

              </TableBody>
            </Table>

          }

        </div>
      </div>
      {/* MAIN CONTENT */}
    </div>
  );
};

export default ClientSearch;
