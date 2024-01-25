//import scss from './index.scss';
import { Label, TextField, DatePicker, Dropdown, IDropdownOption, PrimaryButton, IDatePickerStrings } from 'office-ui-fabric-react';
import * as React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { BasicInfoFormValues, IBasicInfoState } from './IBasicInfo';
import { BasicInfoCtx } from '../ComponentContext/Contexts';
import { ValidationService } from '../../../../Services/ValidationService';
import { SaveRegistrationFormValue } from '../Save';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import './index.scss';
import * as moment from 'moment';

export interface IBasicInfoProps {
    genderOptions:any[];
    context:WebPartContext;
}



class BasicInfo extends React.Component<IBasicInfoProps, IBasicInfoState> {
    validationSerive = new ValidationService();
    context:React.ContextType<typeof BasicInfoCtx>;
    saveRegistrationObj:SaveRegistrationFormValue = new SaveRegistrationFormValue(this.props.context.pageContext.web.absoluteUrl);
    constructor(props:IBasicInfoProps) {
        super(props);
        this.state = {
            formValues: new BasicInfoFormValues(),
            notFormValid:false
        };
    }

    componentDidMount() {
        if(this.context.basicInfoData!=undefined)
        {
            this.setState({
                formValues:{...this.context.basicInfoData}
            })
        }
    }

    private textChangeHandler = (event: any) => {
        const Value = event.target.value;
        const id = event.target.id;
        let textFormValues = { ...this.state.formValues }
    
        switch (id) {
          case "stId":
            textFormValues.StudentId = Value;
            break;
          case "inputfName":
            textFormValues.FirstName = Value;
            break;
          case "inputlName":
            textFormValues.LastName = Value;
            break;
          case "inputAddress":
            textFormValues.Address = Value;
            break;
          case "inputPin":
            textFormValues.Pincode = Value;
            break;
          case "inputQuali":
            textFormValues.Qualification = Value;
            break;
          case "inputCllg":
            textFormValues.College = Value;
            break;
          case "inputContNum":
            textFormValues.Contact = Value;
            break;
          case "inputEmailId":
            textFormValues.EmailId = Value;
            break;
          case "inputTeleGrp":
            textFormValues.TelegramGroup = Value;
            break;
        }
        this.setState({ formValues: textFormValues });
      }

      private DateofBirthChange = (date: Date) => {
        let formValueDOB = { ...this.state.formValues }
        formValueDOB.DateOfBirth = date;
        this.setState({ formValues: formValueDOB })
      }

      private _dropdownChange = (event: React.FormEvent<HTMLDivElement>, option: IDropdownOption, index?: number) => {
        const value = option.text;
        var target = event.target as Element
        const id = target.id
        let dropDownFormValues = { ...this.state.formValues }
        switch (id) {
          case "ddlgenderSelect":
            dropDownFormValues.Gender = value.toString();
            break;
        }
        this.setState({ formValues: dropDownFormValues });
      }

      saveBasicInfoData = async () =>
      {
        if(this._isValid())
        {
            if(this.state.formValues.spStudentId==0)
            {
                let autoStuId = this.generateStudentId();
                let regResponse = await this.saveRegistrationObj.saveBasicInfo(this.state.formValues,autoStuId);
                this.setState({
                    formValues:{...this.state.formValues,spStudentId:regResponse.data.ID,StudentId:autoStuId},
                    notFormValid:false
                },()=>{
                    this.context.updateBasicInfoCtx(this.state.formValues);
                })
            }
            else
            {
                await this.saveRegistrationObj.updateBasicInfo(this.state.formValues);
                this.setState({notFormValid:false});
                this.context.updateBasicInfoCtx(this.state.formValues);
            }
            
        }
        else
        {
            this.setState({notFormValid:true})
        }
        
      }

     generateStudentId = () => {
        let uniNum = ((new Date().getTime()) / 10000000).toString().substring(8, 14);
        let stEmail = this.state.formValues.EmailId.split("@")[0];
        let studentId = stEmail + "_" + uniNum
        return studentId
     }

