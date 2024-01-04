
//import scss from './index.scss';
import { Label, Checkbox, TextField, PrimaryButton } from 'office-ui-fabric-react';
import { Card, Row, Col } from 'react-bootstrap';
//import Moment from 'react-moment';
import EMICalculator from './EMICalculator';
import * as React from 'react';
import { EMIInfoFormValues, IEMIInfoState, IEMIInfodProps } from './IEMIInfo';
import { ValidationService } from '../../../../Services/ValidationService';
import SPListService from '../../../../Services/SPListService';
import './index.scss';


class EMIInfo extends React.Component<IEMIInfodProps, IEMIInfoState> {
    emiCalculatorRef = React.createRef<EMICalculator>();
    validationSerive = new ValidationService();
    spListService = new SPListService(this.props.context.pageContext.web.absoluteUrl);
    constructor(props:IEMIInfodProps) {
        super(props);
        this.state = {
            formValues:new EMIInfoFormValues(),
            notFormValid:false
        };
      this.emiCalculatorRef = React.createRef<EMICalculator>();
    }

    componentDidMount() {
      this.setState({
        formValues:{...this.props.emiInfoData}
      })
    }

    private UpdateFeesPaid = (initialAmount: number) => {
        this.setState({
          formValues:{
            ...this.state.formValues,
            feesPaid: initialAmount
          }
        })
    }

    private UpdateEMIData = (data:any)=>{
        this.setState({
          formValues:{
            ...this.state.formValues,
            emiData:data
          }
        })
    }

    saveEMIInfoData = async () =>
    {
      if(this._isValid())
      {
        this.spListService = new SPListService(this.props.context.pageContext.web.absoluteUrl);
        let emiCalState = this.emiCalculatorRef.current?.state;
        let emiMetaData = {
          FeesPaid:this.state.formValues.feesPaid,
          NoOfEMIs:emiCalState?.noOfEMIs?emiCalState.noOfEMIs:0,
          RemainingFees:(this.props.courseInfoData.totalFees - this.state.formValues.feesPaid),
          TotalFees:this.props.courseInfoData.totalFees,
          IsPaidInEMI:this.state.formValues.isPayInEMI,
          FirstPaymentAmount:this.state.formValues.feesPaid,
          FixedEMIAmt:this.state.formValues.fixedEMIAmt,
        }
        await this.spListService.UpdateListItemByID(this.props.basicInfoData.spStudentId,emiMetaData,"StudentRegistrations");
        
        let spEmiItems = await this.spListService.GetListItems('EMIMaster','Id,StudentItemId/Id',`StudentItemId/Id eq ${this.props.basicInfoData.spStudentId}`,'StudentItemId/Id');
        

        let emiItems: any[] = [];
        this.state.formValues.emiData.forEach(emiRec=>{
          let emiItem = {
            StudentId:this.props.basicInfoData.StudentId,
            StudentItemIdId:this.props.basicInfoData.spStudentId,
            NextEMIDate:emiRec.nextEmiDate,
            EMIAmount:emiRec.emiAmount,
            RemainingEMIAmt:emiRec.remainingAmount,
            TotalEMIPaidAmt:emiRec.totalPaidAmount,
            IsEMIPaid:emiRec.isEMIPaid
          }
          emiItems.push(emiItem);
        })

        this.spListService.CreateListItems('EMIMaster',emiItems);

        this.setState({
          notFormValid:false,
          formValues:{
            ...this.state.formValues,
            noOfEMIs:emiCalState?.noOfEMIs?emiCalState.noOfEMIs:0,
            fixedEMIAmt:emiCalState?.fixedEMIAmt?emiCalState.fixedEMIAmt:0,
            initialAmount:emiCalState?.initialAmount?emiCalState.initialAmount:0,
            emiData:emiCalState?.emiData?emiCalState.emiData:[],
            isEMIInfoSaved:true
          }
        },()=>{
          this.props.updateEMIInfoCtx(this.state.formValues)
        })
        if(spEmiItems.length)
        {
          spEmiItems.forEach(async (emiItem:any) => {
              await this.spListService.DeleteListItemByID('EMIMaster',emiItem.Id);
            });
        }
      }
      else
      {
        this.setState({notFormValid:true})
      }
      
      
    }

