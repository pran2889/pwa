import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { IIncomingModel } from './pwa.model';
import { PwaService } from 'src/app/Shared/services/pwa/pwa.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { MediumModalComponent } from 'src/app/Shared/components/modals/medium-modal/medium-modal.component';

@Component({
  selector: 'app-pwa',
  templateUrl: './pwa.component.html',
  styleUrls: ['./pwa.component.scss']
})
export class PwaComponent implements OnInit, OnDestroy {
  public displayedColumns = [
    'id',
    'employee_name',
    'employee_salary',
    'employee_age',
    'profile_image'
  ];
  public getHeader = [
    { key: 'id', value: '#Employee Id' },
    { key: 'employee_name', value: 'Employee Name' },
    { key: 'employee_salary', value: 'Salary' },
    { key: 'employee_age', value: 'Age' },
    { key: 'profile_image', value: 'Photo' }
  ];

  public filterArray: string[] = [];
  public incomingEmployeeModel: IIncomingModel = {} as IIncomingModel;
  public dataSource: MatTableDataSource<object>;
  public EditEmployeeItem: string[] = [];
  public DeleteEmployeeDetails: string[] = [];
  public searchInfo: any[] = [];
  public p: number;
  public TempDetails: string[] = [];

  @ViewChild('largeEmployeeModal') largeEmployeeModal: MediumModalComponent;
  @ViewChild('DeleteModal') DeleteModal: MediumModalComponent;

  public getAllIncomingEmployeesSubscription: Subscription;
  public deleteEmployeeSubscription: Subscription;
  public UpdateEmployeeSubscription: Subscription;
  Button: string;

  constructor(
    private pwaService: PwaService,
    private snackbar: MatSnackBar,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getAllIncomingEmployees();
  }

  getAllIncomingEmployees = () => {
    this.getAllIncomingEmployeesSubscription = this.pwaService
      .getAllEmployees()
      .subscribe(response => {
        this.searchInfo = this.TempDetails = response[`data`];
      });
  }

  Employee = (modeldata, input) => {
    modeldata.Input = input;
    modeldata.createdby = `employee`;
    switch (input) {
      case 'Insert':
        this.pwaService.employeeInsert(modeldata).subscribe(response => {
          if (response && response[`data`]) {
            this.searchInfo.push({
              id: response['data']['id'],
              employee_name: response['data']['name'],
              employee_salary: response['data']['salary'],
              employee_age: response['data']['age'],
            });
            this.snackbar.open('Employee ' + input + 'ed Successfully', 'Close', {
              duration: 3000
            });
          } else {
            this.snackbar.open('Employee ' + input + 'ion Failed', 'Close', {
              duration: 3000
            });
          }
        });
        break;
      case 'Update':
        this.pwaService.employeeUpdate(modeldata).subscribe(response => {
          if (response['status'] == "success") {
            this.snackbar.open('Employee ' + input + 'ed Successfully', 'Close', {
              duration: 3000
            });
          } else {
            this.snackbar.open('Employee ' + input + 'ion Failed', 'Close', {
              duration: 3000
            });
          }
        });
        break;
      case 'Delete':
        this.pwaService.employeeDelete(modeldata).subscribe(response => {
          if (response && response[`data`]) {
            this.snackbar.open('Employee ' + input + 'ed Successfully', 'Close', {
              duration: 3000
            });
          } else {
            this.snackbar.open('Employee ' + input + 'ion  Failed', 'Close', {
              duration: 3000
            });
          }
        });
        break;
    }
    this.largeEmployeeModal.hide();
  }

  addNew = () => {
    this.Button = 'Insert';
    this.incomingEmployeeModel = {} as IIncomingModel;
    this.largeEmployeeModal.show();
  }

  startEdit = (event, EmployeeDetails) => {
    this.Button = 'Update';
    EmployeeDetails.DeliveryDate = new Date(EmployeeDetails.DeliveryDate)
    this.incomingEmployeeModel = EmployeeDetails;
    this.largeEmployeeModal.show();
  }

  confirmPopUp = item => {
    this.DeleteModal.show();
    this.DeleteEmployeeDetails = item;
  }
  // Confirm Delete Employee
  confirmDelete = () => {
    this.pwaService.employeeDelete(this.DeleteEmployeeDetails).subscribe(
      response => {
        this.snackbar.open('Employee deleted Successfully', 'Close', {
          duration: 3000
        });
        this.DeleteModal.hide();
        const index = this.searchInfo.findIndex(
          x => x['id'] === this.DeleteEmployeeDetails['id']
        );
        if (index !== -1) {
          this.searchInfo.splice(index, 1);
        }
      },
      error => {
        this.snackbar.open('Employee deletion failed', 'Close', {
          duration: 3000
        });
        this.DeleteModal.hide();
      }
    );
  }

  // Filter Table
  filterTable = (): void => {
    let counter = 0;
    this.getHeader.map(item => {
      if (item && this.filterArray[item.key]) {
        const Dat = counter > 0 ? this.searchInfo : this.TempDetails;
        this.searchInfo = Dat.filter(
          x =>
            x[item.key] &&
            x[item.key]
              .toString()
              .toLowerCase()
              .indexOf(String(this.filterArray[item.key]).toLowerCase()) !== -1
        );
        counter++;
      }
    });
    this.searchInfo = counter === 0 ? this.TempDetails : this.searchInfo;
  }

  // Used for NgFor to unique Id Everytym
  trackByFn = item => {
    return item.id; // unique id corresponding to the item
  }

  ngOnDestroy() {
    this.getAllIncomingEmployeesSubscription
      ? this.getAllIncomingEmployeesSubscription.unsubscribe()
      : null;
    this.deleteEmployeeSubscription
      ? this.deleteEmployeeSubscription.unsubscribe()
      : null;
    this.UpdateEmployeeSubscription
      ? this.UpdateEmployeeSubscription.unsubscribe()
      : null;
  }
}
