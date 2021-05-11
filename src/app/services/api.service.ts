import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Charge } from '../models/Charge';
import { Customer } from '../models/Customer';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  baseUrl = environment.baseUrl;

  private headers = { headers: new HttpHeaders().set('Content-Type', 'application/json') }

  constructor(private http: HttpClient) { }

  public submitOrder(order: any):Observable<any>{
    return this.http.post(this.baseUrl + `orders/post`, order, {responseType: 'text'});
  }

  public login(userName: string):Observable<any>{
    return this.http.get(this.baseUrl + `accounts/${userName}`, {responseType: 'text'})
  }

  public getAllOrders():Observable<any>{
    return this.http.get(this.baseUrl + `orders/`)
  }

  public getAllOrdersByDate():Observable<any>{
    return this.http.get(this.baseUrl + `orders/date`)
  }
 
  public getAllOrdersToday():Observable<any>{
    return this.http.get(this.baseUrl + `orders/today`)
  }

  public sendEmail(type:string, customer: Customer):Observable<any>{
    return this.http.post(this.baseUrl + `email/email?type=${type}`, customer, {responseType: 'text'});
  }

  public chargeCard(charge: Charge): Observable<any>{
    return this.http.post(this.baseUrl + `payment/charge`, charge, {responseType: 'text'})
  }
}