    private _isValid = () =>
  {

        if(this.validationSerive.isNumberFieldEmpty(this.state.formValues.feesPaid) || 
          this.validationSerive.isNumberFieldEmpty(this.props.courseInfoData.totalFees) ||
          this.state.formValues.feesPaid>this.props.courseInfoData.totalFees ||
          (this.state.formValues.feesPaid<this.props.courseInfoData.totalFees && !this.state.formValues.isPayInEMI)
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
            <Card.Header>Expected Transactions & EMI Info</Card.Header>
            <Card.Body>
              <Row>
                {/* <Col xs={6} md={4}>
                  <Label>{`Date of admission :`}
                    <Moment format=' DD-MM-YYYY'>{new Date()}</Moment>
                  </Label>
                </Col> */}
                <Col xs={12} md={4} className='pt-2'>
                  <Checkbox
                    label='Do you want to pay in EMI?'
                    disabled={this.state.formValues.isEMIInfoSaved && this.props.isFirstPaymentDone}
                    checked={this.state.formValues.isPayInEMI}
                    boxSide="end"
                    onChange={(ev: any, checked: boolean) => {
                      this.setState({
                        formValues:{
                          ...this.state.formValues,
                          isPayInEMI: checked,
                          noOfEMIs: 0
                        }
                          
                      })
                    }}
                  ></Checkbox>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={4}>
                  <Label>Total fees</Label>
                  <TextField type="Number" disabled id="tFees" 
                    value={this.props.courseInfoData.totalFees?.toString()} 
                    errorMessage={this.state.notFormValid && this.validationSerive.isNumberFieldEmpty(this.props.courseInfoData.totalFees)?'Total fees is required.Select courses from step 2':''}
                  />
                </Col>
                <Col xs={12} md={4}>
                  <Label>Fees Paid</Label>
                  <TextField type="Number" id="fPaid" 
                    disabled={this.state.formValues.isEMIInfoSaved && this.props.isFirstPaymentDone}
                    value={this.state.formValues.feesPaid?.toString()} 
                    onChange={(ev:any)=>{this.setState({ formValues:{
                      ...this.state.formValues,feesPaid:ev.target.value}})}}
                    errorMessage={
                      this.state.notFormValid && 
                      this.validationSerive.isNumberFieldEmpty(this.state.formValues.feesPaid)?'Fees paid is required':
                      this.state.notFormValid && this.state.formValues.feesPaid>this.props.courseInfoData.totalFees?'Fees paid should not be greater than total fees':""}
                 />
                </Col>
                <Col xs={12} md={4}>
                  <Label>Remaining Fees</Label>
                  <TextField type="Number" id="remainFees" disabled
                    value={(this.props.courseInfoData.totalFees - this.state.formValues.feesPaid).toString()}
                    //onChange={(ev:any)=>{this.setState({:ev.target.value})}}
                  />
                </Col>

              </Row>
              <Row>
                {
                  this.state.notFormValid && this.state.formValues.feesPaid<this.props.courseInfoData.totalFees &&
                  !this.state.formValues.isPayInEMI?<label className='error-message'>Please pay the total fees or select the pay in EMI option</label>:""
                }
              </Row>
              {
                this.state.formValues.isPayInEMI &&
                <EMICalculator
                  courseDuration={this.props.courseInfoData.courseDuration}
                  totalCourseFees={this.props.courseInfoData.totalFees}
                  updateFeesPaid={this.UpdateFeesPaid}
                  UpdateEMIData={this.UpdateEMIData}
                  emiInfoState={this.state.formValues}
                  ref={this.emiCalculatorRef}
                >
                </EMICalculator>
              }
            </Card.Body>
            </Card>
            {
              (!this.state.formValues.isEMIInfoSaved || !this.props.isFirstPaymentDone) &&
                <Row>  
                  <Col className="mt-2 mb-3 text-center">
                      <PrimaryButton
                          iconProps={{ iconName: "Save" }}
                          text="Save"
                          onClick={this.saveEMIInfoData}
                      />
                  </Col>
                </Row>
            }
            
          </>
        );
    }
}

export default EMIInfo;
