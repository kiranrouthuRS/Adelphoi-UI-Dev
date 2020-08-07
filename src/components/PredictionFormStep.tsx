/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import FormData from "form-data"
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { Step1ValidationSchema, EditStep1ValidationSchema } from "./ValidationSchema";
import SnackNotification from "./SnackNotification";

import {
  wrap,
  subHeading,
  fieldRow,
  mainContent,
  twoCol,
  inputField,
  label,
  fieldBox,
  fieldBox1,
  selectField,
  datePicker
} from "./styles";
import * as Types from "../api/definitions";
import ErrorMessage from "./ErrorMessage";
import { Fragment } from "react";
import { store } from "../index";
import { AnyARecord } from "dns";
export const baseApiUrl = `http://3.7.135.210:8005/organizations`;
export const loginApiUrl = "http://3.7.135.210:8005";

interface PredictionFormStepProps {
  Referral: Types.Referral[];
  DynamicQuestions: any;
  client: Types.Client;
  onFormSubmit: (client: Types.Client) => void;
  isLoading: boolean;
  hasError: boolean;
  error: string;
  isEdit: string;
  errors: undefined;

}
export interface PredictionFormStepState {
  isLoading: boolean;
  error: any;
  hasError: boolean;
  isSubmitted: boolean;
  client_form: any;
  DynamicQuestions: any;
  prevJump: any;

}
export class PredictionFormStep extends React.Component<
  PredictionFormStepProps,
  PredictionFormStepState
  > {
  constructor(props: PredictionFormStepProps) {
    super(props);
    this.state = this.getInitialState();
  }
  getInitialState() {
    return {
      isLoading: false,
      hasError: true,
      isSubmitted: false,
      DynamicQuestions: [],
      error: [],
      client_form: [],
      prevJump: []
    };
  }
  componentDidMount() {
    this.setState({
      DynamicQuestions: this.props.DynamicQuestions
    })
  }
  getAge = (value) => {
    const date = value;
    const fromDate = value;
    if (!date) {
      return "";
    }
    let today: Date;
    if (!fromDate) {
      today = new Date();
    } else {
      today = new Date();
    }
    var birthDate = new Date(date);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    //let data = [...this.state.data]
    if (name === "Date of Birth") {
      const age = this.getAge(value) || "";
      this.setState({
        client_form: {
          ...this.state.client_form,
          [name]: value,
          Age: age

        }
      })
    } else {
      const val1: any = e.target.dataset.val1;
      const val2: any = e.target.dataset.val2;
      const type = e.target.dataset.type;
      const error_msg = e.target.dataset.msg;
      const jump = e.target.dataset.jump;
      const idx = e.target.dataset.idx;
      if (type === "select") {
        const length = e.target.dataset.length;
        var optionElement = e.target.childNodes[e.target.selectedIndex]
        let x = optionElement.getAttribute('data-idx');
        let y = optionElement.getAttribute('data-jump');
        let z = optionElement.getAttribute('data-idy');
        this.setState({
          prevJump: {
            [name]: y
          }

        })
        const DynamicQuestions = this.state.DynamicQuestions;
        DynamicQuestions[y ? y : parseInt(x) + 1].related = false
        DynamicQuestions[this.state.prevJump[name] ? this.state.prevJump[name] : 0].related = this.state.prevJump[name] ? true : false;
      } else {
        if (type === "radio") {
          this.setState({
            prevJump: {
              [name]: jump
            }

          })
          const DynamicQuestions = this.state.DynamicQuestions;
          DynamicQuestions[jump ? jump : parseInt(idx) + 1].related = false;
          DynamicQuestions[this.state.prevJump[name] ? 
          this.state.prevJump[name] : 0].related = this.state.prevJump[name] ? true : false; 
        }
      }


      if (val1 === "") {
        this.setState({
          client_form: {
            ...this.state.client_form,
            [name]: value
          },
          hasError: false,

        })
      }
      else {
        if (type === "number") {
          const err = parseInt(value) <= parseInt(val1)
          const err1 = parseInt(value) >= parseInt(val2)
          this.setState({
            client_form: {
              ...this.state.client_form,
              [name]: value,
            },
            error: {
              ...this.state.error,
              [name]: err === true ? error_msg : err1 === true ? error_msg : "",
            },
            hasError: err === true ? true : err1 === true ? true : false
          })
        } else {
          const regex = val2 === "Both" ? "^[A-Za-z ]+$" : val2 === "Numbers" ? "^[ A-Za-z_@./#&+-]*$" : val2 === "Special characters" ? "^[A-Za-z0-9 ]+$" : ""
          const textRegex = new RegExp(regex);
          this.setState({
            client_form: {
              ...this.state.client_form,
              [name]: value,
            },
            error: {
              ...this.state.error,
              [name]: textRegex.test(value) ? "" : error_msg,
            },
            hasError: true
          })
        }
      }

    }

  }
  handleSubmit = (e) => {
    e.preventDefault();
    const client_form = this.state.client_form;
    this.setState({
      isSubmitted: true
    })
    console.log(this.state.hasError, "this.state.hasError")
    if (!this.state.hasError) {
      this.props.onFormSubmit(client_form);
    }

  }
  render() {
    const { DynamicQuestions } = this.state;
    var columnA = DynamicQuestions.map(sec => sec.questions.filter((ques, id) => id % 2 === 0))
    var columnB = DynamicQuestions.map(sec => sec.questions.filter((ques, id) => id % 2 !== 0))
    return (
      <div css={wrap}>

        <div css={mainContent}>

          <form name="newClientForm" onChange={this.handleChange} onSubmit={this.handleSubmit}>
            {DynamicQuestions.map((sections, index) =>
              sections.related === true ? "" :
                <React.Fragment>

                  <h1 css={subHeading}>{sections.section}</h1>

                  {/* <div css={fieldRow}> */}
                  {sections.questions.map((ques, ind) =>
                    <Fragment>

                      <div css={twoCol}>
                        <label css={label}>{ques.question}</label>

                        {ques.answer_type === "SELECT" ?
                          <select
                            css={selectField}
                            name={ques.question}
                            data-type={ques.answer_type.toLowerCase()}
                            data-length={ques.suggested_jump.length}

                          >
                            <option value="">Select</option>
                            {ques.suggested_answers.map((ans, i) =>

                              <option key={i}
                                value={ans}
                                data-idx={index}
                                data-idy={ind}
                                data-jump={ques.suggested_jump[i]}
                                selected={this.state.client_form[ques.question_id] === ans}>{ans}</option>
                            )}
                          </select>
                          :
                          ques.answer_type === "RADIO" ?
                            <React.Fragment>
                              {ques.suggested_answers.map((ans, i) =>
                                <div
                                  css={fieldBox}
                                  style={{ width: "47.8%", display: "inline-block" }}
                                >
                                  <React.Fragment>
                                    <input
                                      type="radio"
                                      data-jump={ques.suggested_jump[i]}
                                      data-idx={index}
                                      data-idy={ind}
                                      name={ques.question} value={ans}
                                      data-type={ques.answer_type.toLowerCase()}
                                    />{" "}
                                    <label htmlFor={ans}>{ans}</label>
                                  </React.Fragment>

                                </div>

                              )}
                            </React.Fragment>
                            :
                            ques.answer_type === "CHECKBOX" ?

                              ques.suggested_answers.map(ans =>
                                <div
                                  css={fieldBox}
                                  style={{ width: "47.8%", display: "inline-block" }}
                                >
                                  <React.Fragment>
                                    <input
                                      type="checkbox"
                                      name={ques.question} value={this.state.client_form[ques.question_id]}
                                      required={ques.required === "yes" ? true : false}
                                      data-type={ques.answer_type.toLowerCase()}
                                      data-idx={index}
                                      data-idy={ind}
                                    />{" "}
                                    <label htmlFor={ans}>{ans}</label>
                                  </React.Fragment>
                                </div>
                              )
                              :
                              ques.answer_type === "NUMBER" ?
                                <Fragment>
                                  <input
                                    css={inputField}
                                    data-val1={ques.validation1}
                                    data-val2={ques.validation2}
                                    data-type={ques.answer_type.toLowerCase()}
                                    data-msg={ques.error_msg}
                                    data-idx={index}
                                    data-idy={ind}
                                    name={ques.question} value={this.state.client_form[ques.question]}
                                    type={ques.answer_type.toLowerCase()}
                                  //  min={ques.validation1}
                                  //  max={ques.validation2}
                                  //  required = {ques.required === "yes" ? true: false}
                                  />
                                </Fragment>
                                :
                                <Fragment>
                                  <input
                                    css={inputField}
                                    data-val1={ques.validation1}
                                    data-val2={ques.validation2}
                                    data-type={ques.answer_type.toLowerCase()}
                                    data-msg={ques.error_msg}
                                    data-idx={index}
                                    data-idy={ind}
                                    name={ques.question}
                                    value={this.state.client_form[ques.question_id]}
                                    type={ques.answer_type.toLowerCase()}
                                  />

                                </Fragment>
                        }
                        {this.state.isSubmitted === true ? this.state.error[ques.question] ?
                          <div style={{ color: "red" }}>{this.state.error[ques.question]}</div> : this.state.client_form[ques.question] ? "" :
                            ques.required === "yes" ? <div style={{ color: "red" }}>Required</div> : "" : ""}
                      </div>

                    </Fragment>
                  )}

                </React.Fragment>
            )}
            <div css={fieldRow} style={{ justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                style={{ marginRight: 10 }}
              >
                Submit
                </Button>
            </div>
          </form>

        </div>
        {/* MAIN CONTENT */}
      </div>
    );
  }
};

export default PredictionFormStep; 