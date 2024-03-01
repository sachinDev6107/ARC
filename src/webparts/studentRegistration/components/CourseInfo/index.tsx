//import scss from './index.scss';

import {
  Label,
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  TextField,
  //selectProperties,
} from "office-ui-fabric-react";
import * as React from "react";
import { Card, Row, Col } from "react-bootstrap";
import SPListService from "../../../../Services/SPListService";
import {
  CourseInfoFormValues,
  ICourseInfodProps,
  ICourseInfodState,
} from "./ICourseInfo";
import { CourseInfoCtx } from "../ComponentContext/Contexts";
import { SaveRegistrationFormValue } from "../Save";
import { ValidationService } from "../../../../Services/ValidationService";
//import { Item } from "@pnp/sp/items";

class CourseInfo extends React.Component<ICourseInfodProps, ICourseInfodState> {
  private spListService: SPListService = new SPListService(
    this.props.context.pageContext.web.absoluteUrl
  );
  saveRegistrationObj: SaveRegistrationFormValue =
    new SaveRegistrationFormValue(
      this.props.context.pageContext.web.absoluteUrl
    );
  context: React.ContextType<typeof CourseInfoCtx>;
  catDpKey = 0;
  validationSerive = new ValidationService();
  target: any;
  spMonthCourses: any;
  constructor(props: ICourseInfodProps) {
    super(props);
    this.state = {
      formValues: new CourseInfoFormValues(),
      notFormValid: false,
      batchOption: [],
      courseOption: [],
    };
  }

  async componentDidMount() {
    if (this.context.courseInfoData != undefined) {
      await this._dropdownMonthChange(
        null,
        this.context.courseInfoData.selectedMonth,
        0
      );
      this._dropdownCategoryChange(
        null,
        this.context.courseInfoData.selectedCourseCategories,
        0
      );
      this.setState(
        {
          formValues: { ...this.context.courseInfoData },
        },
        this.calculateActualCourseFees
      );
    }

    this.catDpKey = Math.random();
  }

  calculateActualCourseFees = () => {
    let actualCourseFees = 0;
    this.state.formValues.spSelectedCourseItems.forEach((item: any) => {
      actualCourseFees += item.Fees;
    });
    this.setState({
      formValues: {
        ...this.state.formValues,
        actualCourseFees: actualCourseFees,
      },
    });
  };
  private _dropdownMonthChange = async (
    event: any,
    option?: IDropdownOption,
    index?: number
  ) => {
    this.setState({
      batchOption: [],
      formValues: {
        ...this.state.formValues,
        selectedMonth: option,
        selectedBatch: [],
        totalFees: 0,
        courseDuration: 0,
        actualCourseFees: 0,
      },
    });

    const optionSelect = `Month eq '${option?.text}' and IsActive eq 1`;
    this.spMonthCourses = await this.spListService
      .GetListItems(
        "CoursesMaster",
        "ID,Title,Category,Month,Fees,Duration",
        optionSelect
      )
      .catch((err) => {
        console.log(err);
      });

    const cat: any[] = [];
    this.spMonthCourses.forEach((element: any) => {
      cat.push(element.Category);
    });
    const uniqueArr = cat.filter((item, index) => cat.indexOf(item) === index);
    this.setState({
      courseOption: uniqueArr.map((it: any) => ({ key: it, text: it })),
      formValues: {
        ...this.state.formValues,
      },
    });
  };

  private _dropdownCategoryChange = async (
    event: any,
    option?: IDropdownOption,
    index?: number
  ) => {
    const monthBatches = this.spMonthCourses.filter(
      (item: any) => item.Category == option?.text
    );
    if (monthBatches.length == 1) {
      this.setState({
        batchOption: monthBatches.map((item: any) => ({
          key: item["ID"],
          text: item["Title"],
          fees: item["Fees"],
          duration: item["Duration"],
        })),
        formValues: {
          ...this.state.formValues,
          selectedCourseCategories: option,
          selectedBatch: null,
          totalFees: 0,
          courseDuration: 0,
          actualCourseFees: 0,
        },
      });
    } else {
      this.setState({
        batchOption: monthBatches.map((item: any) => ({
          key: item["ID"],
          text: item["Title"],
          fees: item["Fees"],
          duration: item["Duration"],
        })),
        formValues: {
          ...this.state.formValues,
          selectedCourseCategories: option,
          selectedBatch: null,
          totalFees: 0,
          courseDuration: 0,
          actualCourseFees: 0,
        },
      });
    }
  };

