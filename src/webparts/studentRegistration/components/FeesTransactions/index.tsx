import * as React from "react";
import {
  TextField,
  DefaultButton,
  Dropdown,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  IconButton,
  Label,
} from 'office-ui-fabric-react';
import Moment from 'react-moment';
import { Card, Col, Row } from "react-bootstrap";
import './index.scss'
import SPListService from "../../../../Services/SPListService";
import { SaveRegistrationFormValue } from "../Save";
import { ListFieldsStudentTransactions } from "../../../../Domain/Constant";
import * as moment from "moment";
import { IFeesTransactionsProps, IFeesTransactionsState, ITransactionData } from "./ITransactionsInfo";
import { BasicInfoCtx } from "../ComponentContext/Contexts";

class FeesTransactions extends React.Component<IFeesTransactionsProps, IFeesTransactionsState> {
  spListService = new SPListService(this.props.context.pageContext.web.absoluteUrl);
  saveRegistrationObj:SaveRegistrationFormValue = new SaveRegistrationFormValue(this.props.context.pageContext.web.absoluteUrl);
  basicInfoCtx:React.ContextType<typeof BasicInfoCtx>;
  dueEMIs:any[] = [];
  constructor(props: IFeesTransactionsProps) {
    super(props);
    this.state = {
      transactionsData: [
        {
          paidAmount: props.emiInfoData.feesPaid,
          paymentDate: '',
          paymentReceiptNo: '',
          transactionNo: '',
          modeOfPayment: '',
          paymentReceipt: null,
          uploadedPaymentDocuments:[],
          spPaymentId:0
        },
      ],
      validationErrors: {},
      showSuccessMessage: false,
      notSavedValid:false,
      exceedInitialAmountError:false
    };
  }

  componentDidMount(): void {
    if(this.props.transactionInfoData.length>0)
    {
      this.setState({
        transactionsData:[...this.props.transactionInfoData]
      })
    }
    this.dueEMIs = this.props.emiInfoData.emiData.filter(emiItem=>!emiItem.isEMIPaid);  
  }

  componentDidUpdate(prevProps: Readonly<IFeesTransactionsProps>, prevState: Readonly<IFeesTransactionsState>, snapshot?: any): void {
      this.dueEMIs = this.props.emiInfoData.emiData.filter(emiItem=>!emiItem.isEMIPaid);  
  }


  handleAddRow = () => {
    const { transactionsData } = this.state;
    transactionsData.push({
      paidAmount: 0,
      paymentDate: '',
      paymentReceiptNo: '',
      transactionNo: '',
      modeOfPayment: '',
      paymentReceipt: null,
      uploadedPaymentDocuments:[],
      spPaymentId:0
    });
    this.setState({ transactionsData });
  };

  handleDeleteRow = (index: number) => {
    const { transactionsData } = this.state;
    if (transactionsData.length > 1) {
      transactionsData.splice(index, 1);
      this.setState({ transactionsData });
    }
  };

  handleAttachmentChange = (index: number, file: File | null) => {
    this.setState((prevState) => {
      const updatedTransactionsData = [...prevState.transactionsData];
      updatedTransactionsData[index].paymentReceipt = file;
      console.log(updatedTransactionsData);
      if(file!=null)
      {
        this.handleFileUpload(file,index);
      }
      return { transactionsData: updatedTransactionsData };
    });
  };

