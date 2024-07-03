import { Label, PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";
import { BasicInfoFormValues } from "./BasicInfo/IBasicInfo";
import { CourseInfoFormValues } from "./CourseInfo/ICourseInfo";
import { EMIInfoFormValues } from "./EMIInfo/IEMIInfo";
import { TransactionDataFormValues } from "./FeesTransactions/ITransactionsInfo";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as moment from "moment";
import autoTable from "jspdf-autotable";
import { SaveRegistrationFormValue } from "./Save";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Col, Container, Row } from "react-bootstrap";
import SPListService from "../../../Services/SPListService";

interface IDigitalPaymentReceiptProps {
  context: WebPartContext;
  courseInfo: CourseInfoFormValues;
  emiInfoData: EMIInfoFormValues;
  basicInfoData: BasicInfoFormValues;
  transactionInfoData: TransactionDataFormValues[];
  siteUrl: string;
}

export class DigitalPaymentReceipt extends React.Component<IDigitalPaymentReceiptProps,any> {
  saveRegistrationObj: SaveRegistrationFormValue;
  spListService: SPListService;
  static digiProps:any;
  constructor(props: IDigitalPaymentReceiptProps) {
    super(props);
    DigitalPaymentReceipt.digiProps=props;
    this.saveRegistrationObj = new SaveRegistrationFormValue(this.props.context.pageContext.web.absoluteUrl);
    this.spListService = new SPListService(this.props.context.pageContext.web.absoluteUrl);
  }

  generateReceipts = (receiptType?: string) => {
    var printDoc = new jsPDF("p", "pt","a4",false)

    const pageWidth = printDoc.internal.pageSize.getWidth();
    const pageHeight = printDoc.internal.pageSize.getHeight();

    const img = new Image();
    const imgWidth = pageWidth;
    //const imgHeight = (img.height * pageWidth) / img.width;
    img.src = DigitalPaymentReceipt.digiProps.siteUrl + "/SiteAssets/Letter%20Head.png";
    printDoc.addImage(img, "PNG", 0, 0, imgWidth, pageHeight, undefined, "FAST");

    let todaydateValue: Date = new Date();
    let todaydateString: string = moment(todaydateValue).format("DD-MMM-yyyy");
    printDoc.setFontSize(12).setFont(printDoc.getFont().fontName, "bold");
    printDoc.text("Invoice Date: ", 15, 160);
    printDoc.setFontSize(11).setFont(printDoc.getFont().fontName, "normal");
    printDoc.text(todaydateString, 15, 175);

    printDoc.setFontSize(12).setFont(printDoc.getFont().fontName, "bold");
    printDoc.text("Invoice No:", 15, 195).setFont("", "bold");
    printDoc.setFontSize(11).setFont(printDoc.getFont().fontName, "normal");
    printDoc.text(DigitalPaymentReceipt.digiProps.transactionInfoData[0].paymentReceiptNo, 15, 205);

    printDoc.setFontSize(12).setFont(printDoc.getFont().fontName, "bold");
    printDoc.text("Batch Name:", 15, 225).setFont("", "bold");
    printDoc.setFontSize(11).setFont(printDoc.getFont().fontName, "normal");
    printDoc.text(DigitalPaymentReceipt.digiProps.courseInfo.selectedBatch.text, 15, 235);

    printDoc.setFontSize(12).setFont(printDoc.getFont().fontName, "bold");
    printDoc.text("Billed To:", 400, 200);
    printDoc.setFontSize(11).setFont(printDoc.getFont().fontName, "normal");
    printDoc.text(
      DigitalPaymentReceipt.digiProps.basicInfoData.FirstName +
        " " +
        DigitalPaymentReceipt.digiProps.basicInfoData.LastName,
      400,
      215
    );
    printDoc.text(DigitalPaymentReceipt.digiProps.basicInfoData.Contact, 400, 230);
    if(DigitalPaymentReceipt.digiProps.basicInfoData.Address!=null){
      printDoc.text(DigitalPaymentReceipt.digiProps.basicInfoData.Address, 400, 245, {
        maxWidth: 180,
      })
    }

    const transactionColumns = [
      "Sr. No",
      "Payment Date",
      "Receipt No.",
      "Transaction No.",
      "Payment Mode",
      "Paid Amount",
    ];
    const transactionData: any[] = [];
    // Set the table position (x, y), column widths, and row heights
    //const tx = 10;
    const ty = 300;
    const tcolumnWidths = [50, 100, 80, 100, 100, 100];
    //const trowHeight = 10;
    const footerData1 = [
      "",
      "",
      "",
      "",
      "Total Fees Paid:",
      DigitalPaymentReceipt.digiProps.emiInfoData.feesPaid,
    ];
    const footerData2 = [
      "",
      "",
      "",
      "",
      "Total Course Fees:",
      DigitalPaymentReceipt.digiProps.courseInfo.totalFees,
    ];
    const footerData3 = [
      "",
      "",
      "",
      "",
      "Remaining Fees:",
      DigitalPaymentReceipt.digiProps.emiInfoData.totalRemainingAmount,
    ];
    let footerData: any = [footerData1, footerData2, footerData3];

    DigitalPaymentReceipt.digiProps.transactionInfoData.sort(
      (a: any, b: any) => a.paymentDate - b.paymentDate
    );

    DigitalPaymentReceipt.digiProps.transactionInfoData.forEach((item:any, index:any) => {
      let tRowData = [];
      tRowData.push(index + 1);
      tRowData.push(item.paymentDate);
      tRowData.push(item.paymentReceiptNo);
      tRowData.push(item.transactionNo);
      tRowData.push(item.modeOfPayment);
      tRowData.push(item.paidAmount);
      transactionData.push(tRowData);
    });

    autoTable(printDoc, {
      head: [transactionColumns],
      body: transactionData,
      startY: ty,
      margin: { top: ty },
      columnStyles: {
        0: { cellWidth: tcolumnWidths[0] },
        1: { cellWidth: tcolumnWidths[1], halign: "center" },
        2: { cellWidth: tcolumnWidths[2], halign: "center" },
        3: { cellWidth: tcolumnWidths[3], halign: "center" },
        4: { cellWidth: tcolumnWidths[4], halign: "center" },
        5: { cellWidth: tcolumnWidths[5], halign: "center" },
        6: { cellWidth: tcolumnWidths[6], halign: "center" },
      },
      headStyles: {
        fillColor: [218, 138, 62],
        fontSize: 11,
        textColor: [255, 255, 255],
      }, // Header background color
      bodyStyles: { textColor: [0, 0, 0], fontSize: 10 },
      theme: "striped", // 'striped', 'grid', or 'plain'
      styles: { overflow: "linebreak" },
      foot: footerData,
      footStyles: {
        fillColor: [255, 255, 255],
        fontSize: 10,
        textColor: [1, 1, 1],
        halign: "center",
      },
      //startY: ty + trowHeight, // Move the table down
    });

    const emiColumns = [
      "Sr. No",
      "EMI Date",
      "EMI Amt",
      "Principal Paid",
      "Remaining Principal",
      "EMI Status",
    ];
    const ey = 300 + transactionData.length * 10 + footerData.length * 10 + 150;
    const ecolumnWidths = [50, 100, 80, 100, 100, 100, 80];
    let emiTblData: any = [];
    DigitalPaymentReceipt.digiProps.emiInfoData.emiData.forEach((emiItem: any) => {
      let emiRow = [];
      emiRow.push(emiItem.srNo);
      emiRow.push(emiItem.nextEmiDate);
      emiRow.push(Math.ceil(emiItem.emiAmount));
      emiRow.push(Math.ceil(emiItem.remainingAmount));
      emiRow.push(Math.ceil(emiItem.totalPaidAmount));
      emiRow.push(emiItem.isEMIPaid ? "Paid" : "Pending");
      emiTblData.push(emiRow);
    });
    autoTable(printDoc, {
      head: [emiColumns],
      body: emiTblData,
      startY: ey,
      margin: { top: ey },
      columnStyles: {
        0: { cellWidth: ecolumnWidths[0] },
        1: { cellWidth: ecolumnWidths[1], halign: "center" },
        2: { cellWidth: ecolumnWidths[2], halign: "center" },
        3: { cellWidth: ecolumnWidths[3], halign: "center" },
        4: { cellWidth: ecolumnWidths[4], halign: "center" },
        5: { cellWidth: ecolumnWidths[5], halign: "center" },
      },
      headStyles: {
        fillColor: [218, 138, 62],
        fontSize: 11,
        textColor: [255, 255, 255],
      }, // Header background color
      bodyStyles: { textColor: [0, 0, 0], fontSize: 10 },
      theme: "striped", // 'striped', 'grid', or 'plain'
      styles: { overflow: "linebreak" },
    });

    printDoc = this.addWaterMark(printDoc);
    let fileName = `${DigitalPaymentReceipt.digiProps.basicInfoData.StudentId}_FeesReceipt_${moment(todaydateValue).format("DDMMMyyyy")}.pdf`;
    if(receiptType=="sendonly")
    {
      let printDocBlob = printDoc.output("blob");
      this.sendDigitalReceipt(printDocBlob,fileName).then(
        (onResolved) => {
          // Some task on success
          alert("Fees Receipt has been sent");
        },
        (onRejected) => {
          // Some task on failure
          alert("Fees Receipt has not been sent. Please try again");
        }
      );;
    }
    else
    {
      printDoc.save(fileName);
    }
    

    
  };

