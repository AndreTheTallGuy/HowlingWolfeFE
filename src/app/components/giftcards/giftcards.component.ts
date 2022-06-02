import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Charge } from 'src/app/models/Charge';
import { ApiService } from 'src/app/services/api.service';
import { of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SubscribeService } from 'src/app/services/subscribe.service';
import { GiftObj } from 'src/app/models/GiftObj';
import { GiftCard } from 'src/app/models/GiftCard';


@Component({
  selector: 'app-giftcards',
  templateUrl: './giftcards.component.html',
  styleUrls: ['./giftcards.component.css']
})
export class GiftcardsComponent implements OnInit {

  mainBoolean: boolean = true;
  isLoading: boolean = false;
  stripeFailBoolean: boolean = false;
  stripeCheckout: boolean = false;
  couponBoolean: boolean = false;
  couponError: boolean = false;

  couponErrorMsg: string = '';
  coupon: string;
  subTotal: number;
  discount: number;


  loadText: string = "Placing your order...";

  stripeFailText: string;
  cardNumber: number;
  expMonth: number;
  expYear: number;
  cvc: number;

  giftObj: GiftObj;
  giftCard: GiftCard;
  // giftCardNumber: number;

  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  message: string = null;
  amount: number = 60;
  dollarWidth: string = "125px";

  private unsubscibe = new Subject();
  goodUntil: Date;
  discountType: string;
  couponList: any;
  discountDollars: number;
  total: number;
  goodForGC: boolean = false;
  usedCoupon: boolean = false;

  constructor(private ngZone: NgZone, private router: Router, private api: ApiService,) { }

  ngOnInit(): void {
  }

  ngDoCheck():void {
    switch(this.amount.toString().length){
      case 1:
        this.dollarWidth = "120px";
        break;
      case 2:
        this.dollarWidth = "120px";
        break;
      case 3:
        this.dollarWidth = "125px";
        break;
      case 4:
        this.dollarWidth = "155px";
        break;
      case 5:
        this.dollarWidth = "190px";
        break;
    }
    if(this.couponBoolean){
      this.getTotals();
    }
  }

  submit(){
    this.mainBoolean = false;
    this.stripeCheckout = true;
    this.objectBuilder();
  }

  objectBuilder(){

    let tempNum = Math.floor(10000000 + Math.random() * 90000000);
    
    this.api.getGiftCard(tempNum).subscribe(res=>{
      
      if(res !== null){
        this.objectBuilder();
      } else {
        this.giftCard = {
          cardNumber: tempNum, 
          balance:this.amount * 100, 
          email: this.recipientEmail,
          coupon: this.coupon 
        };
        this.giftObj = {
          giftCard: this.giftCard, 
          fromName: this.senderName, 
          fromEmail: this.senderEmail, 
          message: this.message
        };
        
      }
    }, err => {
      this.stripeCheckout = false;
      this.mainBoolean = true;
    });
    
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
          price: this.giftCard.balance,
          orderId: this.giftCard.cardNumber
        }
        this.loadText = "Charging Card..."
        // sends charge object to the backend
        this.api.chargeCard(charge).pipe(takeUntil(this.unsubscibe), tap(()=>{
          
        }), switchMap((res: any)=>{
          if(res === "Success"){
            this.loadText = "Finishing up..."
            // if successful, giftObj is submitted to the DB
            return this.api.submitGiftCard(this.giftObj).pipe(tap(()=>{
              this.isLoading = false;
              sessionStorage.clear();
              this.router.navigate(['/thank-you'])    
            }))
          } else {
            return of(res).pipe(tap(()=>{
              console.log(res);
              
            this.stripeFailText = res;
            this.stripeFailBoolean = true;
            this.stripeCheckout = true;
            this.isLoading = false;
            }))
          }
          
        })).subscribe();
      }else {
        //gives error message and prompts for checkout
            this.stripeFailText = response.error.message;
            this.stripeFailBoolean = true;
            this.stripeCheckout = true;
            this.isLoading = false;
      }
    })
  }); 
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
        this.discountType = res.discountType;
        this.goodForGC = res.goodForGC;
        const today = new Date()    
        
        // compare trip dates to coupon valid dates
        if(this.goodForGC){
          if(Date.parse(this.goodUntil.toString()) > Date.parse(today.toISOString())){
            // show subtotal and discount view
            this.couponBoolean = true;
            // rerun totals with discount
            this.getTotals();
          } else {
            this.couponError = true;
            this.couponErrorMsg = "Coupon is expired"
          }
        }else {
          this.couponError = true;
          this.couponErrorMsg = "Coupon is not good for gift cards"
        }
      } else {
        this.couponError = true;
        this.couponErrorMsg = "Coupon not found"
      }
    })
  }

  getTotals(){
    if(this.couponBoolean){
      this.discountDollars = this.amount * (this.discount/100);
      this.total = this.amount - this.discountDollars;
    } else {
      this.total = this.amount;
    }
  }
  
  ngOnDestroy(){
    this.unsubscibe.next();
    this.unsubscibe.complete();
  }
}
