export interface IValidationService {
    isTextFieldEmpty(value: string): boolean;
    isDayFieldEmpty(value: string): boolean;
    isRichTextFieldEmpty(value: string): boolean;
    isDatePickerEmpty(value: Date): boolean;
    isNumberFieldEmpty(value: number): boolean;
    isPeoplePickerEmpty(value: any[]): boolean;
    isAttachmentEmpty(value: any[]): boolean;
    isMultiSelectDropdownEmpty(value: any[]): boolean;
    isEmailValid(value: any): boolean;
}


export class ValidationService implements IValidationService {
    //private RequiredmandatoryText = "Field is required";
    public isPeoplePickerEmpty(value: any[]): boolean {
        if (value == null || value.length == 0) {
            return true;
        } else {
            return false;
        }
    }
    public isTextFieldEmpty(value: string) {
        // debugger;
        if (value == "" || value == null) {
            return true
        } else {
            return false;
        }
    }

    public isDayFieldEmpty(value: string): boolean {
        //debugger;
        if (value == "" || value == null) {
            return true;
        } else {
            return false;
        }
    }

    public isRichTextFieldEmpty(value: string): boolean {

        // var temp = value;
        // temp = temp.replace(/<[^>]*>/g, '');
        value = value.replace(/<[^>]*>/g, '');
        //if (value == "") {
        if (value.trim().length == 0) {

            return true;
        } else {
            return false;
        }
    }

    public isMultiSelectDropdownEmpty(value: any[]): boolean {
        if (value.length == 0) {
            return true;
        } else {
            return false;
        }
    }

    public isSelectDropdownEmpty(value: any): boolean {
        if (value == null) {
            return true;
        } else {
            return false;
        }
    }

    public isNumberFieldEmpty(value: number): boolean {
        if (value == 0 || value == null) {
            return true;
        } else {
            return false;
        }
    }
    public isAmountFieldEmpty(value: number): boolean {
        if (value == null) {
            return true;
        } else {
            return false;
        }
    }

    public isDatePickerEmpty(value: Date): boolean {
        if (value == null) {
            return true;
        } else {
            return false;
        }
    }
    public isAttachmentEmpty(value: any[]): boolean {
        if (value == null || value.length == 0) {

            return true;
        } else {

            return false;
        }
    }
    public isDateValid(fromDate: Date, toDate: Date, message: string): any[] {
        if ((fromDate && toDate) && toDate > fromDate) {
            return [false, ""];
        }
        else if ((fromDate && toDate) && toDate < fromDate) {
            return [true, message];
        }
        else {
            return [false, ""];
        }


    }
    public isEmailValid(value: any): boolean {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (value.match(validRegex)) {

            return false;

        } else {


            return true;

        }
    }
    public isPhoneNumberValid(value: any): boolean {

        var phoneno = /^\d{10}$/;
        if (value.match(phoneno))
        {
            return false;
        }
        else {

            return true;
        }
    }
}