  private _dropdownBatchChange = async (
    event: React.FormEvent<HTMLDivElement>,
    option?: any,
    index?: number
  ) => {
    this.setState({
      formValues: {
        ...this.state.formValues,
        selectedBatch: option,
        totalFees: option["fees"],
        courseDuration: option["duration"],
        actualCourseFees: option["fees"],
      },
    });
  };

  daysToMonthsAndDays = (days: number) => {
    //const monthsInYear = 12;
    const daysInMonth = 30; // You can adjust this value based on your requirements

    const months = Math.floor(days / daysInMonth);
    const remainingDays = days % daysInMonth;

    if (months === 0) {
      return `${remainingDays} days`;
    } else {
      return `${months} months and ${remainingDays} days`;
    }
  };

  saveCourseInfoData = async () => {
    await this.saveRegistrationObj.saveCourseInfo(
      this.state.formValues,
      this.props.spStudentId,
      this.daysToMonthsAndDays(this.state.formValues.courseDuration)
    );
    this.setState({
      formValues: {
        ...this.state.formValues,
        isCourseInfoSaved: true,
      },
    });
    this.context.updateCourseInfoCtx(this.state.formValues);
  };
  fessAfterDiscount = async (event: any) => {
    const discountValue = parseInt(event.target.value);
    // if((discountValue) <= (this.state.formValues.actualCourseFees)){
    this.setState({
      formValues: {
        ...this.state.formValues,
        totalFees:
          discountValue <= this.state.formValues.actualCourseFees
            ? discountValue
            : 0,
        courseDiscount: Math.ceil(
          ((this.state.formValues.actualCourseFees - discountValue) /
            this.state.formValues.actualCourseFees) *
            100
        ),
      },
    });
  };

