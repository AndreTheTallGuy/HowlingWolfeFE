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
import { ThisReceiver } from '@angular/compiler';

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
  giftCardDebit: number;
  discount: number;
  goodUntil: Date;
  discountDollars: number;
  total: number = 0;
  priceRemainder:number = 0;
  gcRemainder: number = 0;
  gcSingleDebit: number = 0;
  totalDebit:number = 0;
  arrLength:number = 0;

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
        this.giftCardDebit = this.afterCoupon;
        this.total = 0;
        this.projectedBalance = this.giftCardBalance - this.afterCoupon;
        console.log(this.total);
      }else{
        this.total = this.afterCoupon - this.giftCardBalance;
        this.giftCardDebit = this.giftCardBalance;
        this.projectedBalance = 0;
        console.log(this.total);
        console.log("calculating totals");
        console.log(this.boatsArray);
        this.boatsArray.forEach(boat => console.log(boat.price));
    
      }
      
    }else if(this.couponBoolean){
      this.discountDollars = this.subTotal * (this.discount/100);
      this.total = this.subTotal - this.discountDollars;
      console.log(this.total);
      
    }else if(this.giftCardBoolean){
      if(this.giftCardBalance > this.subTotal){
        this.giftCardDebit = this.subTotal;
        this.total = 0;
        this.projectedBalance = this.giftCardBalance - this.subTotal;
        console.log(this.total);
        
        
      }else{
        this.total = this.subTotal - this.giftCardBalance;
        this.giftCardDebit = this.giftCardBalance;
        this.projectedBalance = 0;
        console.log(this.total);
        
        
      }
    }else {
      this.total = this.subTotal;
    }    
    console.log("get totals");
    console.log(this.boatsArray);
    this.boatsArray.forEach(boat => console.log(boat.price))
    console.log("giftCardDebit "+ this.giftCardDebit);
    
    
    
    
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
        console.log(res.balance/100);
        
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
    console.log("check out");
    console.log(this.boatsArray);
    this.boatsArray.forEach(boat => console.log(boat.price))
    
    
    
  }

  infoSubmit(){
    console.log("boatsArray Very First");
      console.log(this.boatsArray);
      this.boatsArray.forEach(boat => console.log(boat.price))
      
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
      console.log("boatsArray First");
      console.log(this.boatsArray);
      this.boatsArray.forEach(boat => console.log(boat.price))
      
      console.log(this.total);
      this.arrLength = this.boatsArray.length;
      
      
      if(this.couponBoolean && this.giftCardBoolean){
        console.log("both true");
        
        if(this.total === 0){
          this.boatsArray.forEach(boat=> {
            boat.gcDebit = boat.price * 100;
          });
          this.boatsArray.forEach(boat => {boat.price = 0;
            boat.discount = (this.discountDollars / arrLength) *100;
            boat.giftCard = this.giftCardNumber;
            console.log(boat);
            
          })
        }else{
          this.totalDebit = (this.discountDollars + this.giftCardDebit) / this.arrLength; 
          
          this.boatsArray.forEach(boat => {
            let price = boat.price;
            console.log(price);
            //determines individual boat price after giftcard is applied
            price = this.priceResolver(price, this.giftCardDebit, true);
            console.log("giftcards done");
            
            // determines individual boat price after coupon is applied
            price = this.priceResolver(price, this.discountDollars ) * 100;
            console.log("coupons done");
            console.log("final price" + price);
            console.log(boat);
            
            boat.price = price;
            boat.gcDebit = this.gcSingleDebit * 100;
            boat.discount = (this.discountDollars / this.arrLength) *100;
            boat.giftCard = this.giftCardNumber;
          })
          
        }
      }else if(this.couponBoolean){
        this.totalDebit = this.discountDollars / this.arrLength;
        this.boatsArray.forEach(boat => {
          boat.price = this.priceResolver(boat.price, this.totalDebit ) * 100;
          boat.discount = this.totalDebit *100;
          console.log(boat.price);
          console.log(boat);
          
        })
      }else if(this.giftCardBoolean){
        if(this.total == 0){
          this.boatsArray.forEach(boat=> {
            boat.gcDebit = boat.price *100;
          });
          this.boatsArray.forEach(boat => {boat.price = 0;
            boat.giftCard = this.giftCardNumber;
            console.log(boat);
            
          })
        }
      }else{
        this.boatsArray.forEach(boat=>{
          boat.gcDebit = boat.price - (boat.price * (this.discount/100));})
        this.boatsArray.forEach(boat => {
          boat.price = (boat.price - (this.giftCardDebit / this.arrLength)) * 100; 
          boat.giftCard = this.giftCardNumber;
          console.log(boat);
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

  priceResolver(price:number, totalDebit:number, gc?:boolean){
    const singleDebit = totalDebit / this.arrLength
    
    const newPrice = price - singleDebit;
    console.log("price " + price);
    console.log("single Debit " + singleDebit);
    console.log("=");
    console.log("newPrice " + newPrice);
    console.log("previous Remainder "+ this.priceRemainder);
    
    if(newPrice < 0){
      if(gc){
        this.gcRemainder += newPrice;
        this.gcSingleDebit = price;
        console.log("gcRemainder "+ this.gcRemainder);
        console.log("gcSingleDebit " + this.gcSingleDebit);
        
         
      }
      this.priceRemainder += newPrice;
      price = 0;
      console.log("remainder after price " + this.priceRemainder);
      console.log("new price " +price);
      
    }else{
      if(gc){
        if(singleDebit + this.gcRemainder > price){
          this.gcSingleDebit = price;
          this.gcRemainder = singleDebit + this.gcRemainder - price;
        } else {
          this.gcSingleDebit = singleDebit - this.gcRemainder; 
          this.gcRemainder = 0;
          console.log("gcSingleDebit "+ this.gcSingleDebit);

        }
        
      }
      if(this.priceRemainder <= 0){
        if(((price - singleDebit) + this.priceRemainder) < 0){
          this.priceRemainder = (price - singleDebit) + this.priceRemainder;
          price = 0;
        }else{
          price = ((price - singleDebit) +  this.priceRemainder);
          this.priceRemainder = 0;
          console.log("price after + price remainder " + price);
          
        }
        

      }else{
        price = (price - singleDebit);

      }
    }
    return price;
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
        console.log(this.total);
        
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
