import * as React from 'react';
import { IDashboardProps } from './IDashboardProps';
import { ColumnDirective, ColumnsDirective } from '@syncfusion/ej2-react-grids/src/grid/columns-directive';
import { GridComponent } from '@syncfusion/ej2-react-grids/src/grid/grid.component';
import { Inject } from '@syncfusion/ej2-react-navigations/src';
import { Page, Sort, VirtualScroll } from '@syncfusion/ej2-react-grids';
import { ListFieldsStudentRegistration, ListNames } from '../../../Domain/Constant';
import { IListOperationService, ListOperationService } from '../../../Domain/Service';
import { SPComponentLoader } from '@microsoft/sp-loader';
SPComponentLoader.loadCss("https://cdn.syncfusion.com/ej2/21.1.35/material3.css");

export default class Dashboard extends React.Component<IDashboardProps, any, {}> {

  private _listService: IListOperationService;
  constructor(props: IDashboardProps | Readonly<IDashboardProps>) {
    super(props)
    this.state = {
      listData: []

    }
    this._listService = new ListOperationService();
  }

  public componentDidMount = async () => {
    let studentDetails: any[] = await this._listService.GetAllItemsFromList(ListNames.StudentRegistrations, "", ["*", "Courses/Title"], ["Courses"]);
    console.log(studentDetails);
    this.setState({
      listData: studentDetails.map((item) => ({
        ...item,
        Courses: item.Courses.map((x: { Title: any; }) => x.Title).join()
      }))
    });
  }
 public filter :any={
  type :'Menu'
 }
  
  public render(): React.ReactElement<IDashboardProps> {
    // console.log("listDate" ,this.state.listData);  
    return (
      <>
        <div className='control-pane'>   
          <div className='control-section'>
            <GridComponent dataSource={this.state.listData} filterSettings={this.filter}  allowFiltering={false} 
            allowPaging={true} pageSettings={{ pageCount: 5 }} allowSorting={true} enableHeaderFocus={true}>
              <ColumnsDirective>
                <ColumnDirective field={ListFieldsStudentRegistration.StudentId} headerText='Student Id' width='150' textAlign='Left'></ColumnDirective>
                <ColumnDirective field={ListFieldsStudentRegistration.FirstName} headerText='First Name' width='150' textAlign='Left'></ColumnDirective>
                <ColumnDirective field={ListFieldsStudentRegistration.LastName} headerText='Last Name' width='150'  textAlign='Left' />
                <ColumnDirective field={ListFieldsStudentRegistration.Address} headerText='Address' width='180'  textAlign='Left' />
                <ColumnDirective field={ListFieldsStudentRegistration.Pincode} headerText='Pincode' width='150' textAlign='Left'></ColumnDirective>
                <ColumnDirective field={ListFieldsStudentRegistration.DateOfBirth} headerText='Date of Birth' width='150' format='dMy'></ColumnDirective>
                <ColumnDirective field={ListFieldsStudentRegistration.Gender} headerText='Gender' width='150' textAlign='Left'></ColumnDirective>
                <ColumnDirective field={ListFieldsStudentRegistration.ContactNumber} headerText='Contact No.' width='150' textAlign='Left'></ColumnDirective>
                <ColumnDirective field={ListFieldsStudentRegistration.EmailId} headerText='EmailId' width='150' format='dMy' textAlign='Left' />
                <ColumnDirective field={ListFieldsStudentRegistration.TelegramGroup} headerText='Telegram Grp' width='150'  textAlign='Left' />
                <ColumnDirective field={ListFieldsStudentRegistration.Qualification} headerText='Qaulification' width='150'  textAlign='Left'></ColumnDirective>
                <ColumnDirective field={ListFieldsStudentRegistration.Courses} headerText='Courses' width='150' textAlign='Left'></ColumnDirective>
                <ColumnDirective field={ListFieldsStudentRegistration.TotalFees} headerText='Total Fees' width='150' textAlign='Left'></ColumnDirective>
              </ColumnsDirective>
              <Inject services={[Page,VirtualScroll,Sort]} />
            </GridComponent>
          </div>
        </div>
      </>
    );
  }
}
