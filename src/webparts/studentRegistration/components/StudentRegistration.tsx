import * as React from 'react';
import { IStudentRegistrationProps } from './IStudentRegistrationProps';
import { IStudentRegistrationState } from './IStudentRegistrationState';
import { IListOperationService, ListOperationService } from '../../../Domain/Service';
import { ListFieldsCoursesMaster, ListFieldsStudentRegistration, ListNames } from '../../../Domain/Constant';
import { Container } from 'react-bootstrap';
//import SPListService from '../../../Services/SPListService';
//import SPListService from '../../../Services/SPListService';
import FeesTransactions from './FeesTransactions/index';
import StepWizard from './StepWizard/index';
import BasicInfo from './BasicInfo/index';
import CourseInfo from './CourseInfo/index';
import EMIInfo from './EMIInfo';
import { BasicInfoCtx, CourseInfoCtx } from './ComponentContext/Contexts';
import { BasicInfoFormValues } from './BasicInfo/IBasicInfo';
import { CourseInfoFormValues } from './CourseInfo/ICourseInfo';
import { EMIInfoFormValues } from './EMIInfo/IEMIInfo';
import SPListService from '../../../Services/SPListService';
import { TransactionDataFormValues } from './FeesTransactions/ITransactionsInfo';
import FinalValidation from './FinalValidation';
import * as moment from 'moment';
//import { ISaveRegistrationFormValue } from './Save';

export default class StudentRegistration extends React.Component<IStudentRegistrationProps, IStudentRegistrationState> {

  private _listService: IListOperationService;
  spListService = new SPListService(this.props.context.pageContext.web.absoluteUrl);
  paymentDetailRef = React.createRef<FeesTransactions>();
  
  constructor(props: IStudentRegistrationProps | Readonly<IStudentRegistrationProps>) {
    super(props)
      this.state = {
        basicInfoData:new BasicInfoFormValues(),
        courseInfoData: new CourseInfoFormValues(),
        emiInfoData: new EMIInfoFormValues(),
        transactionInfoData: [],
        coursesOption: [],
        genderOption: [],
        courseCategoryOption: [],
        registrationConfirmModal: false,
        modeOfPaymentsOptions: [],
        isLoading:true,
        spStudentId:0,
        batchOption:[],
        monthOption:[],

      }
    this._listService = new ListOperationService();
    this.paymentDetailRef = React.createRef<FeesTransactions>();
  }

  public componentDidMount = async () => {
    let spParamId = this.getURLParameter('stuid');

    let getCoursesDetails: any[] = await this._listService.GetAllItemsFromList(ListNames.CoursesMaster, "", ["ID", "Id", ListFieldsCoursesMaster.Batch, ListFieldsCoursesMaster.Category], []);
    console.log(getCoursesDetails);
    
    let getGenderFieldItems: any = await this._listService.GetListField(ListNames.StudentRegistrations, ListFieldsStudentRegistration.Gender);
    //console.log(getGenderFieldItems);
    let spCourseCatItems: any = await this._listService.GetListField(ListNames.CoursesMaster, ListFieldsCoursesMaster.Category);

    let spModeOfPayments: any = await this._listService.GetListField("StudentTransactions", "ModeOfPayment");

    //let spCoursebatchItems :any = await this.spListService.GetChoiceOptions(ListNames.CoursesMaster,ListFieldsCoursesMaster.Batch);

    let spCourseMonItems :any = await this.spListService.GetChoiceOptions(ListNames.CoursesMaster,ListFieldsCoursesMaster.Month);
     console.log(spCourseMonItems);
      
  
    if(spParamId!=null)
    {
      void this.getStudentData(spParamId)
    }

    this.setState({
      batchOption: getCoursesDetails.map(item => ({ key: item["Id"], text: item["Title"] })),
      genderOption: getGenderFieldItems.Choices.results.map((it: any) => ({ key: it, text: it })),
      courseCategoryOption: spCourseCatItems.Choices.results.map((it: any) => ({ key: it, text: it })),
      modeOfPaymentsOptions: spModeOfPayments.Choices.results.map((it: any) => ({ key: it, text: it })),
      spStudentId:spParamId!=null?parseInt(spParamId):0,
      isLoading:spParamId!=null?true:false,
     // batchOption: spCoursebatchItems.map((it: any) => ({ key: it, text: it })),
      monthOption: spCourseMonItems[0].Choices.results.map((it: any) => ({ key: it, text: it })),
    })
  }