  handleFileUpload = async (fileInfo:File,index:number) =>
  {
      const libraryName = "StudentDocuments";
      const folderUrl = `${libraryName}/${this.props.basicInfoData.StudentId}`;
      await this.spListService.CreateFolderinLibrary(libraryName,this.props.basicInfoData.StudentId);
      const uploadedFile = await this.spListService.UploadFileToLibraryFolder(libraryName,folderUrl,fileInfo.name,fileInfo);
      console.log(uploadedFile);
      const listItem = await this.spListService.getFileListItemAllFields(uploadedFile.ServerRelativeUrl)
      console.log(listItem);
      let fileMetaData = {
        SPStudentRegIdId: this.props.basicInfoData.spStudentId, // Set the lookup column value
        StudentID:this.props.basicInfoData.StudentId
      }
      await this.spListService.UpdateListItemByID(listItem.ID,fileMetaData,libraryName);
      this.setState((prevState) => {
        const updatedTransactionsData:any = [...prevState.transactionsData];
        updatedTransactionsData[index]["uploadedPaymentDocuments"].push({fileName:fileInfo.name,fileUrl:uploadedFile.ServerRelativeUrl});
        return { transactionsData: updatedTransactionsData };
      });
      // await uploadedFile.({
      //   SPStudentRegId: this.props.basicInfoData.spStudentId, // Set the lookup column value
      //   StudentID:this.props.basicInfoData.StudentId
      // })
  }

  handleInputChange = (index: number, field: keyof ITransactionData, newValue: any) => {
    this.setState((prevState) => {
      const updatedTransactionsData:any = [...prevState.transactionsData];
      updatedTransactionsData[index][field] = newValue;
      return { transactionsData: updatedTransactionsData };
    });
  };



