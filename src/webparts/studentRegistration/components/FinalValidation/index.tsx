import * as React from "react";
import { BasicInfoFormValues } from "../BasicInfo/IBasicInfo";
import { CourseInfoFormValues } from "../CourseInfo/ICourseInfo";
import { EMIInfoFormValues } from "../EMIInfo/IEMIInfo";
import { TransactionDataFormValues } from "../FeesTransactions/ITransactionsInfo";
import { DigitalPaymentReceipt } from "../DigitalPaymentReceipt";

export interface IFinalValidationdProps {
    courseInfo:CourseInfoFormValues;
    emiInfoData:EMIInfoFormValues;
    basicInfoData:BasicInfoFormValues;
    transactionInfoData:TransactionDataFormValues[];
}

export interface IFinalValidationdState {

}

class FinalValidation extends React.Component<IFinalValidationdProps, IFinalValidationdState> {
    constructor(props:IFinalValidationdProps) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <>
              <DigitalPaymentReceipt
                    courseInfo={this.props.courseInfo}
                    emiInfoData={this.props.emiInfoData}
                    basicInfoData={this.props.basicInfoData}
                    transactionInfoData={this.props.transactionInfoData}
              ></DigitalPaymentReceipt>  
            </>
        );
    }
}

export default FinalValidation;
