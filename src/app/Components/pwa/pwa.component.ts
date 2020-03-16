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
    'OrderID',
    'OrderStatus',
    'OrderDate',
    'User',
    'DeliveryDate',
    'Quantity',
    'Total',
    'actions'
  ];
  public getHeader = [
    { key: 'OrderID', value: '#Order Id' },
    { key: 'OrderStatus', value: 'Order Status' },
    { key: 'OrderDate', value: 'Order Date' },
    { key: 'User', value: 'User' },
    { key: 'DeliveryDate', value: 'Delivery Date' },
    { key: 'Quantity', value: 'Quantity' },
    { key: 'Total', value: 'Total' }
  ];

  public filterArray: string[] = [];
  public incomingOrderModel: IIncomingModel = {} as IIncomingModel;
  public dataSource: MatTableDataSource<object>;
  public EditOrderItem: string[] = [];
  public DeleteOrderDetails: string[] = [];
  public searchInfo: any[] = [];
  public p: number;
  public TempDetails: string[] = [];

  @ViewChild('largeOrderModal') largeOrderModal: MediumModalComponent;
  @ViewChild('DeleteModal') DeleteModal: MediumModalComponent;

  public getAllIncomingOrdersSubscription: Subscription;
  public deleteOrderSubscription: Subscription;
  public UpdateOrderSubscription: Subscription;
  Button: string;

  constructor(
    private pwaService: PwaService,
    private snackbar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getAllIncomingOrders();
  }

  getAllIncomingOrders = () => {
    this.getAllIncomingOrdersSubscription = this.pwaService
      .getOrderByStatus('incoming')
      .subscribe(response => {
        this.searchInfo = this.TempDetails = response[`data`];
        // this.dataSource = new MatTableDataSource(response[`data`]);
        // this.ref.detectChanges();
        // this.dataSource.sort = this.sort;
      });
  }
  Order = (modeldata, input) => {
    modeldata.Input = input;
    modeldata.createdby = `employee`;
    switch (input) {
      case 'Insert':
        this.pwaService.orderInsert(modeldata).subscribe(response => {
          if (response && response[`data`]) {
            this.searchInfo.push({
              OrderID: response[`data`][0][`OutId`],
              OrderStatus: modeldata.OrderStatus,
              OrderDate: this.datePipe.transform(new Date(modeldata.OrderDate), 'yyyy-MM-dd h:mm a'),
              User: modeldata.User,
              DeliveryDate: this.datePipe.transform(new Date(modeldata.DeliveryDate), 'yyyy-MM-dd h:mm a'),
              Total: modeldata.Total ? modeldata.Total : 0,
              Quantity: modeldata.Quantity,
            });
            this.snackbar.open('Order' + input + 'ed Successfully', 'Close', {
              duration: 3000
            });
          } else {
            this.snackbar.open('Order ' + input + 'ion Failed', 'Close', {
              duration: 3000
            });
          }
        });
        break;
      case 'Update':
        this.pwaService.orderUpdate(modeldata).subscribe(response => {
          if (response && response[`data`]) {
            this.snackbar.open('Order' + input + 'ed Successfully', 'Close', {
              duration: 3000
            });
          } else {
            this.snackbar.open('Order ' + input + 'ion Failed', 'Close', {
              duration: 3000
            });
          }
        });
        break;
      case 'Delete':
        this.pwaService.orderDelete(modeldata).subscribe(response => {
          if (response && response[`data`]) {
            this.snackbar.open('Order ' + input + 'ed Successfully', 'Close', {
              duration: 3000
            });
          } else {
            this.snackbar.open('Order ' + input + 'ion  Failed', 'Close', {
              duration: 3000
            });
          }
        });
        break;
    }
    this.largeOrderModal.hide();
  }

  addNew = () => {
    this.Button = 'Insert';
    this.incomingOrderModel = {} as IIncomingModel;
    this.incomingOrderModel.OrderStatus = `incoming`;
    this.incomingOrderModel.OrderDate = new Date();
    this.incomingOrderModel.DeliveryDate = new Date();
    this.largeOrderModal.show();
  }

  startEdit = (event, orderDetails) => {
    this.Button = 'Update';
    orderDetails.DeliveryDate = new Date(orderDetails.DeliveryDate)
    this.incomingOrderModel = orderDetails;
    this.largeOrderModal.show();
  }

  confirmPopUp = item => {
    this.DeleteModal.show();
    this.DeleteOrderDetails = item;
  }
  // Confirm Delete Order
  confirmDelete = () => {
    this.pwaService.orderDelete(this.DeleteOrderDetails).subscribe(
      response => {
        this.snackbar.open('Order deleted Successfully', 'Close', {
          duration: 3000
        });
        this.DeleteModal.hide();
        const index = this.searchInfo.findIndex(
          x => x[`OrderID`] === response[`data`][0][`OutId`]
        );
        if (index !== -1) {
          this.searchInfo.splice(index, 1);
        }
      },
      error => {
        this.snackbar.open('Order deletion failed', 'Close', {
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
    this.getAllIncomingOrdersSubscription
      ? this.getAllIncomingOrdersSubscription.unsubscribe()
      : null;
    this.deleteOrderSubscription
      ? this.deleteOrderSubscription.unsubscribe()
      : null;
    this.UpdateOrderSubscription
      ? this.UpdateOrderSubscription.unsubscribe()
      : null;
  }
}
