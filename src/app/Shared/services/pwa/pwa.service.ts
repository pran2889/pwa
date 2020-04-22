import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  constructor(private httpClient: HttpClient) { }

  getAllEmployees = () => {
    const url = environment.apiUrl + `/employee.json`;
    return this.httpClient.get(url).pipe(map(x => x));
  }
  getEmployeeById = (empId) => {
    const url = environment.apiUrl + `/employee.json`;
    const data = {
      id: empId
    };
    return this.httpClient
      .post(url, JSON.stringify(data), this.header())
      .pipe(map(x => x));
  }

  public uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  employeeInsert = (model) => {
    const data = {
      name: model.name,
      salary: model.salary,
      age: model.age
    };
    const url = `${environment.apiUrl}/employee.json`;
    return this.httpClient.post(url, data).pipe(map(x => x));
  }
  employeeUpdate = (model) => {
    const data = {
      name: model.name,
      salary: model.salary,
      age: model.age
    };
    const url = `${environment.apiUrl}/employee/` + model.id + `.json`;
    return this.httpClient.put(url, data).pipe(map(x => x));
  }
  employeeDelete = (model) => {
    const url = `${environment.apiUrl}/employee/` + model.id + `.json`;
    return this.httpClient.delete(url).pipe(map(x => x));
  }

  public header() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }
}

