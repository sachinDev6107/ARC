import { WebPartContext } from "@microsoft/sp-webpart-base";
import { BasicInfoFormValues } from "../BasicInfo/IBasicInfo";
import { CourseInfoFormValues } from "../CourseInfo/ICourseInfo";
import { EMIInfoFormValues } from "../EMIInfo/IEMIInfo";

export interface IFeesTransactionsProps {
    modeOfPaymentOptions: any;
    courseInfo:CourseInfoFormValues;
    emiInfoData:EMIInfoFormValues;
    basicInfoData:BasicInfoFormValues;
    transactionInfoData:TransactionDataFormValues[];
    context:WebPartContext;
    updateTransactionInfoCtx:any;
    updateEMIInfoCtx:any;
  }

  export interface ITransactionData {
    paidAmount: number;
    paymentDate: string;
    paymentReceiptNo: string;
    transactionNo: string;
    modeOfPayment: string;
    paymentReceipt: any;
    uploadedPaymentDocuments:any[];
    spPaymentId:number;
    
  }

  export class TransactionDataFormValues implements ITransactionData
  {
      paidAmount: number=0;
      paymentDate: string;
      paymentReceiptNo: string;
      transactionNo: string;
      modeOfPayment: string;
      paymentReceipt: any;
      uploadedPaymentDocuments: any[];
      spPaymentId: number=0;

  }
  
  export interface ITransactionData {
    paidAmount: number;
    paymentDate: string;
    paymentReceiptNo: string;
    transactionNo: string;
    modeOfPayment: string;
    paymentReceipt: any;
    uploadedPaymentDocuments:any[];
    spPaymentId:number;
  }
  
  export interface IFeesTransactionsState {
    transactionsData: ITransactionData[];
    validationErrors: { [key: string]: string };
    showSuccessMessage: boolean;
    notSavedValid:boolean;
    exceedInitialAmountError:boolean;
  }