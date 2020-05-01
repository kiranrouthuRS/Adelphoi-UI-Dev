/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState } from "react";
// import { useHistory } from "react-router-dom";
import { Formik, ErrorMessage, FormikErrors } from "formik";
import { useSnackbar } from "notistack";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
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
  backdrop
} from "./styles";
import * as Types from "../api/definitions";

interface ReferralListProps {
  referralList: Types.Referral[];
  isLoading: boolean;
  hasError: boolean;
  error: string;
  createReferral: (referral: Types.Referral) => Promise<void>;
  updateReferral: (referral: Types.Referral) => Promise<void>;
  deleteReferral: (referral: Types.Referral) => Promise<void>;
}

interface FormValues {
  referral_name: string;
  editing_referral_name: string;
  isDelete: boolean;
}

const initialValues: FormValues = {
  referral_name: "",
  editing_referral_name: "",
  isDelete: false
};

const ReferralList: React.FC<ReferralListProps> = props => {
  const { enqueueSnackbar } = useSnackbar();

  const [editingReferral, setEditingReferral] = useState<Types.Referral | null>(
    null
  );
  

  const renderCell = (
    referral: Types.Referral,
    values: FormValues,
    handleChange:
      | ((event: React.ChangeEvent<HTMLInputElement>) => void)
      | undefined,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    if (
      editingReferral &&
      editingReferral.referral_code === referral.referral_code
    ) {
      return (
        <React.Fragment>
          <TableCell>
            <input
              type="text"
              name="editing_referral_name"
              css={inputField}
              style={{ width: "100%" }}
              placeholder="Add referral name"
              value={values.editing_referral_name || ""}
              onChange={handleChange}
            />
            <ErrorMessage component="span" name="editing_referral_name" />
          </TableCell>
          <TableCell>
            <Button
              type="submit"
              size="small"
              variant="contained"
              color="primary"
              
              >
              Update
            </Button>
            <Button
              type="submit"
              size="small"
              variant="contained"
              color="secondary"
              onClick={(e)=>{
                setFieldValue('isDelete',true)
                
              }}
              >
              Delete
            </Button>
            <Button
              type="button"
              size="small"
              variant="contained"
              color="default"
              onClick={() => setEditingReferral(null)}
            >
              Cancel
            </Button>
          </TableCell>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <TableCell>{referral.referral_name}</TableCell>
        <TableCell>
          <Link
            onClick={() => {
              setEditingReferral(referral);
              setFieldValue(
                "editing_referral_name",
                referral.referral_name,
                false
              );
            }}
          >
            Edit
          </Link>
        </TableCell>
      </React.Fragment>
    );
  };

  // const history = useHistory();
  /** */
  const { referralList } = props;
  return (
    <div css={wrap}>
      <div css={mainContent}>
        <Backdrop css={backdrop} open={props.isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <div>
          <h1 css={subHeading}>Referral Sources</h1>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validate={values => {
              const errors: FormikErrors<FormValues> = {};
              if (!editingReferral && !values.referral_name) {
                errors.referral_name = "Required";
              }
              if (editingReferral && !values.editing_referral_name) {
                errors.referral_name = "Required";
              }
              return errors;
            }}
            onSubmit={async (values, helpers) => {
              try {
                if (editingReferral) {
                   const referral: Types.Referral = {
                    referral_code: editingReferral.referral_code,
                    referral_name: values.editing_referral_name
                  };
                  if(values.isDelete){
                    await props.deleteReferral(referral);
                    enqueueSnackbar("Referral Source deleted successfully");
                    helpers.resetForm();
                  }else{
                    await props.updateReferral(referral);
                    enqueueSnackbar("Referral Source updated successfully");
                    helpers.resetForm();
                  }
                 
                  setEditingReferral(null);
                } else {
                  const referral: Types.Referral = {
                    referral_code: 0,
                    referral_name: values.referral_name
                  };
                  await props.createReferral(referral);
                  enqueueSnackbar("Referral Source created successfully");
                  helpers.resetForm();
                }
              } catch (error) {
                enqueueSnackbar("Could create/update Referral Source");
              }
            }}
          >
            {({ values, handleSubmit, handleChange, setFieldValue }) => (
              <form name="ReferralForm" onSubmit={handleSubmit}>
                <div css={fieldRow}>
                  <div css={twoCol}>
                    <input
                      type="text"
                      name="referral_name"
                      css={inputField}
                      placeholder="Add new Referral.."
                      value={values.referral_name || ""}
                      onChange={e => {
                        setEditingReferral(null);
                        handleChange(e);
                      }}
                    />
                    <ErrorMessage component="span" name="referral_name" />
                  </div>

                  <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </div>

                <Table aria-label="referral table" css={dataTable}>
                  <TableHead>
                    <TableRow css={tableHeader}>
                      <TableCell style={{ width: "600px" }}>
                        Referral Source Name
                      </TableCell>
                      <TableCell>Edit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {referralList.length > 0 ? (
                      referralList.map(p => (
                        <TableRow key={p.referral_code} css={tableRow}>
                          {renderCell(p, values, handleChange, setFieldValue)}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow key={9999}>
                        <TableCell colSpan={2} style={{ textAlign: "center" }}>
                          &nbsp;
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </form>
            )}
          </Formik>
        </div>
      </div>
      {/* MAIN CONTENT */}
    </div>
  );
};

export default ReferralList;
