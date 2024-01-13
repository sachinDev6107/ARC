import { Label, PrimaryButton, Separator, TextField } from "office-ui-fabric-react";
import * as React from "react";
import { Col, Row } from "react-bootstrap";
import { IEMICalculatorProps, IEMICalculatorState } from "./IEMIInfo";
import { ValidationService } from "../../../../Services/ValidationService";



export default class EMICalculator extends React.Component<
  IEMICalculatorProps,
  IEMICalculatorState
> {
  validationSerive = new ValidationService();
  courseMonths:number=0;
  constructor(props: IEMICalculatorProps) {
    super(props);
    this.state = {
      initialAmount: this.props.emiInfoState.feesPaid,
      fixedEMIAmt: 0,
      emiData: [],
      noOfEMIs: 0,
      notFormValid:false,
      isEMIInfoSaved:false,
    };
  }

  componentDidMount(): void {
    this.setState({
      initialAmount: this.props.emiInfoState.feesPaid,
      fixedEMIAmt: this.props.emiInfoState.fixedEMIAmt,
      emiData: this.props.emiInfoState.emiData,
      noOfEMIs: this.props.emiInfoState.noOfEMIs,
      isInitialAmountPaymentDone:this.props.emiInfoState.isInitialAmountPaymentDone
    },()=>{
      this.onGenerateEMIs()
    })
    this.courseMonths = Math.ceil(this.props.courseDuration / 30);
    
  }

  onGenerateEMIs = () => {

    if (this._isValid()) {
      // Calculate the principal amount
      const totalCourseFees = this.props.totalCourseFees || 0; // Default to 0 if totalCourseFees is null
      const initialAmount =
        parseFloat(this.state.initialAmount.toString()) || 0; // Default to 0 if initialAmount is not a valid number

      let numberOfMonths = 0;

      if (this.state.noOfEMIs > 0) {
        numberOfMonths = parseInt(
          this.state.noOfEMIs.toString(),
          10
        ); // Ensure it's a valid integer
      } else if (this.state.fixedEMIAmt > 0) {
        const fixedEMIAmt =
          parseFloat(this.state.fixedEMIAmt.toString()) || 0; // Default to 0 if fixedEMIAmt is not a valid number
        numberOfMonths = Math.ceil(
          (totalCourseFees - initialAmount) / fixedEMIAmt
        );
      } else {
        numberOfMonths = Math.ceil(this.props.courseDuration / 30);
      }

      const emiData = [];
      let remainingAmount = totalCourseFees - initialAmount;
      let totalPaidAmount = 0; // Initialize totalPaidAmount

      if (this.state.fixedEMIAmt > 0) {
        for (let i = 1; i <= numberOfMonths; i++) {
          const nextEmiDate = new Date(); // Replace with actual EMI date logic
          nextEmiDate.setMonth(nextEmiDate.getMonth() + i);

          let currentEmiAmount =
            parseFloat(this.state.fixedEMIAmt.toString()) || 0;
          if (remainingAmount > currentEmiAmount) {
            remainingAmount -= currentEmiAmount;
          } else {
            currentEmiAmount = remainingAmount;
            remainingAmount -= currentEmiAmount;
          }

          totalPaidAmount += currentEmiAmount; // Add current EMI to totalPaidAmount

          emiData.push({
            srNo: i,
            nextEmiDate: nextEmiDate.toDateString(),
            emiAmount: currentEmiAmount,
            remainingAmount: remainingAmount,
            totalPaidAmount: totalPaidAmount, // Add totalPaidAmount to the table
            isEMIPaid:false
          });
        }
      } else {
        // Calculate the EMI amount
        const emiAmount = (totalCourseFees - initialAmount) / numberOfMonths;

        for (let i = 1; i <= numberOfMonths; i++) {
          const nextEmiDate = new Date(); // Replace with actual EMI date logic
          nextEmiDate.setMonth(nextEmiDate.getMonth() + i);

          const currentEmiAmount = emiAmount;
          remainingAmount -= currentEmiAmount;

          totalPaidAmount += currentEmiAmount; // Add current EMI to totalPaidAmount

          emiData.push({
            srNo: i,
            nextEmiDate: nextEmiDate.toDateString(),
            emiAmount: Math.ceil(currentEmiAmount),
            remainingAmount: Math.ceil(remainingAmount),
            totalPaidAmount: Math.ceil(totalPaidAmount), // Add totalPaidAmount to the table,
            isEMIPaid:false
          });
        }
      }

      this.setState({ 
        emiData:emiData, 
        noOfEMIs: numberOfMonths,
        notFormValid:false 
      },() => {
        this.props.updateFeesPaid(this.state.initialAmount);
        this.props.UpdateEMIData(this.state.emiData);
      });
    }
    else {
      this.setState({ notFormValid: true })
    }
   
  };

  private _isValid = () =>
  {
        if(this.validationSerive.isNumberFieldEmpty(this.state.initialAmount) ||
          this.state.initialAmount>this.props.totalCourseFees ||
          this.state.noOfEMIs>this.courseMonths
        )
        {
            return false;
        }
        else
        {
            return true;
        }
  }

  renderEMITable() {
    const { emiData } = this.state;

    return (
      <table className="table table-striped mt-2">
        <thead>
          <tr>
            <th scope="col">Sr. No</th>
            <th scope="col">EMI Date</th>
            <th scope="col">EMI Amount</th>
            <th scope="col">Principal Paid</th> {/* Add Total Paid Amount column */}
            <th scope="col">Principal Remaining</th>
          </tr>
        </thead>
        <tbody>
          {emiData!=undefined && emiData.map((emi, index) => (
            <tr key={index}>
              <td scope="row">{emi.srNo}</td>
              <td>{emi.nextEmiDate}</td>
              <td>{emi.emiAmount.toFixed(2)}</td>
              <td>{emi.totalPaidAmount.toFixed(2)}</td> {/* Display Total Paid Amount */}
              <td>{emi.remainingAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <>
        <Row className="mt-4">
        <Separator>EMI Calculator</Separator>
          <Col xs={4} md={4}>
            <Label required>How much initial amount do you want to pay?</Label>
            <TextField
              value={this.state.initialAmount?.toString()}
              defaultValue=""
              onChange={(ev: any) => {
                this.setState({ initialAmount: ev.target.value })
              }}
              errorMessage={
                this.state.notFormValid && this.validationSerive.isNumberFieldEmpty(this.state.initialAmount)?'Initial amount is required':
                this.state.notFormValid && this.state.initialAmount>this.props.totalCourseFees?'Initial amount should not be greater than total fees':""}
            />
          </Col>
          <Col xs={4} md={4}>
            <Label>Number of EMIs?</Label>
            <TextField
              value={this.state.noOfEMIs.toString()}
              defaultValue=""
              onChange={(ev: any) => {
                this.setState({ noOfEMIs: ev.target.value });
              }}
              errorMessage={this.state.notFormValid && this.state.noOfEMIs>this.courseMonths?'EMIs should not be greater than duration of course':''}
            />
          </Col>
          <Col xs={4} md={4}>
            <Label>Fixed EMI amount</Label>
            <TextField
              value={this.state.fixedEMIAmt.toString()}
              defaultValue=""
              onChange={(ev: any) => {
                this.setState({ fixedEMIAmt: ev.target.value });
              }}
            />
          </Col>
          <Col className="mt-1 text-center">
            <Label>Select either of number of EMIs or fixed emi amount.</Label>
          </Col>
        </Row>
        <Row>
          <Col className="mt-3 text-center">
            <PrimaryButton
                iconProps={{ iconName: "Copy" }}
                text="Generate EMIs"
                onClick={this.onGenerateEMIs}
                allowDisabledFocus
              />
          </Col>
        </Row>
        <Row>{this.renderEMITable()}</Row>
      </>
    );
  }
}
