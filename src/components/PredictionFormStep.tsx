/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import Modal from "react-modal";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import { withSnackbar, WithSnackbarProps } from "notistack";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import { AppState } from "../redux-modules/root";
import FormData from "form-data"
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import {
  wrap,
  subHeading,
  fieldRow,
  mainContent,
  twoCol,
  inputField,
  label1,
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
import { uploadcsvfile, downloadcsvfile } from "../api/api"



interface PredictionFormStepProps {
  Referral: Types.Referral[];
  DynamicQuestions: any;
  client: Types.Client;
  onFormSubmit: (client: Types.Client) => void;
  isLoading: boolean;
  hasError: boolean;
  error: string;
  isEdit: string;
  errors: any;
  user: any;


}
export interface PredictionFormStepState {
  isLoading: boolean;
  error: any;
  errors: any;
  hasError: boolean;
  isSubmitted: boolean;
  client_form: any;
  DynamicQuestions: any;
  prevJump: any;
  csvfile: any;
  isOpen: boolean;
  err_msg: any;
  isEdit: string;

}
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
const profile = css`
  position: relative;
  top: -25px;
  right: -1 0px; 
  radius: 2px;
  @media all and (max-width: 520px) {
    top: 0;
    right: 25;
  }
`;
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

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
      errors: "",
      client_form: [],
      prevJump: [],
      csvfile: "",
      err_msg: [],
      isOpen: false,
      isEdit: this.props.isEdit
    };
  }
  async componentDidMount() {
    let client_form = [] as any;
    this.props.DynamicQuestions.map
      (sec => sec.related === "false" && sec.questions && sec.questions.map(ques => {
        client_form.push({ [ques.question.replace(/ /g, "_")]: ques.answer === 0 ? 
        ques.answer : ques.suggested_answers.length >= 1 ? ques.answer && 
        ques.suggested_answers.filter((p, i) => p.value === ques.answer)[0].id : ques.answer ? ques.answer : "" });

      }))
    // console.log(
    //   this.props.DynamicQuestions.map
    //   (sec => sec.related === "false" && sec.questions && sec.questions.map(ques => {
    //     client_form.push({ [ques.question.replace(/ /g,"_")]: ques.answer === 0 ? ques.answer :ques.suggested_answers.length   });

    //   }))
    // )

    this.setState({
      DynamicQuestions: this.props.DynamicQuestions,
      client_form: Object.assign({}, ...client_form),
      isOpen: this.props.errors ? true : false,
      err_msg: this.props.errors,
    })
  }

  handleClose = () => {
    this.setState({
      isOpen: false
    })
  }

  getAge = (date, fromDate) => {
    // const date = value;
    // const fromDate = value;
    if (!date) {
      return "";
    }
    let today: Date;
    if (!fromDate) {
      today = new Date();
    } else {
      today = new Date(fromDate);
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
    let DynamicQuestions = this.state.DynamicQuestions;
    if (name === "Date_of_Birth") {
      const age = this.getAge(value, "") || "";
      this.setState({
        client_form: {
          ...this.state.client_form,
          [name]: value,
          Age: age

        }
      })
    }
    else {
      const val1: any = e.target.dataset.val1 ? e.target.dataset.val1 : "";
      const val2: any = e.target.dataset.val2 ? e.target.dataset.val2 : "";
      const type = e.target.dataset.type;
      const error_msg = e.target.dataset.msg;
      if (type === "select") {
        const length = e.target.dataset.length;
        var optionElement = e.target.childNodes[e.target.selectedIndex]
        let idx = optionElement.getAttribute('data-idx');
        let jump = optionElement.getAttribute('data-jump');
        let idy = optionElement.getAttribute('data-idy');
        let jumpto = jump && jump.replace(/,/g, '')
        this.setState({
          prevJump: {
            [name.replace(/ /g, "_")]: jumpto,
            hasError: false,
          }

        })
        DynamicQuestions.map((sec, i) => sec.section === jumpto ? (
          DynamicQuestions[i].related = "false"
        )
          :
          sec.section === this.state.prevJump[name.replace(/ /g, "_")] && (
            DynamicQuestions[i].related = "true"
          )
        )

      } else {
        if (type === "radio") {
          const jump = e.target.dataset.jump.replace(/,/g, '');
          const idx = e.target.dataset.idx;
          this.setState({
            prevJump: {
              [name.replace(/ /g, "_")]: jump,
              hasError: false,
            }
          })
          DynamicQuestions.map((sec, i) => sec.section === `${jump}` ? (
            DynamicQuestions[i].related = "false"
          )
            :
            sec.section == this.state.prevJump[name.replace(/ /g, "_")] && (
              DynamicQuestions[i].related = "true"
            )
          )
        }
      }
      if (val1 === "") {
        this.setState({
          client_form: {
            [name]: value
          },
          hasError: false,
        })
      }
      else {
        if (type === "number") {
          const err = parseInt(value) < parseInt(val1)
          const err1 = parseInt(value) > parseInt(val2)
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
            hasError: textRegex.test(value) ? false : true
          })
        }
      }

    }

  }
  handleSubmit = async (e) => {
    e.preventDefault();
    const client_form = this.state.client_form;
    this.setState({
      isSubmitted: true
    })
    //  const ageAtEpisodeStart = await this.getAge( new Date(client_form.Date_of_Birth), new Date(client_form.Date_of_Referral))
    console.log(client_form)
    let data = [] as any;
    let isValid_Data = true as any;
    Object.keys(client_form).map((ele, i) =>
      client_form[ele] || client_form[ele] === 0 ?
        (data.push({ [ele.replace(/_/g, ' ')]: client_form[ele] })) : (isValid_Data = false)
    )
    const formData = Object.assign({}, ...data)
    console.log(data)
    console.log(isValid_Data, this.state.hasError, formData)
    if (isValid_Data) {
      if (this.state.isEdit === "true" || !this.state.hasError) {
        await this.props.onFormSubmit(formData);
        this.setState({
          isSubmitted: false,
          err_msg: this.props.errors,
          isOpen: this.props.errors ? true : false
        })
      } else {

      }
    }
  }

  uploadCSV = async (e) => {
    e.preventDefault()
    let { name } = e.target;
    let file = e.target.files[0]
    this.setState({
      csvfile: file
    })
  }

  uploadFile = async () => {
    const file = this.state.csvfile;
    const formData = new FormData();
    formData.append('clients_file', file)
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken;
    const res = await uploadcsvfile(formData, is_accessToken);
    if (res.message === "client registered") {
      alert("Client registered.")
    }
    else {
      this.setState({
        err_msg: res.response,
        isOpen: true
      })
    }
  }

  downloadCSV = async (e) => {
    const is_accessToken: any = this.props.user && this.props.user.user.accessToken;
    const res = await downloadcsvfile(is_accessToken)
  }

  display = (id) => {
    const tempArray = [] as any;
    let questions = this.state.DynamicQuestions[id].questions && this.state.DynamicQuestions[id].questions;
    const length: any = questions && questions.length
    for (let i = 0; i < length; i++) {
      if ((i + 1) % 2 !== 0) {
        var tempArray1 = [] as any;
        tempArray1.push(questions[i]);
        if (length === i + 1) {
          tempArray.push(tempArray1)
        }
      }
      else {
        tempArray1.push(questions[i]);
        tempArray.push(tempArray1)
      }

    }
    return tempArray

  }

  render() {
    const { DynamicQuestions } = this.state;
    const { errors } = this.props;
    console.log(this.state)
    return (
      <div css={wrap}>

        <div css={mainContent}>
          {DynamicQuestions &&
            <div css={fieldRow} style={{ justifyContent: "center" }}>
              <Button
                type="submit"
                size="small"
                variant="contained"
                color="primary"
                style={{ marginRight: 10 }}
                css={logout}
                onClick={this.downloadCSV}
              >
                Download CSV template
            </Button>
              <div css={profile}>
                <input name="uploadfile" type="file" onChange={this.uploadCSV} />
                <Button
                  type="submit"
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={this.uploadFile}
                  style={{ marginRight: 10 }}>Upload</Button>
              </div>
            </div>
          }
          <Modal
            isOpen={this.state.isOpen}
            ariaHideApp={false}
            onRequestClose={this.handleClose}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <div>
              <h1 css={subHeading}>Please correct the following errors and try again.</h1>
              {this.state.err_msg && this.state.err_msg.map((e, i) => <div style={{ color: "red" }}>{this.state.err_msg[i]}</div>)}

            </div>

          </Modal>
          <form name="newClientForm" onChange={this.handleChange} onSubmit={this.handleSubmit}>

            {DynamicQuestions.map((sections, index) =>
              sections.related === "true" ? "" :
                <React.Fragment>

                  <h1 css={subHeading}>{sections.section}</h1>
                  {this.display(index).map((item, ind) => {
                    return <div css={fieldRow}>{item.map((ques, index_1) =>
                      ques.flag === "0" &&
                      (<div css={twoCol}>
                        <label css={label1} >{ques.question}</label>
                        {ques.description &&
                          <label style={{ fontSize: "16px" }}> ({ques.description})</label>
                        } <br />

                        {ques.answer_type === "SELECT" ?
                          <select
                            css={selectField}
                            name={ques.question.replace(/ /g, "_")}
                            data-type={ques.answer_type.toLowerCase()}
                            data-length={ques.suggested_jump.length}

                          >
                            <option value="">Select</option>
                            {ques.suggested_answers.map((ans, i) =>

                              <option key={i}
                                value={ans.id}
                                data-idx={index}
                                data-idy={ind}
                                data-jump={ques.suggested_jump.map(sj => ans.value === sj.answer ? sj.jumpto ? sj.jumpto : "" : "")}
                                selected={this.state.client_form[ques.question.replace(/ /g, "_")] === ans.id}>{ans.value}</option>
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
                                      data-jump={ques.suggested_jump.map(sj => ans.value === sj.answer ? sj.jumpto ? sj.jumpto : "" : "")}
                                      data-idx={index}
                                      data-idy={ind}
                                      name={ques.question.replace(/ /g, "_")} value={ans.id}
                                      checked={this.state.client_form[ques.question.replace(/ /g, "_")] === ans.id.toString() ? true :
                                        this.state.client_form[ques.question.replace(/ /g, "_")] === ans.id}
                                      data-type={ques.answer_type.toLowerCase()}
                                    />{" "}
                                    <label htmlFor={i}>{ans.value}</label>
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
                                      name={ques.question.replace(/ /g, "_")}
                                      value={this.state.client_form[ques.question]}
                                      required={ques.required === "yes" ? true : false}
                                      data-type={ques.answer_type.toLowerCase()}
                                      data-idx={index}
                                      data-idy={ind}
                                      checked={this.state.client_form[ques.question.replace(/ /g, "_")] === ans.id.toString()}
                                    />{" "}
                                    <label htmlFor={ans}>{ans.value}</label>
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
                                    name={ques.question.replace(/ /g, "_")}
                                    value={this.state.client_form[ques.question.replace(/ /g, "_")]}
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
                                    name={ques.question.replace(/ /g, "_")}
                                    value={this.state.client_form[ques.question.replace(/ /g, "_")]}
                                    type={ques.answer_type.toLowerCase()}
                                  />

                                </Fragment>
                        }
                        {this.state.isSubmitted === true ? this.state.error[ques.question.replace(/ /g, "_")] ?
                          <div style={{ color: "red" }}>{this.state.error[ques.question.replace(/ /g, "_")]}</div> : this.state.client_form[ques.question.replace(/ /g, "_")] ? "" :
                            ques.required === "yes" ? <div style={{ color: "red" }}>Required</div> : "" : ""}
                      </div>
                      ))}</div>

                  })
                  }
                </React.Fragment>
            )}
            {/* <div css={fieldRow} style={{ justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  style={{ marginRight: 10 }}
                >
                  {values.Exclusionary_Criteria ? "Submit" : "Next"}
                </Button>
              </div> */}
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