  getStudentData = async (spParamId:string) =>
  {
      let spStuRegData = await this.spListService.GetListItems("StudentRegistrations","*,Courses/Title,BatchName/Title",`Id eq ${parseInt(spParamId)}`,"Courses,BatchName");
      if(spStuRegData.length)
      {
        let spBasicInfo = new BasicInfoFormValues();
        spStuRegData = spStuRegData[0];
        console.log(spStuRegData);
        spBasicInfo.Address = spStuRegData["Address"];
        spBasicInfo.College = spStuRegData["College"];
        spBasicInfo.Contact = spStuRegData["ContactNumber"];
        spBasicInfo.DateOfBirth = spStuRegData["DOB"]?new Date(spStuRegData["DOB"]):new Date();
        spBasicInfo.EmailId = spStuRegData["EmailId"];
        spBasicInfo.FirstName = spStuRegData["FirstName"];
        spBasicInfo.LastName = spStuRegData["LastName"];
        spBasicInfo.Gender = spStuRegData["Gender"];
        spBasicInfo.Pincode = spStuRegData["Pincode"];
        spBasicInfo.Qualification = spStuRegData["Qualification"];
        spBasicInfo.StudentId = spStuRegData["Title"];
        spBasicInfo.TelegramGroup = spStuRegData["TelegramGroup"];
        spBasicInfo.spStudentId = spStuRegData["ID"];
        spBasicInfo.feesStatus = spStuRegData["FeesStatus"];
      
        let spCourseInfo = new CourseInfoFormValues();
        spCourseInfo.courseDuration = spStuRegData["CourseDurationInMonths"];
        spCourseInfo.totalFees = spStuRegData["TotalFees"];
        spCourseInfo.courseDiscount = spStuRegData["Discount"];
        spCourseInfo.selectedMonth = {key:spStuRegData["BatchMonth"],text:spStuRegData["BatchMonth"]};
        spCourseInfo.selectedCourseCategories = {key:spStuRegData["CourseCategories"],text:spStuRegData["CourseCategories"]};
        spCourseInfo.selectedBatch = {key:spStuRegData["BatchNameId"],text:spStuRegData["BatchName"]["Title"]};

        let courseCat:any = [];
        let selectedCourseIds = "";

        spStuRegData["CoursesId"].results.forEach((cId:number,index:number) => {
          if (!index) {
            selectedCourseIds += `Id eq '${cId}'`;
          }
          else {
            selectedCourseIds += `or Id eq '${cId}'`;
          }
        });

        if(selectedCourseIds!='')
        {
          let spCategoryCourses = await this.spListService.GetListItems("CoursesMaster", "*", selectedCourseIds).catch(err => { console.log(err) });
          console.log(spCategoryCourses);
          
          spCategoryCourses.forEach((cItem:any) => {
            cItem["IsSelectedCourse"] = true
            spCourseInfo.spSelectedCourseItems.push(cItem);
            courseCat.push(...cItem["Category"]["results"])

          });
          
          courseCat = courseCat.filter(function(item:any, pos:any) {
            return courseCat.indexOf(item) == pos;
          })

          spCourseInfo.isCourseInfoSaved = spStuRegData["TotalFees"]>0?true:false;

        }
        
        

        let spEmiInfo =  new EMIInfoFormValues();
        spEmiInfo.feesPaid = spStuRegData["FeesPaid"];
        spEmiInfo.noOfEMIs = spStuRegData["NoOfEMIs"];
        spEmiInfo.isPayInEMI = spStuRegData["IsPaidInEMI"];
        spEmiInfo.initialAmount = spStuRegData["FirstPaymentAmount"];
        spEmiInfo.totalRemainingAmount = spStuRegData["RemainingFees"];
        spEmiInfo.isInitialAmountPaymentDone = spStuRegData["IsFirstPaymentDone"];
        spEmiInfo.initialAmountPaymentDate = spStuRegData["FirstPaymentDate"];

        let spEMIData = await this.spListService.GetListItems('EMIMaster',"*,StudentItemId/Id",`StudentItemId/Id eq ${spBasicInfo.spStudentId}`,"StudentItemId");

        spEMIData.forEach((spEmiItem:any,index:number) => {
            let emiItem = {
              srNo: index+1,
              nextEmiDate: moment(new Date(spEmiItem["NextEMIDate"])).format('DD-MM-yyyy'),
              emiAmount: spEmiItem["EMIAmount"],
              remainingAmount: spEmiItem["RemainingEMIAmt"],
              totalPaidAmount: spEmiItem["TotalEMIPaidAmt"],
              isEMIPaid: spEmiItem["IsEMIPaid"],
            }
            spEmiInfo.emiData.push(emiItem)
        });

        if(spEmiInfo.feesPaid>0)
        {
          spEmiInfo.isEMIInfoSaved = true;
        }


        let spTransactionData = await this.spListService.GetListItems("StudentTransactions","*,StudentItemId/Id",`StudentItemId/Id eq ${spBasicInfo.spStudentId}`,"StudentItemId");
        let stuTransactionData:TransactionDataFormValues[] = [];
        spTransactionData.forEach((std:any) => {
          let tdataObj = new TransactionDataFormValues();
          tdataObj.modeOfPayment = std.ModeOfPayment;
          tdataObj.paidAmount = std.PaidAmount;
          tdataObj.paymentReceiptNo = std.ReceiptID;
          tdataObj.transactionNo = std.TransactionNumber;
          tdataObj.paymentReceipt = null;
          tdataObj.paymentDate = moment(new Date(std.PaymentDate)).format('DD-MM-yyyy');
          tdataObj.spPaymentId = std.ID;

          let uploadedReceipts:any = [];
          let filesInfo = std.PaymentReceiptURLs?std.PaymentReceiptURLs.split(";"):[];
          if(filesInfo.length)
          {
            filesInfo.forEach((f:any) => {
              let fileInfo = f.split("#");
              uploadedReceipts.push({fileName:fileInfo[0],fileUrl:fileInfo[1]})
            });
          }

          tdataObj.uploadedPaymentDocuments = uploadedReceipts;
          stuTransactionData.push(tdataObj);
        });

        this.setState({
          basicInfoData:spBasicInfo,
          courseInfoData:spCourseInfo,
          emiInfoData:spEmiInfo,
          transactionInfoData:stuTransactionData,
          isLoading:false
        })
      }
      else
      {
        this.setState({
          isLoading:false
        })
      }
      
  }