  handleSubmit = async () => {
    const { transactionsData } = this.state;
    const validationErrors: { [key: string]: string } = {};
  
    transactionsData.forEach((transaction, index) => {
      if(transaction.spPaymentId==0)
      { 
        if (!transaction.paidAmount) {
          validationErrors[`paidAmount${index}`] = 'Paid Amount is required.';
        }
        // if (!transaction.paymentDate) {
        //   validationErrors[`paymentDate${index}`] = 'Payment Date is required.';
        // }
        if (!transaction.paymentReceiptNo) {
          validationErrors[`paymentReceiptNo${index}`] = 'Payment Receipt No is required.';
        }
        if (!transaction.transactionNo) {
          validationErrors[`transactionNo${index}`] = 'Transaction No is required.';
        }
        if (!transaction.modeOfPayment) {
          validationErrors[`modeOfPayment${index}`] = 'Payment Mode is required.';
        }
        if (!transaction.paymentReceipt) {
          validationErrors[`paymentReceipt${index}`] = 'Payment Receipt is required.';
        }
        if(transaction.paymentReceiptNo)
        {
          const receiptNos = transactionsData.filter(t=>t.paymentReceiptNo==transaction.paymentReceiptNo);
          if(receiptNos.length>1)
          {
            validationErrors[`paymentReceiptNo${index}`] = 'Duplicate Payment Receipt No.';
          }
        }
        if(transaction.transactionNo)
        {
          const transactionNos = transactionsData.filter(t=>t.transactionNo==transaction.transactionNo);
          if(transactionNos.length>1)
          {
            validationErrors[`transactionNo${index}`] = 'Duplicate Transaction No.';
          }
        }
      }  
    });
  
    this.setState({ validationErrors });
  
    // Check if there are no validation errors
    if (Object.keys(validationErrors).length === 0) {

      let totalTransAmt = 0; 
      this.state.transactionsData.forEach(item=>{
        totalTransAmt += item.paidAmount;
      })
      if(totalTransAmt>this.props.emiInfoData.initialAmount && !this.props.emiInfoData.isInitialAmountPaymentDone)
      {
          this.setState({
            notSavedValid:true,
            exceedInitialAmountError:true
          })
      }
      else
      {
        const updatedTransactionsData = [...this.state.transactionsData];
        if(this.props.basicInfoData.spStudentId==0)
        {
          const response = await this.saveRegistrationObj.savePaymentInfo(this.state.transactionsData,this.props.basicInfoData.spStudentId,this.props.basicInfoData.StudentId)
          
          response.forEach((spItem:any) => {
            let tItem = updatedTransactionsData.filter(t=>t.paymentReceiptNo==spItem.ReceiptID);
            if(tItem.length)
            {
              tItem[0].spPaymentId = spItem.Id
            }
          });
          this.setState({transactionsData:updatedTransactionsData})
        }
        else
        {
          this.state.transactionsData.forEach(async tdata=>{
            const mappedData = this._MapSPTransactionData(tdata);
            if(tdata.spPaymentId==0)
            {
                const response = await this.spListService.CreateListItem("StudentTransactions",mappedData);
                let tItem = updatedTransactionsData.filter(t=>t.paymentReceiptNo==response.data.ReceiptID);
                if(tItem.length)
                {
                  tItem[0].spPaymentId = response.data.Id;
                }
                this.setState({transactionsData:updatedTransactionsData})

                totalTransAmt = 0;
                this.state.transactionsData.forEach(item=>{
                  totalTransAmt += parseInt(item.paidAmount.toString());
                })
                //Student paid first fees
                if(this.props.emiInfoData.isInitialAmountPaymentDone==null || !this.props.emiInfoData.isInitialAmountPaymentDone)
                {   
                  
                  let stuUpdateMetaData = {
                    FeesPaid:totalTransAmt,
                    RemainingFees:this.props.courseInfo.totalFees - totalTransAmt,
                    FirstPaymentAmount:totalTransAmt,
                    IsFirstPaymentDone:true,
                    FirstPaymentDate:moment(new Date()).format('MM/DD/YYYY'),
                    DateOfJoining:moment(new Date()).format('MM/DD/YYYY'),
                    FeesStatus:totalTransAmt>=this.props.courseInfo.totalFees?"Completed":"Pending"
                  }
                  await this.spListService.UpdateListItemByID(this.props.basicInfoData.spStudentId,stuUpdateMetaData,"StudentRegistrations");
                  let emiInfoData = this.props.emiInfoData;
                  emiInfoData.isInitialAmountPaymentDone = true;
                  this.props.updateEMIInfoCtx(emiInfoData);

                  this.basicInfoCtx.updateBasicInfoCtx({...this.props.basicInfoData,feesStatus:stuUpdateMetaData.FeesStatus})
                  this.props.updateEMIInfoCtx({...this.props.emiInfoData,feesPaid:stuUpdateMetaData.FeesPaid,totalRemainingAmount:stuUpdateMetaData.RemainingFees})
                }
                else
                {
                  let stuUpdateMetaData = {
                    RemainingFees:this.props.courseInfo.totalFees - totalTransAmt,
                    FeesPaid:totalTransAmt,
                    FeesStatus:totalTransAmt>=this.props.courseInfo.totalFees?"Completed":"Pending"
                  }
                  await this.spListService.UpdateListItemByID(this.props.basicInfoData.spStudentId,stuUpdateMetaData,"StudentRegistrations");
                  this.basicInfoCtx.updateBasicInfoCtx({...this.props.basicInfoData,feesStatus:stuUpdateMetaData.FeesStatus})
                  this.props.updateEMIInfoCtx({...this.props.emiInfoData,feesPaid:stuUpdateMetaData.FeesPaid,totalRemainingAmount:stuUpdateMetaData.RemainingFees})
                }
                this.setState({})
                console.log(response);
            }
            else
            {
              await this.spListService.UpdateListItemByID(tdata.spPaymentId,mappedData,"StudentTransactions");
            }
          })
        }
        this.props.updateTransactionInfoCtx(this.state.transactionsData)
        // Show success message
        //this.setState({ showSuccessMessage: true});
      }
    }
  };

