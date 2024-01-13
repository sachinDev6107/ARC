
//import scss from './index.scss';

import { Label, Dropdown, Checkbox, IDropdownOption, PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";
import { Card, Row, Col } from "react-bootstrap";
import SPListService from "../../../../Services/SPListService";
import { CourseInfoFormValues, ICourseInfodProps, ICourseInfodState } from "./ICourseInfo";
import { CourseInfoCtx } from "../ComponentContext/Contexts";
import { SaveRegistrationFormValue } from "../Save";
import { ValidationService } from "../../../../Services/ValidationService";


class CourseInfo extends React.Component<ICourseInfodProps, ICourseInfodState> {
    private spListService: SPListService = new SPListService(this.props.context.pageContext.web.absoluteUrl);
    saveRegistrationObj:SaveRegistrationFormValue = new SaveRegistrationFormValue(this.props.context.pageContext.web.absoluteUrl);
    context:React.ContextType<typeof CourseInfoCtx>;
    catDpKey = 0;
    validationSerive = new ValidationService();
    constructor(props:ICourseInfodProps) {
        super(props);
        this.state = {
           formValues:new CourseInfoFormValues(),
           notFormValid:false
        };
    }

    componentDidMount() {
      if(this.context.courseInfoData!=undefined)
      {
          this.setState({
              formValues:{...this.context.courseInfoData}
          },this.calculateActualCourseFees)
          
      }
      this.catDpKey = Math.random();
    }

    calculateActualCourseFees = () => {
        let actualCourseFees = 0;
        this.state.formValues.spSelectedCourseItems.forEach((item:any) => {
          actualCourseFees += item.Fees
        })
        this.setState({
          formValues:{
            ...this.state.formValues,
            actualCourseFees:actualCourseFees
          }
        })
    }


    private _dropdownCategoryChange = async (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
      let tempSelectedCourseCat = this.state.formValues.selectedCourseCategories;
      if(option?.selected)
      {
        if(tempSelectedCourseCat.indexOf(option.key)<0)
        {
            tempSelectedCourseCat.push(option.key)
        }
      }
      else
      {
        let catIndex = tempSelectedCourseCat.indexOf(option?.key);
        if(catIndex>=0)
        {
          tempSelectedCourseCat.splice(catIndex,1);
        }
      }
      this.setState({
        formValues:{
          ...this.state.formValues,
          selectedCourseCategories:tempSelectedCourseCat
        }
      })

    
        let selectedCourseCat = "";
        tempSelectedCourseCat.forEach((courseCat: any, index: any) => {
          if (!index) {
            selectedCourseCat += `Category eq '${courseCat}'`;
          }
          else {
            selectedCourseCat += `or Category eq '${courseCat}'`;
          }
        })
        if (selectedCourseCat != '') {
          let totFees = 0;
          let totDays = 0;
          let spCategoryCourses = await this.spListService.GetListItems("CoursesMaster", "*", selectedCourseCat).catch(err => { console.log(err) });
          spCategoryCourses.forEach((element: any) => {
            element["IsSelectedCourse"] = true
            totFees += element.Fees;
            totDays += element.Duration;
          });
          this.setState({
            formValues:{
              ...this.state.formValues,
              spSelectedCourseItems:spCategoryCourses,
              totalFees:totFees,
              actualCourseFees:totFees,
              courseDuration:totDays
            }
          })
        }
        else {
          this.setState({
            formValues:{
              ...this.state.formValues,
              spSelectedCourseItems:[]
            }
          })
        }
    
      }

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
    }

    saveCourseInfoData = async () =>
    {
        await this.saveRegistrationObj.saveCourseInfo(this.state.formValues,this.props.spStudentId,this.daysToMonthsAndDays(this.state.formValues.courseDuration))
        this.setState({
          formValues:{
            ...this.state.formValues,
            isCourseInfoSaved:true
          }
        })
        this.context.updateCourseInfoCtx(this.state.formValues)
    }

    render() {
        return (
          <>
            <Card className='mb-4'>
            <Card.Header>Course & Fees Info</Card.Header>
            <Card.Body>
              <Row>
                <Col xs={12} md={12}>
                  <Label required>Course Category</Label>
                  <Dropdown
                    key={this.catDpKey}
                    id='ddlCategorySelect'
                    placeholder='Select Course Category'
                    multiSelect
                    disabled={this.state.formValues.isCourseInfoSaved && this.props.isFirstPaymentDone}
                    //selectedKeys={this.state.formValues.selectedCourseCategories.length?this.state.formValues.selectedCourseCategories:undefined}
                    options={this.props.courseCategoryOption}
                    defaultSelectedKeys={this.state.formValues.selectedCourseCategories}
                    onChange={this._dropdownCategoryChange}>
                  </Dropdown>
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
                <Col xs={12} md={12}>
                  <Row className='mt-3'>
                    {
                      this.state.formValues.spSelectedCourseItems.map((crItem: any) => {
                        return (
                          <>
                            <Col xs={4} md={4} className='mb-3'>
                              <Checkbox
                                label={`${crItem.Title} - (${crItem.Category.results.join(', ')}) - ₹${crItem.Fees}`}
                                checked={crItem.IsSelectedCourse}
                                disabled={this.state.formValues.isCourseInfoSaved && this.props.isFirstPaymentDone}
                                onChange={(ev: any, checked: boolean) => {
                                  crItem.IsSelectedCourse = checked;
                                  this.setState({
                                      formValues:{
                                        ...this.state.formValues,
                                        selectedCourseCategories: this.state.formValues.selectedCourseCategories,
                                        totalFees: checked ? this.state.formValues.totalFees + crItem.Fees : this.state.formValues.totalFees - crItem.Fees,
                                        actualCourseFees: checked? this.state.formValues.actualCourseFees + crItem.Fees : this.state.formValues.actualCourseFees - crItem.Fees,
                                        courseDuration: checked ? this.state.formValues.courseDuration + crItem.Duration : this.state.formValues.courseDuration - crItem.Duration
                                      }
                                  })
                                }}
                              />
                            </Col>
                          </>
                        )
                      })
                    }
                  </Row>
                </Col>
                <Col xs={6} md={6} className='text-center'>
                  <Label>{`Total selected course fees : ${this.state.formValues.actualCourseFees}`}</Label>
                </Col>

                <Col xs={6} md={6} className='text-center'>
                  <Label>{`Total duration of courses : ${this.daysToMonthsAndDays(this.state.formValues.courseDuration)}`}</Label>
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
                      <TextField type="Number" id="dFees" 
                        onChange={(ev:any)=>{
                          this.setState({ formValues:{
                          ...this.state.formValues,
                          courseDiscount:ev.target.value!=''?parseInt(ev.target.value) : ev.target.value,
                          totalFees:Math.ceil(this.state.formValues.actualCourseFees-((this.state.formValues.actualCourseFees*(ev.target.value!=''?parseInt(ev.target.value):0))/100))
                        }
                        })}}
                        value={this.state.formValues.courseDiscount?.toString()} 
                        //errorMessage={this.state.notFormValid && this.validationSerive.isNumberFieldEmpty(this.state.formValues.courseDiscount)?'Discount ':''}
                        disabled={this.state.formValues.isCourseInfoSaved && this.props.isFirstPaymentDone}
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <Label>Fees After Discount</Label>
                      <TextField type="Number" disabled id="tdFees" 
                        value={this.state.formValues.totalFees?.toString()} 
                      />
                    </Col>
                  </Row>
                </Card.Body>
            </Card>


            {
              (!this.state.formValues.isCourseInfoSaved || !this.props.isFirstPaymentDone) &&
                <Row>
                  <Col className="mt-2 mb-3 text-center">
                      <PrimaryButton
                          iconProps={{ iconName: "Save" }}
                          text="Save"
                          onClick={this.saveCourseInfoData}
                      />
                  </Col>
                </Row>
            }
            
          </>
        );
    }
}

CourseInfo.contextType = CourseInfoCtx

export default CourseInfo;
