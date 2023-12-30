import * as React from "react";
import { BasicInfoFormValues } from "../BasicInfo/IBasicInfo";
import { CourseInfoFormValues } from "../CourseInfo/ICourseInfo";

export interface IBasicInfoCtx
{
    basicInfoData:BasicInfoFormValues;
    updateBasicInfoCtx:any;
}

export const BasicInfoCtx = React.createContext<IBasicInfoCtx>({
    basicInfoData:new BasicInfoFormValues(),
    updateBasicInfoCtx:()=>{}

})

export interface ICourseInfoCtx
{
    courseInfoData:CourseInfoFormValues;
    updateCourseInfoCtx:any
}

export const CourseInfoCtx = React.createContext<ICourseInfoCtx>({
    courseInfoData:new CourseInfoFormValues(),
    updateCourseInfoCtx:()=>{}
})