  private _MapSPTransactionData = (item:ITransactionData) =>
  {
    let paymentReceiptUrls = "";
    item.uploadedPaymentDocuments.forEach((element:any) => {
        if(paymentReceiptUrls=="")
        {
            paymentReceiptUrls = element.fileName+"#"+element.fileUrl; 
        }
        else
        {
            paymentReceiptUrls += ";"+element.fileName+"#"+element.fileUrl;
        }
    });
    return {
        [ListFieldsStudentTransactions.StudentItemId + "Id"]: this.props.basicInfoData.spStudentId,
        [ListFieldsStudentTransactions.StudentId]: this.props.basicInfoData.StudentId,
        [ListFieldsStudentTransactions.PaidAmount]: item.paidAmount,
        [ListFieldsStudentTransactions.ReceiptID]: item.paymentReceiptNo,
        [ListFieldsStudentTransactions.TransactionNumber]: item.transactionNo,
        [ListFieldsStudentTransactions.ModeOfPayment]: item.modeOfPayment,
        [ListFieldsStudentTransactions.PaymentDate]: moment(new Date()).format('MM/DD/YYYY'),
        [ListFieldsStudentTransactions.PaymentReceiptURLs]:paymentReceiptUrls
    }
  }

  renderTable() {
    const { transactionsData, validationErrors, showSuccessMessage } = this.state;
    const { modeOfPaymentOptions } = this.props;
  
    return (
      <>
        <Row className="mt-3">
          <Col className="xs={12} md={3}">
              <Label>Total Fees:</Label>
              <span>₹{this.props.courseInfo.totalFees}</span>
          </Col>
          <Col className="xs={12} md={3}">
              <Label>Paid Fees:</Label>
              <span>₹{this.props.emiInfoData.feesPaid}</span>
          </Col>
          <Col className="xs={12} md={3}">
              <Label>Remaining Fees:</Label>
              <span>₹{this.props.emiInfoData.totalRemainingAmount}</span>
          </Col>
          <Col className="xs={12} md={3}">
              <Label>Fees Status:</Label>
              <span style={{backgroundColor:"green"}}>{this.props.basicInfoData.feesStatus}</span>
          </Col>
        </Row>
        <Card className='mb-4 mt-4'>
          <Card.Header>Add Payment Details</Card.Header>
          <Card.Body>
            {
              this.props.basicInfoData.feesStatus=="Pending" && 
              <DefaultButton
                iconProps={{ iconName: 'Add' }}
                text='Add Transaction'
                onClick={this.handleAddRow}
              />
            }
            
            <div>
              {showSuccessMessage && (
                <MessageBar messageBarType={MessageBarType.success}>
                  Form submitted successfully!
                </MessageBar>
              )}
              <table className="table table-striped table-bordered mt-4">
                <thead>
                  <tr>
                    <th>Paid Amount</th>
                    <th>Payment Date</th>
                    <th>Payment Receipt No</th>
                    <th>Transaction No</th>
                    <th>Payment Mode</th>
                    <th>Payment Receipt</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsData.map((transaction, index) => (
                    <tr key={index}>
                      <td>
                        <TextField
                          value={transaction.paidAmount.toString()}
                          onChange={(ev: any, newValue: string) =>
                            this.handleInputChange(index, 'paidAmount', newValue)
                          }
                          disabled={transaction.spPaymentId>0?true:false}
                          errorMessage={validationErrors[`paidAmount${index}`]}
                        />
                      </td>
                      <td>
                        <Moment format='DD-MM-YYYY'>{new Date()}</Moment>
                      </td>
                      <td>
                        <TextField
                          value={transaction.paymentReceiptNo.toString()}
                          onChange={(ev: any, newValue: string) =>
                            this.handleInputChange(index, 'paymentReceiptNo', newValue)
                          }
                          disabled={transaction.spPaymentId>0?true:false}
                          errorMessage={validationErrors[`paymentReceiptNo${index}`]}
                        />
                      </td>
                      <td>
                        <TextField
                          value={transaction.transactionNo.toString()}
                          onChange={(ev: any, newValue: string) =>
                            this.handleInputChange(index, 'transactionNo', newValue)
                          }
                          disabled={transaction.spPaymentId>0?true:false}
                          errorMessage={validationErrors[`transactionNo${index}`]}
                        />
                      </td>
                      <td>
                        <Dropdown
                          selectedKey={transaction.modeOfPayment}
                          options={modeOfPaymentOptions}
                          onChange={(ev, option) =>
                            this.handleInputChange(index, 'modeOfPayment', option!.key as string)
                          }
                          disabled={transaction.spPaymentId>0?true:false}
                          errorMessage={validationErrors[`modeOfPayment${index}`]}
                        />
                      </td>
                      <td>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.png"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            this.handleAttachmentChange(index, file);
                          }}
                          disabled={transaction.spPaymentId>0?true:false}
                        />
                        {validationErrors[`paymentReceipt${index}`] && (
                          <div className="error-message">{validationErrors[`paymentReceipt${index}`]}</div>
                        )}
                        {
                          transaction.uploadedPaymentDocuments.map(uploadedFiles=>{
                            return (
                              <div>
                                <span>{uploadedFiles.fileName}</span>
                                <IconButton iconProps={{ iconName: 'Cancel' }} title="Delete" ariaLabel="Delete" />
                              </div>
                            )
                          })
                        }
                      </td>
                      <td> 
                        {index > 0 && (
                          <IconButton
                            iconProps={{ iconName: 'Delete' }}
                            onClick={() => this.handleDeleteRow(index)}
                            disabled={transaction.spPaymentId>0?true:false}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </>

    );
  }

  render() {
    return (
      <>
        <Row>
          {
            !this.props.emiInfoData.isInitialAmountPaymentDone?<MessageBar styles={{root:{'selectors':{'.ms-MessageBar-icon':{fontSize:17},'.ms-MessageBar-innerText':{fontSize:15}}}}}>
            <b>Note:</b> The initial amount selected by the student or supposed to pay is ₹{this.props.emiInfoData.feesPaid}.
            Please add the number of transactions to pay this amount and fill the all required details with the receipt.  
            </MessageBar>:""
          }
          {
            this.props.emiInfoData.isInitialAmountPaymentDone && this.props.transactionInfoData.length?
            <MessageBar messageBarType={MessageBarType.success} styles={{root:{'selectors':{'.ms-MessageBar-icon':{fontSize:17},'.ms-MessageBar-innerText':{fontSize:15}}}}}>
            <b>Congratulations!</b>  You have paid the ₹{this.props.transactionInfoData[this.props.transactionInfoData.length-1].paidAmount} on {this.props.transactionInfoData[this.props.transactionInfoData.length-1].paymentDate}.
            You can download the payment receipt from Summary and Invoice section.
            </MessageBar>:""
          }
          {
            this.props.emiInfoData.isInitialAmountPaymentDone && this.props.emiInfoData.isPayInEMI && this.dueEMIs.length>0 && this.props.basicInfoData.feesStatus=="Pending"?<MessageBar className="mt-2" styles={{root:{'selectors':{'.ms-MessageBar-icon':{fontSize:17},'.ms-MessageBar-innerText':{fontSize:15}}}}}>
            <b>Note:</b> The next emi of ₹{this.dueEMIs[0].emiAmount.toFixed(2)} is due on {this.dueEMIs[0].nextEmiDate}
            </MessageBar>:""
          }
        </Row>
        <Row>

        </Row>
        {this.renderTable()}
        <Row>
            {
              this.state.notSavedValid && this.state.exceedInitialAmountError?
              <MessageBar messageBarType={MessageBarType.error}>{`The total amount of transactions is more than first payment amount (₹${this.props.emiInfoData.initialAmount}).
              Please check the paid amount for each transaction.Go to EMI information section and update the initial amount.`}</MessageBar>:""
            }
        </Row>
        <Row>
          {
              this.props.basicInfoData.feesStatus=="Pending" && 
              <Col className="mt-2 mb-3 text-center">
                <PrimaryButton
                  iconProps={{ iconName: 'Save' }}
                  text='Save'
                  onClick={this.handleSubmit}
                />
              </Col>
          }
          
        </Row>
       
      </>
    );
  }
}

FeesTransactions.contextType = BasicInfoCtx;

export default FeesTransactions;
