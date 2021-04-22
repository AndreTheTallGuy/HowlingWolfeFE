import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  baseUrl = environment.baseUrl;

  private headers = { headers: new HttpHeaders().set('Content-Type', 'application/json') }

  constructor(private http: HttpClient) { }

  public submitOrder(order: any):Observable<any>{
    return this.http.post(this.baseUrl + `orders/post`, order, this.headers);
  }

  public login(userName: string):Observable<any>{
    return this.http.get(this.baseUrl + `user/${userName}`)
  }

  public getAllOrders():Observable<any>{
    return this.http.get(this.baseUrl + `orders/`)
  }

  public getAllOrdersByDate():Observable<any>{
    return this.http.get(this.baseUrl + `orders/date`)
  }
}
