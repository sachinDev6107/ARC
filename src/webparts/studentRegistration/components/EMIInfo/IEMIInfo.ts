import { WebPartContext } from "@microsoft/sp-webpart-base";
import { CourseInfoFormValues } from "../CourseInfo/ICourseInfo";
import { BasicInfoFormValues } from "../BasicInfo/IBasicInfo";

export interface IEMIInfodProps {
    courseInfoData:CourseInfoFormValues;
    updateEMIInfoCtx:any;
    emiInfoData:EMIInfoFormValues;
    basicInfoData:BasicInfoFormValues;
    context:WebPartContext;
    isFirstPaymentDone:boolean;
}

export interface IEMIInfoState {
    formValues:EMIInfoFormValues;
    notFormValid:boolean;
}


export interface IEMICalculatorProps {
    courseDuration: number;
    totalCourseFees: number;
    emiInfoState:EMIInfoFormValues;
    updateFeesPaid:any;
    UpdateEMIData:any;
}
  
export interface IEMICalculatorState {
    initialAmount: number;
    noOfEMIs: number;
    fixedEMIAmt: number;
    emiData: {
      srNo: number;
      nextEmiDate: string;
      emiAmount: number;
      remainingAmount: number;
      totalPaidAmount: number;
      isEMIPaid:boolean;
    }[];
    notFormValid?:boolean;
    isEMIInfoSaved:boolean;
    isInitialAmountPaymentDone?:boolean;
    initialAmountPaymentDate?:Date;
}

export class EMIInfoFormValues implements IEMICalculatorState
{
    spStudentId:number=0;
    initialAmountPaymentDate: Date;
    isInitialAmountPaymentDone: boolean=false;
    notFormValid?: boolean | undefined;
    isEMIInfoSaved: boolean=false;
    noOfEMIs: number=0;
    fixedEMIAmt: number=0;
    emiData: { srNo: number; nextEmiDate: string; emiAmount: number; remainingAmount: number; totalPaidAmount: number; isEMIPaid:boolean }[]=[];
    isPayInEMI:boolean=false;
    feesPaid:number=0;
    initialAmount:number=0;
    totalRemainingAmount:number=0;
}