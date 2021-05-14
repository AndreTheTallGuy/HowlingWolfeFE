import { HttpClient } from '@angular/common/http';
import { Component, Injectable, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Charge } from 'src/app/models/Charge';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public submitOrder(order: any):Observable<any>{
    return this.http.post(this.baseUrl + `orders/post`, order, {responseType: 'text'}).pipe(catchError(() => of({ id: 0, result: 'submitOrder AFTER'})))
  }

  public chargeCard(charge: Charge, expectedResponce?: string): Observable<any>{
    return this.http.post(this.baseUrl + `payment/charge`, charge, {responseType: 'text'}).pipe(catchError(() => of(expectedResponce)))
  }
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [ApiService]
})
export class TestComponent implements OnDestroy {
  testValue: number;

  private unsubscribe = new Subject();

  constructor(private api: ApiService, private ngZone: NgZone) {}

  stripeSubmit_1() {
    this.testValue = 10;
    console.log(this.testValue);
    console.log('stripeSubmit_1');

    (<any>window).Stripe.card.createToken({
      number: 4242424242424242,
      exp_month: 12,
      exp_year: 2024,
      cvc: 123
    }, (status: number, response: any) => {
      if (status === 200) {
        this.testValue = 11;
        console.log('createToken OK');
        console.log(this.testValue);
        console.log(response);
      } else {
        this.testValue = 12;
        console.log(this.testValue);
        console.log('createToken ERROR');
        console.log(response.error.message);
      }
    });
  }

  stripeSubmit_2() {
    this.testValue = 20;
    console.log(this.testValue);
    console.log('stripeSubmit_2');
    
    (<any>window).Stripe.card.createToken({
      number: 4242424242424242,
      exp_month: 12,
      exp_year: 2024,
      cvc: 123
    }, (status: number, response: any) => {
      if (status === 200) {
        this.testValue = 21;
        console.log(this.testValue);
        console.log('createToken OK');

        let charge: Charge = {
          token: response.id,
          price: 0
        }
        // this.chargeCard(token);
        this.api.chargeCard(charge, "Success").subscribe(res => { 
          this.testValue = 23;
          console.log(this.testValue);
          console.log('chargeCard_2');

          if (res === "Success") {
            console.log('chargeCard_2 Success');
            this.api.submitOrder({}).subscribe(res => {
              this.testValue = 24;
              console.log(this.testValue);
              console.log('chargeCard_2 submitOrder_2');
            });
          } else {
            this.testValue = 25;
            console.log(this.testValue);
            console.log('chargeCard_2 ERROR');
          }
        })
      } else {
        this.testValue = 22;
        console.log(this.testValue);
        console.log('createToken ERROR');
        console.log(response.error.message);
      }
    });
  }

  stripeSubmit_3() {
    this.testValue = 30;
    console.log(this.testValue);
    console.log('stripeSubmit_3');
    
    (<any>window).Stripe.card.createToken({
      number: 4242424242424242,
      exp_month: 12,
      exp_year: 2024,
      cvc: 123
    }, (status: number, response: any) => {
      this.ngZone.run(() => {
        console.log('ngZone ENTER');
        if (status === 200) {
          this.testValue = 31;
          console.log(this.testValue);
          console.log('createToken OK');
  
          let charge: Charge = {
            token: response.id,
            price: 0
          }
          // this.chargeCard(token);
          this.api.chargeCard(charge, "Success").subscribe(res => { 
            this.testValue = 33;
            console.log(this.testValue);
            console.log('chargeCard_3');
  
            if (res === "Success") {
              console.log('chargeCard_3 Success');
              this.api.submitOrder({}).subscribe(res => {
                this.testValue = 34;
                console.log(this.testValue);
                console.log('chargeCard_3 submitOrder_3');
              });
            } else {
              this.testValue = 35;
              console.log(this.testValue);
              console.log('chargeCard_3 ERROR');
            }
          })
        } else {
          this.testValue = 32;
          console.log(this.testValue);
          console.log('createToken ERROR');
          console.log(response.error.message);
        }
        console.log('ngZone LEAVE');
      })
    });
  }

  stripeSubmit_4() {
    this.testValue = 40;
    console.log(this.testValue);
    console.log('stripeSubmit_4');
    
    (<any>window).Stripe.card.createToken({
      number: 4242424242424242,
      exp_month: 12,
      exp_year: 2024,
      cvc: 123
    }, (status: number, response: any) => {
      this.ngZone.run(() => {
        console.log('ngZone ENTER');
        if (status === 200) {
          this.testValue = 41;
          console.log(this.testValue);
          console.log('createToken OK');
  
          let charge: Charge = {
            token: response.id,
            price: 0
          }
          // this.chargeCard(token);
          this.api.chargeCard(charge, "Success").pipe(takeUntil(this.unsubscribe), tap(() => {
            this.testValue = 43;
            console.log(this.testValue);
            console.log('chargeCard_4');
          }), switchMap((res1: any) => {
            if (res1 === "Success") {
              console.log('chargeCard_4 Success');
              return this.api.submitOrder({}).pipe(tap(() => {
                this.testValue = 44;
                console.log(this.testValue);
                console.log('chargeCard_4 submitOrder_3');
              }))
            } else {
              return of(res1).pipe(tap(() => {
                this.testValue = 45;
                console.log(this.testValue);
                console.log('chargeCard_4 ERROR');
              }))
            }
          })).subscribe()
        } else {
          this.testValue = 42;
          console.log(this.testValue);
          console.log('createToken ERROR');
          console.log(response.error.message);
        }
        console.log('ngZone LEAVE');
      })
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
}
}
