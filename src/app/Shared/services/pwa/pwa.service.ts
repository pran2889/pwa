import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  constructor(private httpClient: HttpClient) { }

  getAllOrders = () => {
    const url = environment.apiUrl + `/api/Order/GetAllOrderDetails`;
    return this.httpClient.get(url).pipe(map(x => x));
  }
  getOrderByStatus = (status) => {
    const url = environment.apiUrl + `/api/Order/GetOrderDetailsByStatus`;
    const data = {
      iOrderStatusName: status
    };
    return this.httpClient
      .post(url, JSON.stringify(data), this.header())
      .pipe(map(x => x));
  }
  getProductsByOrderID = () => {
    const url = environment.apiUrl + `/api/Order/GetProductsByOrderID`;
    return this.httpClient.get(url).pipe(map(x => x));
  }
  getUserDetailsByOrderID = () => {
    const url = environment.apiUrl + `/api/Order/GetUserDetailsByOrderID`;
    return this.httpClient.get(url).pipe(map(x => x));
  }

  public uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  orderInsert = (model) => {
    const data = {
      OrderStatus: model.OrderStatus,
      iStartDate: model.OrderDate,
      iLoginID: model.User,
      iCreatedBy: model.createdby,
      iSessionID: (localStorage.getItem(`userSession`) &&  localStorage.getItem(`userSession`) === null) ? localStorage.getItem(`userSession`) : this.uuidv4(),
      iExpectedDeliveryDate: model.DeliveryDate,
      iOrderQuantity: model.Quantity,
      iSubTotal: model.Total ? model.Total : 0,
      iProductInAvailableInQuantitiesID: model.availableQty ? model.availableQty : 1
    };
    const url = `${environment.apiUrl}/api/order/Order_Insert`;
    return this.httpClient.post(url, data).pipe(map(x => x));
  }
  orderUpdate = (model) => {
    const data = {
      OrderStatus: model.OrderStatus,
      iStartDate: model.OrderDate,
      iExpectedDeliveryDate: model.DeliveryDate,
      iOrderQuantity: Number(model.Quantity),
      iDiscountPercentage: model.Discount ? model.Discount : 0,
      iValueInPercentage: model.ValueInPercentage ? model.ValueInPercentage : 0,
      iEndDate: model.EndDate ? model.EndDate : null,
      iCouponID: model.CouponID ? model.CouponID : null,
      iOrderId: model.OrderID
    };
    const url = `${environment.apiUrl}/api/order/Order_Update`;
    return this.httpClient.post(url, data).pipe(map(x => x));
  }
  orderDelete = (model) => {
    const data = {
      iOrderId: model.OrderID,
    };
    const url = `${environment.apiUrl}/api/order/Order_Delete`;
    return this.httpClient.post(url, data).pipe(map(x => x));
  }

  public header() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }
}

