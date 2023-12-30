export class ListNames{
    public static readonly StudentRegistrations:string="StudentRegistrations";
    public static readonly CoursesMaster:string="CoursesMaster";
    public static readonly StudentTransactions:string="StudentTransactions";
    public static readonly EMIMaster:string="EMIMaster";
}

export class ListFieldsStudentRegistration{
    public static readonly StudentId:string="Title";
    public static readonly FirstName:string="FirstName";
    public static readonly LastName:string="LastName";
    public static readonly DateOfBirth:string="DOB";
    public static readonly Gender:string="Gender";
    public static readonly Address:string="Address";
    public static readonly Pincode:string="Pincode";
    public static readonly Qualification:string="Qualification";
    public static readonly College:string="College";
    public static readonly ContactNumber:string="ContactNumber";
    public static readonly EmailId:string="EmailId";
    public static readonly TelegramGroup="TelegramGroup";
    public static readonly Courses:string="Courses";
    public static readonly DateOfJoining:string="DateOfJoining";
    public static readonly FeesPaid:string="FeesPaid";
    public static readonly RemainingFees:string="RemainingFees";
    public static readonly TotalFees:string="TotalFees";
    public static readonly CourseDuration:string="CourseDuration";
}
export class ListFieldsStudentTransactions{
    public static readonly StudentId:string="StudentId";
    public static readonly StudentItemId:string="StudentItemId";
    public static readonly PaidAmount:string="PaidAmount";
    public static readonly PaymentDate:string="PaymentDate";
    public static readonly ReceiptID:string="ReceiptID";
    public static readonly TransactionNumber:string="TransactionNumber";
    public static readonly ModeOfPayment:string="ModeOfPayment";
    public static readonly PaymentReceiptURLs:string="PaymentReceiptURLs";
    public static readonly VerificationStatus:string="VerificationStatus";
}

export class IlistFieldsEMIMaster{
    public static readonly StudentdItemId:string="StudentdItemId";
    public static readonly StudentId:string="StudentId";
    public static readonly IsEMI:string="IsEMI";
    public static readonly TotalFees:string="TotalFees";
    public static readonly RemainingFees:string="RemainingFees";
    public static readonly InitialAmtPay:string="InitialAmtPay";
    public static readonly FixedEMIAmt:string="FixedEMIAmt";
    public static readonly NextEMIDate:string="NextEMIDate";
    public static readonly EMIAmount:string="EMIAmount";
    public static readonly RemainingEMIAmt:string="RemainingEMIAmt";
    public static readonly TotalEMIPaidAmt:string="TotalEMIPaidAmt";
    public static readonly NumberOfEMIs:string="NumberOfEMIs";
    public static readonly feesPaid:string="feesPaid";

}


export class ListFieldsCoursesMaster{
    public static readonly Courses:string="Title";
    public static readonly Category:string="Category";
}