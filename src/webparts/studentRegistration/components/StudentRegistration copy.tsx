// import * as React from 'react';
// import { IStudentRegistrationProps } from './IStudentRegistrationProps';
// import { FontIcon, FontWeights, IButtonStyles, IIconProps, IconButton, Label, Modal, PrimaryButton, Separator, getTheme, mergeStyleSets, mergeStyles } from 'office-ui-fabric-react';
// import { IStudentRegistrationState, StudentRegistrationValues } from './IStudentRegistrationState';
// import { IListOperationService, ListOperationService } from '../../../Domain/Service';
// import { ListFieldsCoursesMaster, ListFieldsStudentRegistration, ListNames } from '../../../Domain/Constant';
// import { Col, Container, Row } from 'react-bootstrap';
// //import SPListService from '../../../Services/SPListService';
// //import SPListService from '../../../Services/SPListService';
// import Moment from 'react-moment';
// import styles from './StudentRegistration.module.scss';
// import FeesTransactions from './FeesTransactions/index';
// import StepWizard from './StepWizard/index';
// import BasicInfo from './BasicInfo/index';
// import CourseInfo from './CourseInfo/index';
// import EMIInfo from './EMIInfo';
// //import { ISaveRegistrationFormValue } from './Save';




// export default class StudentRegistration extends React.Component<IStudentRegistrationProps, IStudentRegistrationState> {

//   private _listService: IListOperationService;
//   //private _saveDataService: ISaveRegistrationFormValue;
//   //private spListService: SPListService = new SPListService(this.props.context.pageContext.web.absoluteUrl);
//   //emiCalculatorRef = React.createRef<EMICalculator>();
//   paymentDetailRef = React.createRef<FeesTransactions>();
//   //private _spListService :SPListService;

  
//   constructor(props: IStudentRegistrationProps | Readonly<IStudentRegistrationProps>) {
//     super(props)
//       this.state = {
//         formValues: new StudentRegistrationValues(),
//         coursesOption: [],
//         genderOption: [],
//         courseCategoryOption: [],
//         registrationConfirmModal: false,
//         modeOfPaymentsOptions: [],
//         firstInfo: false,
//         generalInfo: false,
//         courseInfo: true,
//         emiInfo: false,
//         paymentDetailsInfo: false,
//         itemID: 0,
//         UniqueStdId: "",
//         isLoading:true
//       }
//     this._listService = new ListOperationService();
//     //this._saveDataService = new ISaveRegistrationFormValue();
//     //this.emiCalculatorRef = React.createRef<EMICalculator>(),
//     this.paymentDetailRef = React.createRef<FeesTransactions>();
//   }

//   public componentDidMount = async () => {
//     let getCoursesDetails: any[] = await this._listService.GetAllItemsFromList(ListNames.CoursesMaster, "", ["ID", "Id", ListFieldsCoursesMaster.Courses, ListFieldsCoursesMaster.Category], []);

//     let getGenderFieldItems: any = await this._listService.GetListField(ListNames.StudentRegistrations, ListFieldsStudentRegistration.Gender);
//     //console.log(getGenderFieldItems);
//     let spCourseCatItems: any = await this._listService.GetListField(ListNames.CoursesMaster, ListFieldsCoursesMaster.Category);

//     let spModeOfPayments: any = await this._listService.GetListField("StudentTransactions", "ModeOfPayment");

//     this.setState({
//       coursesOption: getCoursesDetails.map(item => ({ key: item["Id"], text: item["Title"] })),
//       genderOption: getGenderFieldItems.Choices.map((it: any) => ({ key: it, text: it })),
//       courseCategoryOption: spCourseCatItems.Choices.map((it: any) => ({ key: it, text: it })),
//       modeOfPaymentsOptions: spModeOfPayments.Choices.map((it: any) => ({ key: it, text: it })),
//       isLoading:false
//     })
//   }
 
