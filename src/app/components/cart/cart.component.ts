import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Order } from 'src/app/models/Order';
import { Customer } from 'src/app/models/Customer';
import { Boat } from '../../models/Boat';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Charge } from 'src/app/models/Charge';
import { of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  infoBoolean: boolean = false;
  emptyBoolean: boolean = false;
  tableBoolean: boolean = false;
  stripeCheckout: boolean = false;
  alertBoolean: boolean = false;
  isLoading: boolean = false;
  stripeFailBoolean: boolean = false;

  boatsArray: Boat[] = [];
  orderObj: Order = {order_id:"", customer: {}, boats: []};
  
  firstName!: any;
  lastName!: any;
  email!: any;
  phone!: any;

  subTotal: number = 0;
  total: number = 0;

  cardNumber: number;
  expMonth: number;
  expYear: number;
  cvc: number;

  stripeFailText: string;

  private unsubscibe = new Subject();

  constructor(private api: ApiService, private ngZone: NgZone, private router: Router) { }

  ngOnInit(): void {
    this.api.getAllOrders().subscribe();
    // checks session storage for boats and puts them in boatsArray
    if(sessionStorage.getItem("cartList")){
      this.boatsArray = JSON.parse(sessionStorage.getItem("cartList"));
      this.tableBoolean = true;
      } else {
        this.emptyBoolean = true;
    }
  }
  ngDoCheck(){
    this.getTotals();  
  }

  getTotals(){
    // calculates totals
    // originally coded for a sub total, taxes, and total but currently only total is needed
    this.subTotal=0;
    for(let i =0; i< this.boatsArray.length; i++){
      this.subTotal += this.boatsArray[i].price;
    }
    
    this.total = this.subTotal;
  }

  delete(id){
    // deletes a boat from boatsArray and then pushes to session storage
    this.boatsArray = this.boatsArray.filter(item => item.id !== id);
    sessionStorage.setItem("cartList", JSON.stringify(this.boatsArray));
  }

  checkOut(){
    this.infoBoolean = true;
    this.tableBoolean = false;
  }

  infoSubmit(){
    // validates empty fields
    if(this.firstName == "" || this.lastName == "" || this.email == "" || this.phone == "" || this.firstName == undefined || this.lastName == undefined || this.email == undefined || this.phone == undefined){
      this.alertBoolean = true;
    } else {
      this.alertBoolean=false;
      this.stripeCheckout = true;
      this.infoBoolean = false;
      // constructs a customer object
      const customer: Customer = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone
      }
      // constructs an orderObj object
      this.orderObj.customer = customer;
      this.orderObj.boats = this.boatsArray;
      
    }
    
  }

  stripeSubmit(){
    this.stripeCheckout = false;
    this.isLoading = true;
    this.stripeFailBoolean = false;

    // sends CC info to stripe and gets back a token
    (<any>window).Stripe.card.createToken({
      number: this.cardNumber,
      exp_month: this.expMonth,
      exp_year: this.expYear,
      cvc: this.cvc
    }, (status: number, response: any) => {
      this.ngZone.run(() => {
      if (status === 200) {
        let charge: Charge = {
          token: response.id,
          price: this.total
        }
        // sends charge object to the backend
        this.api.chargeCard(charge).pipe(takeUntil(this.unsubscibe), tap(()=>{
          
        }), switchMap((res: any)=>{
          if(res === "Success"){
            // if successful, orderObj is submitted to the DB
            return this.api.submitOrder(this.orderObj).pipe(tap(()=>{
              this.isLoading = false;
              sessionStorage.clear();
              this.router.navigate(['/thank-you'])              
            }))
          } else {
            return of(res).pipe(tap(()=>{
            this.stripeFailText = res;
            this.stripeFailBoolean = true;
            this.stripeCheckout = true;
            this.isLoading = false;
            }))
          }
          
        })).subscribe();
      }else {
        console.log(response.error.message);
        
      }
    })
  }); 
  }   
 
  ngOnDestroy(){
    this.unsubscibe.next();
    this.unsubscibe.complete();
  }
}