      private _isValid = () =>
      {
            if(this.validationSerive.isTextFieldEmpty(this.state.formValues.FirstName) ||
            this.validationSerive.isTextFieldEmpty(this.state.formValues.LastName) ||
            this.validationSerive.isRichTextFieldEmpty(this.state.formValues.Address) ||
            this.validationSerive.isTextFieldEmpty(this.state.formValues.Pincode) ||
            this.validationSerive.isSelectDropdownEmpty(this.state.formValues.Gender) ||
            this.validationSerive.isTextFieldEmpty(this.state.formValues.Contact) ||
            this.validationSerive.isPhoneNumberValid(this.state.formValues.Contact)||
            this.validationSerive.isTextFieldEmpty(this.state.formValues.EmailId) ||
            this.validationSerive.isEmailValid(this.state.formValues.EmailId)
            //this.validationSerive.isTextFieldEmpty(this.state.formValues.TelegramGroup)
            )
            {
                return false;
            }
            else
            {
                return true;
            }
      }


    render() {
        return (
            <>
                <Card className='mb-4'>
                    <Card.Header>General Info</Card.Header>
                    <Card.Body>
                        <Row>
                            {
                                this.state.formValues.spStudentId?
                                <Col xs={12} md={12}>
                                    <Label required>Student Id</Label>
                                    <Label className="clsStdId">{this.state.formValues.StudentId}</Label>
                                </Col>:""
                            }
                            {/* <Col xs={12} md={12}>
                                
                                <TextField id="stId" 
                                    value={this.state.formValues.StudentId} onChange={this.textChangeHandler}
                                    disabled />
                            </Col> */}
                            <Col xs={12} md={6}>
                                <Label required>First Name</Label>
                                {
                                    !this.state.formValues.spStudentId && 
                                    <TextField id="inputfName" 
                                        value={this.state.formValues.FirstName} 
                                        onChange={this.textChangeHandler} 
                                        errorMessage={this.state.notFormValid && this.validationSerive.isTextFieldEmpty(this.state.formValues.FirstName)?'First name is required':""}
                                    />
                                }
                                {this.state.formValues.spStudentId?this.state.formValues.FirstName:""}
                                
                            </Col>
                            <Col xs={12} md={6}>
                                <Label required>Last Name</Label>
                                {
                                    !this.state.formValues.spStudentId && 
                                    <TextField id="inputlName" value={this.state.formValues.LastName} onChange={this.textChangeHandler} 
                                    errorMessage={this.state.notFormValid && this.validationSerive.isTextFieldEmpty(this.state.formValues.LastName)?'Last name is required':""}
                                    />
                                }
                                {this.state.formValues.spStudentId?this.state.formValues.LastName:""}
                            </Col>
                            
                            <Col xs={12} md={6}>
                                <Label>Date of birth</Label>
                                {
                                    !this.state.formValues.spStudentId && 
                                    <DatePicker
                                        id="ddldob"
                                        placeholder='Select the Date (DD-MM-YYYY) Ex: 01-jan-2007'
                                        value={this.state.formValues.DateOfBirth}
                                        onSelectDate={this.DateofBirthChange}
                                        allowTextInput={true}
                                        formatDate={formatDate}
                                        strings={DayPickerStrings}
                                    >
                                    </DatePicker>
                                }
                                {this.state.formValues.spStudentId?moment(this.state.formValues.DateOfBirth).format("dd-mm-yyyy"):""}
                            </Col>
                            <Col xs={12} md={6}>
                                <Label required>Gender</Label>
                                {
                                    !this.state.formValues.spStudentId && 
                                    <Dropdown
                                        id='ddlgenderSelect'
                                        placeholder='Select Gender'
                                        options={this.props.genderOptions}
                                        selectedKey={this.state.formValues.Gender}
                                        onChange={this._dropdownChange}
                                        errorMessage={this.state.notFormValid && this.validationSerive.isTextFieldEmpty(this.state.formValues.Gender)?'Gender is required':""}
                                        >
                                    </Dropdown>
                                }
                                {this.state.formValues.spStudentId?this.state.formValues.Gender:""}
                            </Col>
                            <Col xs={12} md={6}>
                                <Label required>Contact Number</Label>
                                {
                                    !this.state.formValues.spStudentId && 
                                    <TextField type="Number" id="inputContNum" 
                                    value={this.state.formValues.Contact} onChange={this.textChangeHandler} 
                                    errorMessage={this.state.notFormValid && this.validationSerive.isTextFieldEmpty(this.state.formValues.Contact)?'Contact is required':
                                    this.state.notFormValid && this.validationSerive.isPhoneNumberValid(this.state.formValues.Contact)?"Please Enter Valid Contact Number":""}
                                    />
                                }
                                
                                {this.state.formValues.spStudentId?this.state.formValues.Contact:""}
                            </Col>
                            <Col xs={12} md={6}>
                                <Label required>Email Id</Label>
                                {
                                    !this.state.formValues.spStudentId && 
                                    <TextField type="text" id="inputEmailId" 
                                    value={this.state.formValues.EmailId} onChange={this.textChangeHandler} 
                                    errorMessage={this.state.notFormValid && this.validationSerive.isTextFieldEmpty(this.state.formValues.EmailId)?'Email Id is required': 
                                    this.state.notFormValid && this.validationSerive.isEmailValid(this.state.formValues.EmailId)? "Please Enter Valid Email Id":""}
                                    />
                                }
                                {this.state.formValues.spStudentId?this.state.formValues.Contact:""}
                            </Col>
                            <Col xs={12} md={6}>
                                <Label>Telegram Group</Label>
                                <TextField type="text" id="inputTeleGrp" 
                                value={this.state.formValues.TelegramGroup} onChange={this.textChangeHandler} 
                                //errorMessage={this.state.notFormValid && this.validationSerive.isTextFieldEmpty(this.state.formValues.TelegramGroup)?' is required':""}
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <Label required>Pincode</Label>
                                <TextField type="number" id="inputPin" 
                                onChange={this.textChangeHandler} value={this.state.formValues.Pincode}
                                errorMessage={this.state.notFormValid && this.validationSerive.isTextFieldEmpty(this.state.formValues.Pincode)?'Pincode is required':""}
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <Label required>Address</Label>
                                <TextField multiline rows={3} id="inputAddress" placeholder="Address" 
                                value={this.state.formValues.Address} onChange={this.textChangeHandler} 
                                errorMessage={this.state.notFormValid && this.validationSerive.isTextFieldEmpty(this.state.formValues.Address)?'Address is required':""}
                                />
                            </Col>
                           
                        </Row>
                    </Card.Body>
                </Card>
                <Card className='mb-4'>
                    <Card.Header>Qualification Info</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col xs={12} md={6}>
                                <Label>Qualification</Label>
                                <TextField id="inputQuali" value={this.state.formValues.Qualification} onChange={this.textChangeHandler} />
                            </Col>
                            <Col xs={12} md={6}>
                                <Label>College Name</Label>
                                <TextField id="inputCllg" value={this.state.formValues.College} onChange={this.textChangeHandler} />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Row>
                    <Col className="mt-2 mb-3 text-center">
                        <PrimaryButton
                            iconProps={{ iconName: "Save" }}
                            text="Save"
                            onClick={this.saveBasicInfoData}
                        />
                    </Col>
               </Row>
            </>
        );
    }
}

const formatDate = (date?: Date): string => {
    if (!date) return '';
    const month = date.getMonth() + 1; // + 1 because 0 indicates the first Month of the Year.
    const day = date.getDate();
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
}
const DayPickerStrings: IDatePickerStrings = {
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
  
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  
    shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  
    goToToday: 'Go to today',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year'
  };

BasicInfo.contextType = BasicInfoCtx
export default BasicInfo;