  updateBasicInfoCtx = (data:any) =>
  {
      console.log(data);
      this.setState({
        basicInfoData:{...data},
        spStudentId:data.spStudentId
      })
  }

  updateCourseInfoCtx = (data:any) =>
  { 
    this.setState({
      courseInfoData:{...data}
    })
  }

  updateEMIInfoCtx = (data:any) =>
  {
    this.setState({
      emiInfoData:{...data}
    })
  }

  updateTransactionInfoCtx = (data:any) =>
  {
    this.setState({
      transactionInfoData:[...data]
    })
  }


    public render(): React.ReactElement<IStudentRegistrationProps> {
    return (
      <>
        <Container>
          {
            !this.state.isLoading?
            <StepWizard
            steps={[
              {
                key: 'firstStep',
                label: 'General Information',
                isDone: this.state.basicInfoData.spStudentId>0?true:false,
                component: () => (
                  <BasicInfoCtx.Provider value={{basicInfoData:this.state.basicInfoData,updateBasicInfoCtx:this.updateBasicInfoCtx}}>
                      <BasicInfo genderOptions={this.state.genderOption} context={this.props.context}/>
                  </BasicInfoCtx.Provider>
                  
                ),
              },
              {
                key: 'secondStep',
                label: 'Course Information',
                isDone: this.state.courseInfoData.isCourseInfoSaved,
                component: () => (
                  <CourseInfoCtx.Provider value={{courseInfoData:this.state.courseInfoData,updateCourseInfoCtx:this.updateCourseInfoCtx}}>
                    <CourseInfo
                      courseCategoryOption={this.state.courseCategoryOption}
                      context={this.props.context}
                      spStudentId={this.state.spStudentId}
                      StudentId={this.state.basicInfoData.StudentId}
                      isFirstPaymentDone={this.state.emiInfoData.isInitialAmountPaymentDone}
                      batchOption={this.state.batchOption}
                      monthOption={this.state.monthOption}
                    />
                  </CourseInfoCtx.Provider>
                ),
              },
              {
                key: 'thirdStep',
                label: 'EMI Information',
                isDone: this.state.emiInfoData.isEMIInfoSaved,
                component: () => (
                  <EMIInfo 
                    courseInfoData={this.state.courseInfoData}
                    updateEMIInfoCtx={this.updateEMIInfoCtx}
                    emiInfoData={this.state.emiInfoData} context={this.props.context} 
                    basicInfoData={this.state.basicInfoData}
                    isFirstPaymentDone={this.state.emiInfoData.isInitialAmountPaymentDone}                    
                  />
                ),
              },
              {
                key: 'fourthStep',
                label: 'Transaction Information',
                isDone: this.state.transactionInfoData.length>0?true:false,
                component: () => (
                  <FeesTransactions
                    courseInfo={this.state.courseInfoData}
                    emiInfoData={this.state.emiInfoData}
                    basicInfoData={this.state.basicInfoData}
                    transactionInfoData={this.state.transactionInfoData}
                    modeOfPaymentOptions={this.state.modeOfPaymentsOptions}
                    updateTransactionInfoCtx={this.updateTransactionInfoCtx}
                    updateBasicInfoCtx={this.updateBasicInfoCtx}
                    context={this.props.context}
                    updateEMIInfoCtx={this.updateEMIInfoCtx}
                  />
                ),
              },
              {
                key: 'fivthStep',
                label: 'Summary & Invoice',
                isDone: this.state.transactionInfoData.length>0?true:false,
                component:()=>(
                  <FinalValidation
                    courseInfo={this.state.courseInfoData}
                    emiInfoData={this.state.emiInfoData}
                    basicInfoData={this.state.basicInfoData}
                    transactionInfoData={this.state.transactionInfoData}
                    context={this.props.context}
                  ></FinalValidation>
                ),
              },
            ]}
          ></StepWizard>
          :"Loading..."
          }        
        </Container>
        
      </>
    )
  }

  confirmingRegistrationDetails = () => {
    this.setState({
      registrationConfirmModal: true
    })
  }

  hideRegistrationConfirmModal = () => {
    this.setState({
      registrationConfirmModal: false
    })
  }

  getURLParameter = (searchParam:string) =>
  {
    let url_string = window.location.href; 
    let url = new URL(url_string);
    let c = url.searchParams.get(searchParam);
    return c;
  }
  
}