//   // private _dropdownCourseChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
//   //   var coursesDropdown = { ...this.state.formValues }
//   //   if (option?.selected) {
//   //     coursesDropdown.Courses = this.state.formValues.Courses;
//   //     coursesDropdown.Courses.push(option.key)
//   //     this.setState({ formValues: coursesDropdown })
//   //   } else {
//   //     coursesDropdown.Courses = this.state.formValues.Courses;
//   //     let i = coursesDropdown.Courses.indexOf(option?.key);
//   //     if (i > 0) {
//   //       coursesDropdown.Courses.splice(i, 1);
//   //     }
//   //     this.setState({ formValues: coursesDropdown })
//   //   }
//   // }
  

//   // private DateofJoinChange = (date: Date) => {
//   //   let formValuedateofJoining = { ...this.state.formValues }
//   //   formValuedateofJoining.DateOfJoining = date;
//   //   this.setState({ formValues: formValuedateofJoining })
//   // }
  



//   public generateUniqueNumber() {
//     let uniNum = ((new Date().getTime()) / 10000000).toString().substring(8, 14);
//     let stEmail = this.state.formValues.EmailId.split("@")[0];
//     let studentId = stEmail + "_" + uniNum
//     return studentId
//   }

//   // public nextToOtherDetails = async (e: any) => {
//   //   e.preventDefault()

//   //   if (this.state.firstInfo) {
//   //     let studentId = this.generateUniqueNumber();
//   //     const result = await this._saveDataService.saveGeneralInfo(this.state.formValues, studentId)
//   //     this.setState({ generalInfo: true, firstInfo: false, itemID: result.data.Id, UniqueStdId: result.data.Title });

//   //   } else if (this.state.generalInfo) {
//   //     let courseDuration = `${this.daysToMonthsAndDays(this.state.formValues.courseDuration)}`
//   //     await this._saveDataService.saveCourseInfo(this.state.formValues, this.state.itemID, courseDuration);
//   //     this.setState({  generalInfo: false,courseInfo: true});

//   //   } else if (this.state.courseInfo) {

//   //     let emid: any[] | undefined = this.emiCalculatorRef.current?.state.emiData;
//   //     let fixesEMIAmt = this.emiCalculatorRef.current?.state.fixedEMIAmt;
//   //     let initailAmt = this.emiCalculatorRef.current?.state.initialAmount;
//   //     let noOfEMIs = this.emiCalculatorRef.current?.state.noOfEMIs
//   //     //let courseDuration =this.emiCalculatorRef.current?.props.courseDuration;
//   //     //let courseInfo = this.emiCalculatorRef.current?.props.courseInfo;
//   //     let paidFees = this.emiCalculatorRef.current?.props.paidFees;
//   //     let totalCourseFee = this.emiCalculatorRef.current?.props.totalCourseFees;
//   //     await this._saveDataService.saveEmiInfo(this.state.formValues, this.state.itemID, this.state.UniqueStdId, this.state.formValues.TotalFees, this.state.formValues.FeesPaid, this.state.formValues.isPayInEMI, emid, fixesEMIAmt, initailAmt, noOfEMIs, paidFees, totalCourseFee);
//   //     this.setState({courseInfo: false, emiInfo: true, });

//   //   } else if (this.state.emiInfo) {
//   //     let paymentDetails = this.paymentDetailRef.current?.state.transactionsData;
//   //     await this._saveDataService.savePaymentInfo(paymentDetails,this.state.itemID, this.state.UniqueStdId)
      
//   //   }
//   // }

