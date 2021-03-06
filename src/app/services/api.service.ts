import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Charge } from '../models/Charge';
import { Coupon } from '../models/Coupon';
import { Customer } from '../models/Customer';
import { TripAvail } from '../models/TripAvail';

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
    return this.http.get(this.baseUrl + `accounts/${userName}`, {responseType: 'text'});
  }

  public getAllOrders():Observable<any>{
    return this.http.get(this.baseUrl + `orders/`);
  }

  public getAllOrdersByDate(date: Date):Observable<any> {
    return this.http.get(this.baseUrl + `orders/date/${date.toISOString()}`);
  }

  public getAllOrdersUpcoming():Observable<any>{
    return this.http.get(this.baseUrl + `orders/upcoming`);
  }
 
  public getAllOrdersToday():Observable<any>{
    return this.http.get(this.baseUrl + `orders/today`);
  }

  public getMaxOrderId():Observable<any>{
    return this.http.get(this.baseUrl + 'orders/maxId');
  }

  public deleteBoat(id:string):Observable<any>{
    return this.http.delete(this.baseUrl + `boats/${id}`, {responseType: 'text'});
  }

  public sendEmail(type:string, customer: Customer):Observable<any>{
    return this.http.post(this.baseUrl + `email/email?type=${type}`, customer, {responseType: 'text'});
  }

  public chargeCard(charge: Charge): Observable<any>{
       return this.http.post(this.baseUrl + `payment/charge`, charge, {responseType: 'text'});
  }

  public deleteCoupon(id: number): Observable<any>{
    return this.http.delete(this.baseUrl + `coupon/delete/${id}`, {responseType: 'text'});
  }

  public getCouponByCode(code: string): Observable<any>{
    return this.http.get(this.baseUrl + `coupon/${code}`);
  }

  public getAllCoupons(): Observable<any>{
    return this.http.get(this.baseUrl + `coupon/all`);
  }

  public postNewCoupon(coupon: Coupon): Observable<any> {
    return this.http.post(this.baseUrl + `coupon/post`, coupon, {responseType: 'text'});
  }

  public submitGiftCard(giftObj: any):Observable<any>{
    return this.http.post(this.baseUrl + `giftcard/post`, giftObj, {responseType: 'text'});
  }

  public getAllGiftCards(): Observable<any> {
    return this.http.get(this.baseUrl + `giftcard/all`);
  }

  public getGiftCard(cardNumber: number): Observable<any> {
    return this.http.get(this.baseUrl + `giftcard/${cardNumber}`);
  }

  public updateGiftCard(giftCard: any):Observable<any> {
    return this.http.put(this.baseUrl + `giftcard/update`, giftCard, {responseType: 'text'} );
  }

  public deleteGiftCard(cardNumber: number): Observable<any> {
    return this.http.delete(this.baseUrl + `giftcard/delete/${cardNumber}`, {responseType: 'text'});
  }

  public getTripAvail(subType: string): Observable<any> {
    return this.http.get(this.baseUrl + `tripavail/${subType}`);
  }

  public updateTripAvail(availObj: TripAvail): Observable<any> { 
    return this.http.put(this.baseUrl + `tripavail/update`, availObj, {responseType: 'text'});
  }
}