  render() {
    return (
      <>
        <Card className="mb-4">
          <Col xs={12} md={12}>
          <Label className="mt-1 mb-2 ms-3">
              Student Id :{" "}
              <span className="clsStdId">
                {this.props.StudentId}
              </span>
            </Label>
          </Col>
          <Card.Header>Course & Fees Info</Card.Header>
          <Card.Body>
            <Row>
              <Col xs={12} md={4}>
                <Label required>Month</Label>
                <Dropdown
                  key={this.catDpKey}
                  id="ddlMonthSelect"
                  placeholder="Select Month"
                  disabled={
                    this.state.formValues.isCourseInfoSaved &&
                    this.props.isFirstPaymentDone
                  }
                  //selectedKeys={this.state.formValues.selectedCourseCategories.length?this.state.formValues.selectedCourseCategories:undefined}
                  options={this.props.monthOption}
                  selectedKey={
                    this.state.formValues.selectedMonth
                      ? this.state.formValues.selectedMonth.key
                      : ""
                  }
                  onChange={this._dropdownMonthChange}
                />
              </Col>
              <Col xs={12} md={4}>
                <Label required>Course Category</Label>
                <Dropdown
                  key={this.catDpKey}
                  id="ddlCategorySelect"
                  placeholder="Select Course Category"
                  // multiSelect
                  disabled={
                    this.state.formValues.isCourseInfoSaved &&
                    this.props.isFirstPaymentDone
                  }
                  //selectedKeys={this.state.formValues.selectedCourseCategories.length?this.state.formValues.selectedCourseCategories:undefined}
                  options={this.state.courseOption}
                  selectedKey={
                    this.state.formValues.selectedCourseCategories.key
                  }
                  onChange={this._dropdownCategoryChange}
                />
              </Col>
              <Col xs={12} md={4}>
                <Label required>Batch</Label>
                <Dropdown
                  key={this.catDpKey}
                  id="ddlBatchSelect"
                  placeholder="Select Batch"
                  disabled={
                    this.state.formValues.isCourseInfoSaved &&
                    this.props.isFirstPaymentDone
                  }
                  options={this.state.batchOption}
                  selectedKey={
                    this.state.formValues.selectedBatch == null
                      ? this.state.formValues.selectedBatch
                      : this.state.formValues.selectedBatch?.key
                  }
                  onChange={this._dropdownBatchChange}
                />
              </Col>
              {/* <Col xs={12} md={6}>
                  <Label>All Courses</Label>
                  <Dropdown
                    id='ddlcourses'
                    placeholder='Select Course'
                    multiSelect
                    options={this.state.coursesOption}
                    defaultSelectedKeys={this.state.formValues.Courses}
                    onChange={this._dropdownCourseChange}>
                  </Dropdown>
                </Col> */}
              {/*
              <Col xs={12} md={12}>
                <Row className="mt-3">
                  {this.state.formValues.spSelectedCourseItems.map(
                    (crItem: any) => {
                      return (
                        <>
                          <Col xs={4} md={4} className="mb-3">
                            <Checkbox
                              // label={`${
                              //   crItem.Title
                              // } - (${crItem.Category.results.join(", ")}) - ₹${
                              //   crItem.Fees
                              // }`}
                              label={`${crItem.Title} - (${crItem.Category}) - ₹${crItem.Fees}`}
                              checked={crItem.IsSelectedCourse}
                              disabled={
                                this.state.formValues.isCourseInfoSaved &&
                                this.props.isFirstPaymentDone
                              }
                              onChange={(ev: any, checked: boolean) => {
                                crItem.IsSelectedCourse = checked;
                                this.setState({
                                  formValues: {
                                    ...this.state.formValues,
                                    selectedCourseCategories:
                                      this.state.formValues
                                        .selectedCourseCategories,
                                    totalFees: checked
                                      ? this.state.formValues.totalFees +
                                        crItem.Fees
                                      : this.state.formValues.totalFees -
                                        crItem.Fees,
                                    actualCourseFees: checked
                                      ? this.state.formValues.actualCourseFees +
                                        crItem.Fees
                                      : this.state.formValues.actualCourseFees -
                                        crItem.Fees,
                                    courseDuration: checked
                                      ? this.state.formValues.courseDuration +
                                        crItem.Duration
                                      : this.state.formValues.courseDuration -
                                        crItem.Duration,
                                  },
                                });
                              }}
                            />
                          </Col>
                        </>
                      );
                    }
                  )}
                </Row>
              </Col>
              */}
              <Col xs={6} md={6} className="text-center">
                <Label>{`Total selected course fees : ${this.state.formValues.actualCourseFees}`}</Label>
              </Col>

              <Col xs={6} md={6} className="text-center">
                <Label>{`Total duration of courses : ${this.daysToMonthsAndDays(
                  this.state.formValues.courseDuration
                )}`}</Label>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>Discount Info</Card.Header>
          <Card.Body>
            <Row>
              <Col xs={12} md={6}>
                <Label>Discount</Label>
                <TextField
                  type="Number"
                  id="dFees"
                  onChange={(ev: any) => {
                    this.setState({
                      formValues: {
                        ...this.state.formValues,
                        courseDiscount:
                          ev.target.value != ""
                            ? parseInt(ev.target.value)
                            : ev.target.value,
                        totalFees: Math.ceil(
                          this.state.formValues.actualCourseFees -
                            (this.state.formValues.actualCourseFees *
                              (ev.target.value != ""
                                ? parseInt(ev.target.value)
                                : 0)) /
                              100
                        ),
                      },
                    });
                  }}
                  value={this.state.formValues.courseDiscount?.toString()}
                  //value={this.state.formValues.discountPercent?.toString()}
                  //errorMessage={this.state.notFormValid && this.validationSerive.isNumberFieldEmpty(this.state.formValues.courseDiscount)?'Discount ':''}
                  disabled={
                    this.state.formValues.isCourseInfoSaved &&
                    this.props.isFirstPaymentDone
                  }
                />
              </Col>
              <Col xs={12} md={6}>
                <Label>Fees After Discount</Label>
                <TextField
                  type="Number"
                  //disabled
                  id="tdFees"
                  onChange={this.fessAfterDiscount}
                  // errorMessage={this.state.formValues.discountFess?.toString()>this.state.formValues.actualCourseFees?.toString()?"You are not allowed":""}
                  value={this.state.formValues.totalFees?.toString()}
                  disabled={
                    this.state.formValues.isCourseInfoSaved &&
                    this.props.isFirstPaymentDone
                  }
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {(!this.state.formValues.isCourseInfoSaved ||
          !this.props.isFirstPaymentDone) && (
          <Row>
            <Col className="mt-2 mb-3 text-center">
              <PrimaryButton
                iconProps={{ iconName: "Save" }}
                text="Save"
                onClick={this.saveCourseInfoData}
              />
            </Col>
          </Row>
        )}
      </>
    );
  }
}

CourseInfo.contextType = CourseInfoCtx;

export default CourseInfo;
