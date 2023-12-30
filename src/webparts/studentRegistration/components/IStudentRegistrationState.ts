import { IDropdownOption } from "office-ui-fabric-react";
import { BasicInfoFormValues } from "./BasicInfo/IBasicInfo";
import { CourseInfoFormValues } from "./CourseInfo/ICourseInfo";
import { EMIInfoFormValues } from "./EMIInfo/IEMIInfo";
import { TransactionDataFormValues } from "./FeesTransactions/ITransactionsInfo";

export interface IStudentRegistrationFormValues{
    StudentId:string;
    FirstName:string;
    LastName:string;
    Address:string;
    Pincode:string;
    DateOfBirth:Date;
    Gender:string;
    Qualification:string;
    College:string;
    Courses:any[];
    Contact:string;
    EmailId:string;
    TelegramGroup:string;
    DateOfJoining:Date;
    FeesPaid:number;
    RemainingFees:number;
    TotalFees:number;
}

export class BasicInfoValues implements IStudentRegistrationFormValues{
    public StudentId:string = "";
    public FirstName: string = "";
    public LastName: string = "";
    public Address: string = "";
    public Pincode: string = "";
    public DateOfBirth: Date
    public Gender: string = "";
    public Qualification: string="";
    public College: string = "";
    public Courses: any[]=[] ;
    public Contact: string="";
    public DateOfJoining: Date;
    public EmailId:string="";
    public TelegramGroup: string="";
    public FeesPaid: number = 0;
    public RemainingFees: number = 0;
    public TotalFees: number = 0;
    public CourseCategories:any[]=[];
    public SelectedCourses:any[]=[];
    public CategoryCourses:any[]=[];
    public isPayInEMI:boolean=false;
    public noOfEmi:number=0;
    public courseDuration:number=0
    public emiTypeCal:string="Auto";
}

export interface IStudentRegistrationState{
    basicInfoData:BasicInfoFormValues;
    courseInfoData:CourseInfoFormValues;
    emiInfoData:EMIInfoFormValues;
    transactionInfoData:TransactionDataFormValues[];
    coursesOption:IDropdownOption[];
    genderOption:IDropdownOption[];
    courseCategoryOption:IDropdownOption[];
    registrationConfirmModal:boolean;
    modeOfPaymentsOptions:IDropdownOption[];
    spStudentId:number;
    isLoading:boolean
}