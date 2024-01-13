import { WebPartContext } from "@microsoft/sp-webpart-base";

export class CourseInfoFormValues
{
    selectedCourseCategories:any = [];
    totalFees:number=0;
    courseDuration:number=0;
    spSelectedCourseItems:any=[];
    isCourseInfoSaved:boolean=false;
    courseDiscount:number=0;
    actualCourseFees:number=0;
}

export interface ICourseInfodProps {
    courseCategoryOption:any[];
    context:WebPartContext;
    spStudentId:number;
    isFirstPaymentDone:boolean;
}

export interface ICourseInfodState {
    formValues:CourseInfoFormValues;
    notFormValid:boolean;
}