//   public render(): React.ReactElement<IStudentRegistrationProps> {
//     return (
//       <>
//         <Container>
//           {
//             !this.state.isLoading?<StepWizard
//             steps={[
//               {
//                 key: 'firstStep',
//                 label: 'My First Step',
//                 isDone: false,
//                 component: () => (
//                   <BasicInfo genderOptions={this.state.genderOption} />
//                 ),
//               },
//               {
//                 key: 'secondStep',
//                 label: 'My Second Step',
//                 isDone: false,
//                 component: () => (
//                   <CourseInfo
//                     courseCategoryOption={this.state.courseCategoryOption}
//                     context={this.props.context}
//                   />
//                 ),
//               },
//               {
//                 key: 'thirdStep',
//                 label: 'My Third Step',
//                 isDone: false,
//                 component: () => (
//                   <EMIInfo />
//                 ),
//               },
//               {
//                 key: 'fourthStep',
//                 label: 'My Fourth Step',
//                 isDone: false,
//                 component: () => (
//                   <FeesTransactions
//                     initialPaidAmount={this.state.formValues.FeesPaid}
//                     modeOfPaymentOptions={this.state.modeOfPaymentsOptions}
//                     ref={this.paymentDetailRef}
//                   />
//                 ),
//               },
//             ]}
//           ></StepWizard>
//           :"Loading..."
//           }
          
          
//           {/* {
//             this.state.generalInfo ?
//               <Row>
//                 <Col className="mt-2 mb-3 text-end">
//                   <PrimaryButton
//                     iconProps={{ iconName: "Next" }}
//                     text="Next"
//                     onClick={this.nextToOtherDetails}
//                   />
//                 </Col>
//               </Row> : null
//           } */}


          
//           {/* {
//             this.state.courseInfo ?
//               <Row>
//                 <Col className="mt-2 mb-3 text-end">
//                   <PrimaryButton
//                     iconProps={{ iconName: "Next" }}
//                     text="Next"
//                     onClick={this.nextToOtherDetails}
//                   />
//                 </Col>
//               </Row> : null
//           } */}




          

//           <Row>
//             <Col className="mt-3 text-center">
//               <PrimaryButton
//                 iconProps={{ iconName: "Save" }}
//                 text="Submit Details"
//                 onClick={this.confirmingRegistrationDetails}
//                 allowDisabledFocus
//               />
//             </Col>
//             {/*
//               this.state.emiInfo ?
//                 <Col className="mt-2 text-end">
//                   <PrimaryButton
//                     iconProps={{ iconName: "Next" }}
//                     text="Next"
//                     onClick={this.nextToOtherDetails}
//                   />
//                 </Col> : null*/
//             }
//           </Row>
//         </Container>
//         <Modal
//           isOpen={this.state.registrationConfirmModal}
//           onDismiss={this.hideRegistrationConfirmModal}
//           isBlocking={false}
//           containerClassName={contentStyles.container}
//           styles={{ root: { selectors: { '.ms-Dialog-main': { width: '80%' } } } }}
//         >
//           <div className={contentStyles.header}>
//             <h2 className={contentStyles.heading}>
//               Details Verification
//             </h2>
//             <IconButton
//               styles={iconButtonStyles}
//               iconProps={cancelIcon}
//               ariaLabel="Close popup modal"
//               onClick={this.hideRegistrationConfirmModal}
//             />
//           </div>
//           <div className={contentStyles.body}>
//             <Separator>Student Info</Separator>
//             <Row>
//               <Col xs={6} md={4}>
//                 <Label>Date of admission</Label>
//                 <span><Moment format=' DD-MM-YYYY'>{new Date()}</Moment></span>
//               </Col>
//               <Col xs={6} md={4}>
//                 <Label>Full Name</Label>
//                 <span>{this.state.formValues.FirstName} {this.state.formValues.LastName}</span>
//               </Col>
//               <Col xs={6} md={4}>
//                 <Label>Contact</Label>
//                 <span>{this.state.formValues.Contact}</span>
//               </Col>
//             </Row>
//             <Separator>Course Info</Separator>
//             <Row>
//               <Col xs={6} md={4}>
//                 <Label>Course Types</Label>
//                 <span>{this.state.formValues.CourseCategories.join(',')}</span>
//               </Col>
//               <Col xs={6} md={4}>
//                 <Label>Total Number Skills</Label>
//                 <span>{this.state.formValues.CategoryCourses.filter(crItem => crItem.IsSelectedCourse).length}</span>
//               </Col>
//               <Col xs={6} md={4}>
//                 <Label>Approx. Duration Of Course</Label>
//                 {/* <span>{this.daysToMonthsAndDays(this.state.formValues.courseDuration)}</span> */}
//               </Col>
//             </Row>
//             <Row>
//               <Label>Skills Covered</Label>
//               {
//                 this.state.formValues.CategoryCourses.map((crItem: any) => {
//                   return (
//                     crItem.IsSelectedCourse &&
//                     <Col xs={4} md={4} className='mb-3'>
//                       <FontIcon aria-label="Completed12" iconName="Completed12" className={iconClassNames.deepSkyBlue} />
//                       <span className={styles.skillsCoveredText}>{crItem.Title}</span>
//                     </Col>
//                   )
//                 })
//               }
//             </Row>
//             <Separator>Fees Info</Separator>
//             <Row>
//               <Col xs={12} md={4}>
//                 <Label>Total fees</Label>
//                 <span>₹{this.state.formValues.TotalFees.toString()}</span>
//               </Col>
//               <Col xs={12} md={4}>
//                 <Label>Fees Paid</Label>
//                 <span>₹{this.state.formValues.FeesPaid.toString()}</span>
//               </Col>
//               <Col xs={12} md={4}>
//                 <Label>Remaining Fees</Label>
//                 <span>₹{(this.state.formValues.TotalFees - this.state.formValues.FeesPaid).toString()}</span>
//               </Col>
//             </Row>
//             <Separator>EMI Info</Separator>
//           </div>
//         </Modal>
//       </>
//     )
//   }

