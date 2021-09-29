/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import Modal from "react-modal";
import Button from "@material-ui/core/Button";
import FormData from "form-data"
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import {Persues_House_Score} from "./TramaQuestion"
import { domainPath } from "../App"
import {searchDClient} from "../api/api";    


import {
  wrap,
  subHeading,
  fieldRow,
  mainContent,
  twoCol,
  inputField,
  label1,
  fieldBox,
  selectField,
  tableHeader,
    tableRow,
    dataTable,

} from "./styles";
import * as Types from "../api/definitions";
import { Fragment } from "react";
import { uploadcsvfile, downloadcsvfile } from "../api/api"



interface PredictionFormStepProps {
  Referral: Types.Referral[];
  DynamicQuestions: any;
  client: Types.Client;
  onFormSubmit: (client: Types.Client) => void;
  GetQuestions: () => void;
  isLoading: boolean;
  hasError: boolean;
  error: string;
  isEdit: string;
  reReffer: string;
  errors: any;
  user: any;
  


}
export interface PredictionFormStepState {
  isLoading: boolean;
  error: any;
  errors: any;
  hasError: boolean;
  isSubmitted: boolean;
  ClientCode: any;
  client_form: any;
  Required_List: any;
  DynamicQuestions: any;
  prevJump: any;
  prevQuestionJump: any;
  csvfile: any;
  isOpen: boolean;
  err_msg: any;
  isEdit: string;
  reReffer: string;
  header_color: string;
  trauma_score: number; 
  visitedQuestion: any;

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
      ClientCode: "",
      hasError: true,
      isSubmitted: false,
      DynamicQuestions: [],
      error: [],
      errors: "",
      client_form: [],
      Required_List: [],
      prevJump: [],
      prevQuestionJump: [],
      csvfile: "",
      err_msg: [],
      isOpen: false,
      isEdit: this.props.isEdit,
      reReffer: this.props.reReffer,
      header_color: "",
      trauma_score: 0,
      visitedQuestion: []
    };
  }
  async componentDidMount() {
    await this.props.GetQuestions()
    await this.setState({
      DynamicQuestions: this.props.DynamicQuestions,
      isOpen: this.props.errors ? true : false,
      err_msg: this.props.errors,
      header_color: this.props.user && this.props.user.user.header_color
    })
    this.formState();
   
  }
  formState = async (name:  string = "",value: string = "",jump : any = "",ques_jump: any = "") => {
    let client_form = [] as any;
    let Required_List = [] as any;
    let prevJump =  [] as any; 
    let prevQuestionJump =  [] as any;
     this.state.DynamicQuestions.map
      (sec => sec.related === "false" && sec.questions && sec.questions.map(ques => {
        ques.related === "no" &&
        client_form.push({
          [ques.question.replace(/ /g, "_")]:  
            Array.isArray(ques.answer) ? ques.suggested_answers.map((q, j) => ques.answer.includes(q.value) &&
              q.id.toString()).filter(item => item !== false) :
              ques.answer === 0 ? ques.answer.toString() :
               ques.suggested_answers.length >= 1 ? ques.answer &&
                ques.suggested_answers.filter((p, i) => (p.value) === (ques.answer))[0].id.toString()  
                  : ques.answer ? ques.answer.toString()   :""
        });
        ques.suggested_jump.filter(n=> n &&  n.answer === ques.answer?.toString() && 
        (
         prevQuestionJump.push({
           [ques.question.replace(/ /g, "_")]: n.question_jumpto
          }),
          prevJump.push({
            [ques.question.replace(/ /g, "_")]:  n.jumpto
           }))
          
          );
        ques.related === "no" &&
        Required_List.push({
          [ques.question.replace(/ /g, "_")]: ques.required
        })
      }));
      console.log(client_form)
    let form_data = Object.assign({}, ...client_form)
    let visitedQuestion = [] as any;
    Persues_House_Score.length > 0 && Persues_House_Score.map((question) => 
         (Object.keys(form_data).includes(question.Question.replace(/ /g, '_')))
         && form_data[question.Question.replace(/ /g, '_')] && visitedQuestion.push({ 
           [question.Question.replace(/ /g, '_')]: form_data[question.Question.replace(/ /g, '_')].length > 1 ? 1 : question.values[form_data[question.Question.replace(/ /g, '_')]]
                                    &&question.values[form_data[question.Question.replace(/ /g, '_')]].id}))
     console.log(form_data)                                 
    await this.setState({
      // DynamicQuestions: this.props.DynamicQuestions,
      client_form: form_data,
      ClientCode: form_data["Client_Code"],
      Required_List: Object.assign({}, ...Required_List),
      visitedQuestion: Object.assign({}, ...visitedQuestion),
      trauma_score: form_data.Trauma_Score ? Number(form_data.Trauma_Score) : 0,
      prevJump: Object.assign({}, ...prevJump),
      prevQuestionJump: Object.assign({}, ...prevQuestionJump)
    })
  }

  handleClose = () => {
    this.setState({
      isOpen: false
    })
  }

  getAge = (date, fromDate) => {
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
    return age.toString();
  }
  keyUp = async (e) => {
    let { name, value } = e.target
    
    
    if(domainPath === "perseus-house"){
      if (name === "Date_of_Birth") {
        let {First_Name,Last_Name} = this.state.client_form
        const is_accessToken: any = this.props.user && this.props.user.user.accessToken;
        let response = await searchDClient("","",First_Name,Last_Name,value, is_accessToken);
        response.response && 
          response.response.length > 0 &&
          (alert("Client already exists. Do you want to continue?"))
      }
    }else{
      if (name === "Client_Code") {
        const is_accessToken: any = this.props.user && this.props.user.user.accessToken;
        let response = await searchDClient(value, "","","","", is_accessToken);
        response.response && 
          response.response.length > 0 &&
          (alert("Client Code already exists. Do you want to continue?"))
      }
    }
    
  }  

   AddTraumaScore = async(question,id) => { 
   let TScore = Persues_House_Score.find(score =>  score.Question === question.replace(/_/g, ' ')) 
   let selectedID = Array.isArray(id) ? id[0] : id;
   let isChecked = Array.isArray(id) ? id[1] : "";
   console.log(selectedID,TScore,this.state.client_form) 
   question = TScore?.related !== "" ? this.state.visitedQuestion[question] === undefined ? question : TScore?.related : question
   let score = TScore ? TScore?.related !== "" ? 
             this.state.visitedQuestion[question] === undefined ? 0 : 
             this.state.visitedQuestion[question] === 0 ? 0 : 
             selectedID?.toString() === "0" ? 0 
             : -this.state.client_form[TScore?.related]?.length+1 :
             (TScore.values[selectedID].id)  : 0; 
  let  clearPreviousData = TScore && TScore?.related && selectedID?.toString() === "1" && this.state.client_form[TScore?.related] !== undefined
   console.log(score,this.state.visitedQuestion[question])
  if(TScore !== undefined){
       await this.setState( 
          prevstate => ({ 
                 trauma_score: TScore?.multiselect ?  
                 isChecked ? TScore?.addValues ? 
                 prevstate.trauma_score + Number(score) :  
                 this.state.visitedQuestion[question] ? 
                 prevstate.trauma_score === 0 ? prevstate.trauma_score + Number(score) : prevstate.trauma_score
                  :prevstate.trauma_score + Number(score)
                 : 
                 TScore?.addValues ? prevstate.trauma_score - Number(score) 
                 :
                 this.state.client_form[question] && Number(score) === 0 ? prevstate.trauma_score : this.state.client_form[question].length === 2 ? prevstate.trauma_score - this.state.visitedQuestion[question] : prevstate.trauma_score 
              : 
              score === undefined ? prevstate.trauma_score  - this.state.visitedQuestion[question] :
              this.state.visitedQuestion[question] ? (prevstate.trauma_score - this.state.visitedQuestion[question]) + Number(score): 
                         prevstate.trauma_score + Number(score) 
                  }));     
                  console.log(this.state.trauma_score)
                 let DynamicQuestions = this.state.DynamicQuestions;
                 (DynamicQuestions[DynamicQuestions.length-1].questions.find(ques=> ques.question === "Trauma Score")).answer = this.state.trauma_score
                  console.log(clearPreviousData,question.replace(/_/g, ' '))
                  clearPreviousData && (DynamicQuestions[5].questions[1].answer = [])
                   await  this.setState({
                                client_form: {
                                ...this.state.client_form,
                                ["Trauma_Score"]: this.state.trauma_score, 
                                [question]: clearPreviousData ? [] : this.state.client_form[question]
                              },
                              visitedQuestion : {
                                ...this.state.visitedQuestion,
                                [question]:   score < 0 ? 0 : Number(score) 
                        }  
                            })
             }   
             return this.state.trauma_score;         
        } 

  handleChange = async (e) => {
    const { name, value } = e.target;
    console.log(value)
    let DynamicQuestions = this.state.DynamicQuestions;
    let val1: any = e.target.dataset.val1 ? e.target.dataset.val1 : "";
    const val2: any = e.target.dataset.val2 ? e.target.dataset.val2 : "";
    const type = e.target.dataset.type;
    const error_msg = e.target.dataset.msg;
    
    let jump = "";
    let ques_jump = "";
    if (type === "select") {
          let optionElement = e.target.childNodes[e.target.selectedIndex] 
          let idx = optionElement.getAttribute('data-idx');
          let id = optionElement.getAttribute('data-id');
          let idy = optionElement.getAttribute('data-idy');
          jump = optionElement.getAttribute('data-jump');
          ques_jump = optionElement.getAttribute('data-quesjump');
          let jumpto = jump&&jump.split(',').filter(j => j)
          let ques_jumpto = ques_jump&&ques_jump.split(',').filter(j => j)
          console.log(id,idx,idy,value)
          
          DynamicQuestions[idx].questions[idy].answer = id ? DynamicQuestions[idx].questions[idy].suggested_answers[value].value :""
          console.log(DynamicQuestions)
          
            console.log(jumpto,ques_jumpto,this.state.prevQuestionJump[name.replace(/ /g, "_")]) 
            id && DynamicQuestions[idx].questions.map((que, i) =>
                ques_jumpto.includes(que.question)
                  ? (DynamicQuestions[idx].questions[i].related = "no")
                  : (this.state.prevQuestionJump[name.replace(/ /g, "_")] &&
                    this.state.prevQuestionJump[name.replace(/ /g, "_")].includes(que.question) && (
                      DynamicQuestions[idx].questions[i].related = "yes"
                      
                    )))
              DynamicQuestions.map((sec, i) => jumpto && jumpto.includes(sec.section) ? (
                DynamicQuestions[i].related = "false"

              )
                :
                this.state.prevJump[name.replace(/ /g, "_")] &&
                this.state.prevJump[name.replace(/ /g, "_")].includes(sec.section) && (
                  DynamicQuestions[i].related = "true"
                )
              )
              this.setState({
                DynamicQuestions,
                  prevJump: {
                    ...this.state.prevJump,
                    [name.replace(/ /g, "_")]: jumpto,
                    hasError: false,
                  },
                  prevQuestionJump: {
                    ...this.state.prevQuestionJump, 
                    [name.replace(/ /g, "_")]: ques_jumpto,
                    hasError: false,
                  }
    
                }) 
              Persues_House_Score.length > 0 && await this.AddTraumaScore(name,id)
           await this.formState(name,value,jumpto,ques_jumpto)

    } else {
      if (type === "radio") {
        jump = e.target.dataset.jump.split(',').filter(j => j);
        ques_jump = e.target.dataset.quesjump.split(',').filter(j => j);
        const idx = e.target.dataset.idx;
        const id = e.target.dataset.id;
        const idy = e.target.dataset.idy;
        console.log(idx,id,idy,name)
        DynamicQuestions[idx].questions[idy].answer = DynamicQuestions[idx].questions[idy].suggested_answers[value].value
         console.log(DynamicQuestions)
        console.log(jump,ques_jump,this.state.prevQuestionJump[name.replace(/ /g, "_")],this.state.prevJump[name.replace(/ /g, "_")])
        DynamicQuestions[idx].questions.map((que, i) =>
          ques_jump.includes(que.question)
            ? (DynamicQuestions[idx].questions[i].related =  "no" )
            : (this.state.prevQuestionJump[name.replace(/ /g, "_")] &&
              this.state.prevQuestionJump[name.replace(/ /g, "_")].includes(que.question) && ( 
                DynamicQuestions[idx].questions[i].related = "yes"
              )))
        DynamicQuestions.map((sec, i) => jump.includes(sec.section) ? (
          DynamicQuestions[i].related = "false")
          :
          this.state.prevJump[name.replace(/ /g, "_")] &&
          this.state.prevJump[name.replace(/ /g, "_")].includes(sec.section) && (
            DynamicQuestions[i].related = "true"
            // this.formState()
          )
        )
        console.log(DynamicQuestions)
        this.setState(prevState => ({
          DynamicQuestions,
          prevJump: {...prevState.prevJump,
                      [name.replace(/ /g, "_")]: jump,
                      hasError: false,
          },
          prevQuestionJump: {...prevState.prevQuestionJump,
                        [name.replace(/ /g, "_")]: ques_jump,
                        hasError: false,
          }
        }));
        Persues_House_Score.length > 0 && await this.AddTraumaScore(name,id)
        await this.formState(name,value,jump,ques_jump)
      }

    }

    if (val1 === "") {
      if (type === "checkbox") {
        const idx = e.target.dataset.idx;
        const id = e.target.dataset.id;
        const idy = e.target.dataset.idy;  
        const idz = e.target.dataset.idz;      
        console.log(idx,id,idy,idz,name)
        const checked = e.target.checked;
        DynamicQuestions[idx].questions[idy].answer= DynamicQuestions[idx].questions[idy].answer ? 
                                                     DynamicQuestions[idx].questions[idy].answer : []
        DynamicQuestions[idx].questions[idy].answer[id]= checked ? idz : ""
        Persues_House_Score.length > 0 && this.AddTraumaScore(name, [id,checked]) 
        let checkedvalue = this.state.client_form[name] ?
        checked ? this.state.client_form[name].concat([value]) :
          this.state.client_form[name].filter(idy => idy !== value) : [value]
        this.setState({
          DynamicQuestions,
          client_form: {
            ...this.state.client_form,
            [name]: checkedvalue
          },
          hasError: false,
        })
      } else {
        if(type === "date"){
        const idx = e.target.dataset.idx;
        const id = e.target.dataset.id;
        const idy = e.target.dataset.idy;        
        console.log(name,type)
         DynamicQuestions[idx].questions[idy].answer = value
        }
       await this.setState({
        DynamicQuestions,
        client_form: {
            ...this.state.client_form,
            [name]: value
          },
          hasError: false,
        })
       
      }
    }
    else {
      if (type === "number") {
        const err = parseInt(value) < parseInt(val1)
        const err1 = parseInt(value) > parseInt(val2)
        const idx = e.target.dataset.idx;
        const id = e.target.dataset.id;
        const idy = e.target.dataset.idy;        
        console.log(idx,id,idy,name)
        DynamicQuestions[idx].questions[idy].answer = value
        if (this.state.isEdit === "true" && name === "Client_Code") {
          this.setState(prevState => ({
            DynamicQuestions,
            client_form: {
              ...prevState.client_form,
              [name]: value,
              ["Client_Code1"]: this.state.ClientCode
            }
          }))
        } else {
          this.setState({
            DynamicQuestions,
            client_form: {
              ...this.state.client_form,
              [name]: value,
            }
          })
        }

        this.setState({
          error: {
            ...this.state.error,
            [name]: err === true ? error_msg : err1 === true ? error_msg : "",
          },
          hasError: err === true ? true : err1 === true ? true : false
        })
      } else {
        const regex = val2 === "Both" ? "^[A-Za-z ]+$" :
          val2 === "Numbers" ? "^[ A-Za-z_@./#&+-]*$" :
            val2 === "Special characters" ? "^[A-Za-z0-9 ]+$" : ""
        const textRegex = new RegExp(regex);
        const idx = e.target.dataset.idx;
        const id = e.target.dataset.id;
        const idy = e.target.dataset.idy;        
        console.log(idx,id,idy,name)
        DynamicQuestions[idx].questions[idy].answer = value
        
        this.setState({
          DynamicQuestions,
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

  handleSubmit = async (e) => {
    e.preventDefault();
    const client_form = this.state.client_form;
    let Required_List = this.state.Required_List;
    this.setState({
      isSubmitted: true,
      err_msg: [],
      isOpen: false,
    })
    let data = [] as any;
    let isValid_Data = true as any;
    Object.keys(client_form).map((ele, i) =>
    (data.push({ [ele.replace(/_/g, ' ')]: client_form[ele] }),
      !client_form[ele] && Required_List[ele] === "yes" && (isValid_Data = false)
    ))
    let formData = Object.assign({}, ...data)
    if (Object.keys(formData).includes("Client Code1")) {
      formData["New Client Code"] = formData["Client Code"];
      formData["Client Code"] = formData["Client Code1"];
      delete formData["Client Code1"];
    }
    if (isValid_Data) {
      if (this.state.isEdit === "true" || !this.state.hasError) {
      
        this.setState({
          isSubmitted: false,
          err_msg: this.props.errors,
          isOpen: this.props.errors ? true : false, 
             // isSuccess: true
        })
        const response: any = await this.props.onFormSubmit(formData);
          if(response.status === "success") {
            await this.props.GetQuestions()
            await this.setState({
            DynamicQuestions: this.props.DynamicQuestions,
            isOpen: this.props.errors ? true : false,
            err_msg: this.props.errors,
            header_color: this.props.user && this.props.user.user.header_color
          })
             this.formState();
          }else {
            await this.setState({
              isOpen: this.props.errors ? true : false,
              err_msg: this.props.errors,
              header_color: this.props.user && this.props.user.user.header_color
            })
          }
          
        
      } 
      }
    
   
  }

  uploadCSV = async (e) => {
    e.preventDefault()
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
    await downloadcsvfile(is_accessToken)
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
    const { DynamicQuestions, header_color } = this.state;
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
                style={{
                  marginRight: 10,
                  backgroundColor: header_color,
                  color: "#fff"
                }}
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
                  onClick={this.uploadFile}
                  style={{
                    marginRight: 10,
                    backgroundColor: header_color,
                    color: "#fff"
                  }}>
                  Upload</Button>
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
              <h1 css={subHeading} style={{ color: header_color }}>Please correct the following errors and try again.</h1>
              {this.state.err_msg && this.state.err_msg.map((e, i) => <div style={{ color: "red" }}>{this.state.err_msg[i]}</div>)}

            </div>

          </Modal>
          <form name="newClientForm" onChange={this.handleChange} onSubmit={this.handleSubmit}>

            {DynamicQuestions.map((sections, index) =>
              sections.related === "true" ? "" :
                <React.Fragment>
                  <h1 css={subHeading} style={{ color: header_color }} key={index}>{sections.section}</h1>
                  <Table aria-label="users table" css={dataTable}>
                  { 
                    sections.questions.map((ques, ind) => {
                      return ( 
                      // <div css={fieldRow} key={ind}>
                      <TableRow key={ind} css={tableRow} >
                      {/* {item.map((ques, index_1) => */}
                       {( ques.related !== "yes" &&
                        (
                        <div css={twoCol} key={ind}> 
                          <label css={label1} >{ques.question}</label>
                          {ques.description &&
                            <label >
                              <small>({ques.description})</small>
                            </label>
                          } <br />
                          {ques.answer_type === "SELECT" ?
                            <select
                              css={selectField}
                              name={ques.question.replace(/ /g, "_")}
                              data-type={ques.answer_type.toLowerCase()}
                              data-length={ques.suggested_jump.length}
         
                            >
                              <option data-idx={index} 
                                  data-idy={ind} data-id = ""  value="">Select</option>
                              {ques.suggested_answers.map((ans, i) =>
                                  <option key={i}
                                  value={ans.id}
                                  data-idx={index} 
                                  data-idy={ind}
                                  data-id = {i} 
                                  data-jump={ques.suggested_jump.map(sj => sj !== null && ans.value === sj.answer ? sj.jumpto ? sj.jumpto : "" : "")}
                                  data-quesjump={ques.suggested_jump.length > 0 ? ques.suggested_jump.map(sj => sj !== null && ans.value === sj.answer ? sj.question_jumpto ? sj.question_jumpto : "" : "") : ""}
                                  selected={this.state.client_form[ques.question.replace(/ /g, "_")] && this.state.client_form[ques.question.replace(/ /g, "_")]?.toString() === ans.id?.toString()}>{ans.value}</option>
                              )}
                            </select>
                            :
                            ques.answer_type === "RADIO" ?
                              <React.Fragment>
                                {ques.suggested_answers.map((ans, i) =>
                                  <div key={i} 
                                    css={fieldBox}
                                    style={{ width: "47.8%", display: "inline-block" }}
                                  >
                                    <React.Fragment>
                                      <input
                                        type="radio"
                                        data-jump={ques.suggested_jump.length > 0 ? ques.suggested_jump.map(sj => sj !== null && ans.value === sj.answer ? sj.jumpto ? sj.jumpto : "" : "") : ""}
                                        data-quesjump={ques.suggested_jump.length > 0 ? ques.suggested_jump.map(sj => sj !== null && ans.value === sj.answer ? sj.question_jumpto ? sj.question_jumpto : "" : "") : ""}
                                        //data-jump = {ques.suggested_jump.length > 0 ?ques.suggested_jump.jumpto:""} 
                                        data-id={i}
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

                                ques.suggested_answers.map((ans, i) =>
                                  <div
                                    css={fieldBox}
                                    style={{ width: "47.8%", display: "inline-block" }}
                                  >
                                    <React.Fragment>
                                      <input
                                        type="checkbox"
                                        name={ques.question.replace(/ /g, "_")}
                                        value={ans.id}
                                        //required={ques.required === "yes" ? true : false} 
                                        data-id={i}
                                        data-type={ques.answer_type.toLowerCase()}
                                        data-idx={index}
                                        data-idy={ind}
                                        data-idz={ans.value}
                                        checked={this.state.client_form[ques.question.replace(/ /g, "_")] && this.state.client_form[ques.question.replace(/ /g, "_")].includes(ans.id.toString())
                                          || this.state.client_form[ques.question.replace(/ /g, "_")] && this.state.client_form[ques.question.replace(/ /g, "_")].includes(ans.value)}
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
                                      readOnly={ques.field_type === 0 || ques.question === "Trauma Score" || ques.question === "Client Code" && this.state.reReffer === "true"}
                                      name={ques.question.replace(/ /g, "_")}
                                      value={ques.question === "Age" ? (
                                        this.state.client_form[ques.question.replace(/ /g, "_")] = this.getAge(this.state.client_form["Date_of_Birth"], this.state.client_form["Date_of_Referral"])
                                      )
                                        : this.state.client_form[ques.question.replace(/ /g, "_")]}
                                      type={ques.answer_type.toLowerCase()}
                                      onBlur={this.keyUp}
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
                                      onBlur={this.keyUp}
                                    />

                                  </Fragment>
                          }

                          {
                            this.state.error[ques.question.replace(/ /g, "_")] &&
                            <div style={{ color: "red" }}>{this.state.error[ques.question.replace(/ /g, "_")]}</div>
                          }
                          {
                            this.state.isSubmitted ?
                              this.state.client_form[ques.question.replace(/ /g, "_")]?.toString() ? "" :
                                ques.required === "yes" ? <div style={{ color: "red" }}>Required</div> : ""
                              : ""
                          }
                        </div>
                        
                        ))}
                        
                        </TableRow>
                        
                   )})
                  }
                  
                         
                           
                          
                  </Table>
                </React.Fragment>
            )}
                <div css={fieldRow} style={{ justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                style={{
                  marginRight: 10,
                  backgroundColor: header_color,
                  color: "#fff"
                }}
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