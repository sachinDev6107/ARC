export class BasicInfoFormValues 
{
    spStudentId:number=0;
    StudentId: string ="";
    FirstName: string="";
    LastName: string="";
    Address: string="";
    Pincode: string="";
    DateOfBirth: Date;
    Gender: string="";
    Qualification: string="";
    College: string="";
    Contact: string="";
    EmailId: string="";
    TelegramGroup: string="";
    feesStatus:string="";
}

export interface IBasicInfoState {
    formValues:BasicInfoFormValues;
    notFormValid:boolean;
}