//   confirmingRegistrationDetails = () => {
//     this.setState({
//       registrationConfirmModal: true
//     })
//   }

//   hideRegistrationConfirmModal = () => {
//     this.setState({
//       registrationConfirmModal: false
//     })
//   }

  
// }


// const cancelIcon: IIconProps = { iconName: 'Cancel' };

// const theme = getTheme();
// const contentStyles = mergeStyleSets({
//   container: {
//     display: 'flex',
//     flexFlow: 'column nowrap',
//     alignItems: 'stretch',
//   },
//   header: [
//     // eslint-disable-next-line deprecation/deprecation
//     theme.fonts.xLargePlus,
//     {
//       flex: '1 1 auto',
//       borderTop: `4px solid ${theme.palette.themePrimary}`,
//       color: theme.palette.neutralPrimary,
//       display: 'flex',
//       alignItems: 'center',
//       fontWeight: FontWeights.semibold,
//       padding: '12px 12px 14px 24px',
//     },
//   ],
//   heading: {
//     color: theme.palette.neutralPrimary,
//     fontWeight: FontWeights.semibold,
//     fontSize: 'inherit',
//     margin: '0',
//   },
//   body: {
//     flex: '4 4 auto',
//     padding: '0 24px 24px 24px',
//     overflowY: 'hidden',
//     selectors: {
//       p: { margin: '14px 0' },
//       'p:first-child': { marginTop: 0 },
//       'p:last-child': { marginBottom: 0 },
//     },
//   },
// });
// const iconButtonStyles: Partial<IButtonStyles> = {
//   root: {
//     color: theme.palette.neutralPrimary,
//     marginLeft: 'auto',
//     marginTop: '4px',
//     marginRight: '2px',
//   },
//   rootHovered: {
//     color: theme.palette.neutralDark,
//   },
// };

// const iconClass = mergeStyles({
//   fontSize: 22,
//   //height: 50,
//   //width: 50,
//   margin: '0 22px',
// });
// const iconClassNames = mergeStyleSets({
//   deepSkyBlue: [{ color: 'deepskyblue' }, iconClass]
// });