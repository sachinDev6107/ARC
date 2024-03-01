
import * as moment from "moment";
import { IlistFieldsEMIMaster, ListFieldsStudentRegistration, ListFieldsStudentTransactions, ListNames } from "../../../Domain/Constant";
import SPListService from "../../../Services/SPListService";
import { BasicInfoValues } from "./IStudentRegistrationState";
import { BasicInfoFormValues } from "./BasicInfo/IBasicInfo";
import { CourseInfoFormValues } from "./CourseInfo/ICourseInfo";
//import StudentRegistration from "./StudentRegistration";


export class SaveRegistrationFormValue {
    // private _listService: IListOperationService;
    // private _StudentRegistration: StudentRegistration;
    // emiCalculatorRef = React.createRef<EMICalculator>();
    private spListService: SPListService; 

    constructor(siteUrl:any)
    {
        this.spListService = new SPListService(siteUrl)
    }

    public async saveBasicInfo(formValues: BasicInfoFormValues, studentId: string) {
        //const DOJ = new Date().toLocaleDateString()
        const DOB = new Date(formValues.DateOfBirth?.toString());
        let items: any = {
            [ListFieldsStudentRegistration.StudentId]: studentId,
            [ListFieldsStudentRegistration.FirstName]: formValues.FirstName,
            [ListFieldsStudentRegistration.LastName]: formValues.LastName,
            [ListFieldsStudentRegistration.Address]: formValues.Address,
            [ListFieldsStudentRegistration.Pincode]: formValues.Pincode,
            [ListFieldsStudentRegistration.DateOfBirth]: DOB,
            [ListFieldsStudentRegistration.Gender]: formValues.Gender,
            [ListFieldsStudentRegistration.ContactNumber]: formValues.Contact,
            [ListFieldsStudentRegistration.EmailId]: formValues.EmailId,
            [ListFieldsStudentRegistration.TelegramGroup]: formValues.TelegramGroup,
            [ListFieldsStudentRegistration.Qualification]: formValues.Qualification,
            [ListFieldsStudentRegistration.College]: formValues.College,
        }
        const result = await this.spListService.CreateListItem(ListNames.StudentRegistrations, items);
        return result;
    }
    public async updateBasicInfo(formValues: BasicInfoFormValues) {
        //const DOJ = new Date().toLocaleDateString()
        const DOB = new Date(formValues.DateOfBirth.toString());
        let items: any = {
            [ListFieldsStudentRegistration.FirstName]: formValues.FirstName,
            [ListFieldsStudentRegistration.LastName]: formValues.LastName,
            [ListFieldsStudentRegistration.Address]: formValues.Address,
            [ListFieldsStudentRegistration.Pincode]: formValues.Pincode,
            [ListFieldsStudentRegistration.DateOfBirth]: DOB,
            [ListFieldsStudentRegistration.Gender]: formValues.Gender,
            [ListFieldsStudentRegistration.ContactNumber]: formValues.Contact,
            [ListFieldsStudentRegistration.EmailId]: formValues.EmailId,
            [ListFieldsStudentRegistration.TelegramGroup]: formValues.TelegramGroup,
            [ListFieldsStudentRegistration.Qualification]: formValues.Qualification,
            [ListFieldsStudentRegistration.College]: formValues.College,
        }
        const result = await this.spListService.UpdateListItemByID(formValues.spStudentId, items,ListNames.StudentRegistrations);
        return result;
    }

