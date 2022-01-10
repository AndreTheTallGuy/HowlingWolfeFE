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
import { SubscribeService } from 'src/app/services/subscribe.service';
import { GiftCard } from 'src/app/models/GiftCard';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  emptyBoolean: boolean = true;
  infoBoolean: boolean = false;
  tableBoolean: boolean = false;
  stripeCheckout: boolean = false;
  alertBoolean: boolean = false;
  isLoading: boolean = false;
  stripeFailBoolean: boolean = false;
  subscribeEmail: boolean = false;
  couponBoolean: boolean = false;
  couponError: boolean = false;
  giftCardBoolean: boolean = false;
  giftCardError: boolean = false;
  discBoolean: boolean = false;
  
  boatsArray: Boat[] = [];
  orderObj: Order = {order_id:"", customer: {}, boats: []};
  updatedGiftCard: GiftCard = {cardNumber:null, balance:null, email: null};
  
  firstName!: any;
  lastName!: any;
  email!: any;
  phone!: any;

  subTotal: number = 0;
  coupon: string;
  afterCoupon: number;
  giftCardNumber: number;
  giftCardBalance: number;
  giftCardEmail: string;
  projectedBalance: number;
  discount: number;
  goodUntil: Date;
  discountDollars: number;
  total: number = 0;

  couponErrorMsg: string;
  giftCardErrorMsg: string;
  couponList: string[] = [];

  cardNumber: number;
  expMonth: number;
  expYear: number;
  cvc: number;

  stripeFailText: string;
  loadText: string = "Placing your order...";

  subscribeData: any = <any>{};

  private unsubscibe = new Subject();

  constructor(private api: ApiService, private subscribe: SubscribeService, private ngZone: NgZone, private router: Router) { }

  ngOnInit(): void {
    this.api.getAllOrdersToday().subscribe();
    // checks session storage for boats and puts them in boatsArray
    if(sessionStorage.getItem("cartList")){
      this.boatsArray = JSON.parse(sessionStorage.getItem("cartList"));
      if(this.boatsArray.length > 0){
        this.tableBoolean = true;
        this.emptyBoolean = false;
      }}
    this.getTotals();
  }
  // ngDoCheck(){
  //   this.getTotals();  
  // }

  getTotals(){
    // calculates totals
    this.subTotal=0;
    for(let i =0; i< this.boatsArray.length; i++){
      this.subTotal += this.boatsArray[i].price;
    }
    if(this.couponBoolean && this.giftCardBoolean){
      this.discountDollars = this.subTotal * (this.discount/100);
      this.afterCoupon = this.subTotal - this.discountDollars;
      this.discBoolean = true;
      
      if(this.giftCardBalance > this.afterCoupon){
        this.total = 0;
        this.projectedBalance = this.giftCardBalance - this.afterCoupon;
      }else{
        this.total = this.afterCoupon - this.giftCardBalance;
        this.projectedBalance = 0;
      }
      
    }else if(this.couponBoolean){
      this.discountDollars = this.subTotal * (this.discount/100);
      this.total = this.subTotal - this.discountDollars;
    }else if(this.giftCardBoolean){
      if(this.giftCardBalance > this.subTotal){
        this.total = 0;
        this.projectedBalance = this.giftCardBalance - this.subTotal;
      }else{
        this.total = this.subTotal - this.giftCardBalance;
        this.projectedBalance = 0;
      }
    }else {
      this.total = this.subTotal;
    }    
  }

  submitCoupon(){
    // check local storage for coupon list
    if(localStorage.getItem("howlingwolfe")){
      this.couponList = JSON.parse(localStorage.getItem("howlingwolfe"));
      // if list includes coupon, give error
      if(this.couponList.includes(this.coupon)){
        this.couponError = true;
        this.couponErrorMsg = "This code has already been used"
      } else {
        this.verifyCode();
      }
    } else {
      this.verifyCode();
    }
    
  }
  
  verifyCode(){
    this.couponError = false;
    // verify code is in db
    this.api.getCouponByCode(this.coupon).subscribe(res => {
      if(res){
        this.goodUntil = res.goodUntil;
        this.discount = res.discount;
        let today = new Date()        
        
        if(Date.parse(this.goodUntil.toString()) > Date.parse(today.toISOString())){
          // show subtotal and discount view
          this.couponBoolean = true;
          // rerun totals with discount
          this.getTotals();
        } else {
          this.couponError = true;
          this.couponErrorMsg = "Coupon is expired"
        }
      } else {
        this.couponError = true;
        this.couponErrorMsg = "Coupon not found"
      }
      
    })
  }
  
  submitGiftCard(){
    this.api.getGiftCard(this.giftCardNumber).subscribe(res=>{
      
      
      if(res){
        console.log(res.balance);
        
        this.giftCardBalance = res.balance / 100;
        this.giftCardEmail = res.email;
        this.giftCardBoolean = true;
        
        this.getTotals();
      }else {
        this.giftCardError = true;
        this.giftCardErrorMsg = "Gift card not found"
      }
    })
  

  }

  delete(id){
    // deletes a boat from boatsArray and then pushes to session storage
    this.boatsArray = this.boatsArray.filter(item => item.id !== id);
    sessionStorage.setItem("cartList", JSON.stringify(this.boatsArray));
    this.getTotals();
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
      this.infoBoolean = false;
      // constructs a customer object
      const customer: Customer = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        coupon: this.coupon
      }
      // constructs an orderObj object
      this.orderObj.customer = customer;
      if(this.couponBoolean){
        this.boatsArray.forEach(boat => {
          boat.price = boat.price - (this.discountDollars / this.boatsArray.length)
        })
      }
      this.orderObj.boats = this.boatsArray;

      //builds updated gift card
      if(this.giftCardBoolean){
        console.log(this.giftCardNumber);
        this.updatedGiftCard.email = this.giftCardEmail;
        this.updatedGiftCard.cardNumber = this.giftCardNumber;
        this.updatedGiftCard.balance = this.projectedBalance * 100;
      }
      if(this.total == 0){
        this.isLoading = true;
        this.api.submitOrder(this.orderObj).subscribe(res=>{
          if(this.couponBoolean){
            this.saveCoupon();
          }
          if(this.giftCardBoolean){
            this.api.updateGiftCard(this.updatedGiftCard).subscribe(res=>{
            })
          }
          this.isLoading = false;
          sessionStorage.clear();
          this.router.navigate(['/thank-you'])              
        
        })
      }else{
        this.stripeCheckout = true;
      }
    }
    
  }

  emailSubscribe(){
    this.subscribeEmail = !this.subscribeEmail
    console.log(this.subscribeEmail);
    
  }

  stripeSubmit(){
      // validates empty fields
    if(this.cardNumber === undefined || this.expMonth === undefined || this.expYear === undefined || this.cvc === undefined){
      this.stripeFailBoolean = true;
      this.stripeFailText = "All fields are mandatory";
    } else {

      this.stripeCheckout = false;
    this.isLoading = true;
    this.stripeFailBoolean = false;

    console.log(this.subscribeEmail);
    
    if(this.subscribeEmail){
      this.subscribeData.email = this.email;
      this.subscribeToMailChimp();
    }

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
        this.loadText = "Charging Card..."
        // sends charge object to the backend
        this.api.chargeCard(charge).pipe(takeUntil(this.unsubscibe), tap(()=>{
          
        }), switchMap((res: any)=>{
          if(res === "Success"){
            this.loadText = "Finishing up..."
            // if successful, orderObj is submitted to the DB
            return this.api.submitOrder(this.orderObj).pipe(tap(()=>{
              if(this.couponBoolean){
                this.saveCoupon();
              }
              if(this.giftCardBoolean){
                this.api.updateGiftCard(this.updatedGiftCard).subscribe(res=>{
                  console.log(res);
                  
                })
              }
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
            this.stripeFailText = response.error.message;
            this.stripeFailBoolean = true;
            this.stripeCheckout = true;
            this.isLoading = false;
      }
    })
  }); 
  }
  }   

  subscribeToMailChimp(){
    this.subscribe.subscribeToList(this.subscribeData).subscribe(res => {
      console.log("subscribed");
      console.log(this.subscribeData);
    }, err => console.log(err)
    );
  }

  saveCoupon(){
    if(localStorage.getItem("howlingwolfe")){
      this.couponList = JSON.parse(localStorage.getItem("howlingwolfe"));
      this.couponList.push(this.coupon);
      localStorage.setItem('howlingwolfe', JSON.stringify(this.couponList))
    }else {
      this.couponList.push(this.coupon);
      localStorage.setItem('howlingwolfe', JSON.stringify(this.couponList))
    }
  }
 
  ngOnDestroy(){
    this.unsubscibe.next();
    this.unsubscibe.complete();
  }
}