  public addWaterMark(doc: any) {
    // To add watermark for pdf document

    var totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setTextColor(208, 208, 208);
      doc.setFontSize(11);

      //doc.text(150, doc.internal.pageSize.height - 500, 'Internal Use Only', 20, 90);
      //doc.text(20, doc.internal.pageSize.height - 10, 'Internal Use Only');
      doc.text(doc.internal.pageSize.width - 450, 15, "ARC Digital Receipt.");
      doc.text(
        doc.internal.pageSize.width - 450,
        doc.internal.pageSize.height - 100,
        "Note : fee once paid will not be refundable under any circumstances."
      );
    }

    return doc;
  }
  sendDigitalReceipt = async (printDocBlob:any,fileName:string) => {
    const saveDigitalReceipt = await this.saveRegistrationObj.sendDigitalReceipt(DigitalPaymentReceipt.digiProps.basicInfoData);
    
    this.spListService.saveListAttachment(fileName,printDocBlob,'SendReceiptEmailEntry',saveDigitalReceipt.data.Id);

  };

  render() {
    return (
      <>
        <Label className="mt-1 mb-2 ms-3">
          Student Id :{" "}
          <span className="clsStdId">{DigitalPaymentReceipt.digiProps.basicInfoData.StudentId}</span>
        </Label>
        <Container>
          <Row>
            <Col xs={12} md={6}>
              <PrimaryButton
                iconProps={{ iconName: "Download" }}
                text="Generate Digital Receipts"
                onClick={()=>{this.generateReceipts()}}
              ></PrimaryButton>
            </Col>
            <Col xs={12} md={6}>
              <PrimaryButton
                text="Send Digital Receipts"
                onClick={()=>{this.generateReceipts("sendonly")}}
              ></PrimaryButton>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