    public async saveCourseInfo(formValues: CourseInfoFormValues, itemId: number, courseDuration: string) {
        // let selectedCourse = formValues.spSelectedCourseItems.map((item:any) =>{if(item.IsSelectedCourse){return item.Id}})
        // selectedCourse = selectedCourse.filter(function( element:any ) {
        //     return element !== undefined;
        //  });
        let totFees = formValues.actualCourseFees;
        if(formValues.courseDiscount>0)
        {
            totFees = (formValues.actualCourseFees-(formValues.actualCourseFees*(formValues.courseDiscount/100)))
        }
        let items: any = {
            [ListFieldsStudentRegistration.Courses + "Id"]: {
                results: [formValues.selectedBatch.key]
            },
            [ListFieldsStudentRegistration.TotalFees]: Math.ceil(totFees),
            [ListFieldsStudentRegistration.CourseDuration]: courseDuration,
            "CourseDurationInMonths":formValues.courseDuration,
            "CourseCategories":formValues.selectedCourseCategories.text,
            "Discount":formValues.courseDiscount==null?0:formValues.courseDiscount,
            [ListFieldsStudentRegistration.BatchName + "Id"]:formValues.selectedBatch.key,
            [ListFieldsStudentRegistration.BatchMonth]:formValues.selectedMonth.text,
        }
        const saveCourseResult = await this.spListService.UpdateListItemByID(itemId, items, ListNames.StudentRegistrations);
        return saveCourseResult;
    }
    public async saveEmiInfo(formValues: BasicInfoValues, itemId: number, UniqueStdId: string, TotalFees: number, FeesPaid: number, isPayInEMI: boolean, emid: any[] | undefined, fixesEMIAmt: number | undefined, initailAmt: number | undefined, noOfEMIs: number | undefined, paidFees: number | undefined, totalCourseFee: number | undefined) {
        let emiFinalValues: any[] | undefined;
        if (isPayInEMI) {
            emiFinalValues = emid?.map(item => ({
                [IlistFieldsEMIMaster.StudentdItemId + "Id"]: itemId,
                [IlistFieldsEMIMaster.StudentId]: UniqueStdId,
                [IlistFieldsEMIMaster.NextEMIDate]: item.nextEmiDate,//
                [IlistFieldsEMIMaster.EMIAmount]: item.emiAmount, //
                [IlistFieldsEMIMaster.RemainingEMIAmt]: item.remainingAmount,//
                [IlistFieldsEMIMaster.TotalEMIPaidAmt]: item.totalPaidAmount,//
                [IlistFieldsEMIMaster.FixedEMIAmt]: fixesEMIAmt,
                [IlistFieldsEMIMaster.InitialAmtPay]: initailAmt,
                [IlistFieldsEMIMaster.NumberOfEMIs]: noOfEMIs,
                [IlistFieldsEMIMaster.IsEMI]: isPayInEMI,
                [IlistFieldsEMIMaster.feesPaid]: paidFees,
                [IlistFieldsEMIMaster.TotalFees]: totalCourseFee,
                [IlistFieldsEMIMaster.RemainingFees]: (TotalFees - FeesPaid).toString(),
            }));
            let saveEmiInfoResult = await this.spListService.CreateListItems(ListNames.EMIMaster, emiFinalValues!);
            return saveEmiInfoResult;
        } else {
            let item: any = {
                [IlistFieldsEMIMaster.StudentdItemId + "Id"]: itemId,
                [IlistFieldsEMIMaster.StudentId]: UniqueStdId,
                [IlistFieldsEMIMaster.TotalFees]: TotalFees,
                [IlistFieldsEMIMaster.feesPaid]: FeesPaid,
                [IlistFieldsEMIMaster.RemainingFees]: (TotalFees - FeesPaid).toString(),
                [IlistFieldsEMIMaster.NumberOfEMIs]: 0,
                
            }
            let saveEmiInfoResult = await this.spListService.CreateListItem(ListNames.EMIMaster, item!);
            return saveEmiInfoResult;
        }
    }
    public async savePaymentInfo(paymentDetails: any[] | undefined, itemId: number, UniqueStdId: string) {
        let paymentDetailsValues: any[] | undefined;
        paymentDetailsValues = paymentDetails?.map((item)=>{
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
                [ListFieldsStudentTransactions.StudentItemId + "Id"]: itemId,
                [ListFieldsStudentTransactions.StudentId]: UniqueStdId,
                [ListFieldsStudentTransactions.PaidAmount]: item.paidAmount,
                [ListFieldsStudentTransactions.ReceiptID]: item.paymentReceiptNo,
                [ListFieldsStudentTransactions.TransactionNumber]: item.transactionNo,
                [ListFieldsStudentTransactions.ModeOfPayment]: item.modeOfPayment,
                [ListFieldsStudentTransactions.PaymentDate]: moment(new Date()).format('MM/DD/YYYY'),
                [ListFieldsStudentTransactions.PaymentReceiptURLs]:paymentReceiptUrls
            }
        })
        let savePaymentInfoResult = await this.spListService.CreateListItems(ListNames.StudentTransactions, paymentDetailsValues!);
        return savePaymentInfoResult;
    }
}