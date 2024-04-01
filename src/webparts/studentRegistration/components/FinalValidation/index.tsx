import * as React from "react";
import { BasicInfoFormValues } from "../BasicInfo/IBasicInfo";
import { CourseInfoFormValues } from "../CourseInfo/ICourseInfo";
import { EMIInfoFormValues } from "../EMIInfo/IEMIInfo";
import { TransactionDataFormValues } from "../FeesTransactions/ITransactionsInfo";
import { DigitalPaymentReceipt } from "../DigitalPaymentReceipt";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IFinalValidationdProps {
    courseInfo:CourseInfoFormValues;
    emiInfoData:EMIInfoFormValues;
    basicInfoData:BasicInfoFormValues;
    transactionInfoData:TransactionDataFormValues[];
    context:WebPartContext
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
                    siteUrl={this.props.context.pageContext.web.absoluteUrl} 
                    context={this.props.context}></DigitalPaymentReceipt>  
            </>
        );
    }
}

export default FinalValidation;
