import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IDropdownOption } from "office-ui-fabric-react";

export class CourseInfoFormValues
{
    spStudentId:number=0;
    selectedCourseCategories:any=[];
    totalFees:number=0;
    courseDuration:number=0;
    spSelectedCourseItems:any=[];
    isCourseInfoSaved:boolean=false;
    courseDiscount:number=0;
    actualCourseFees:number=0;
    discountFess :any;
    isValid:boolean=false;
    discountPercent:any;
    selectedMonth:any;
    selectedBatch:any;
}

export interface ICourseInfodProps {
    courseCategoryOption:any[];
    context:WebPartContext;
    spStudentId:number;
    isFirstPaymentDone:boolean;
    batchOption:any[];
    monthOption:any[];
    StudentId:string;
}

export interface ICourseInfodState {
    formValues:CourseInfoFormValues;
    notFormValid:boolean;
    batchOption:IDropdownOption[];
    courseOption:IDropdownOption[];
}
