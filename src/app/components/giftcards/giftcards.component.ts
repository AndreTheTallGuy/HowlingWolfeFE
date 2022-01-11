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

  loadText: string = "Placing your order...";

  stripeFailText: string;
  cardNumber: number;
  expMonth: number;
  expYear: number;
  cvc: number;

  giftObj: GiftObj;
  giftCard: GiftCard;
  giftCardNumber: number;

  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  message: string = null;
  amount: number = 60;
  dollarWidth: string = "125px";

  private unsubscibe = new Subject();

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
  }

  submit(){
    this.mainBoolean = false;
    this.stripeCheckout = true;
    this.objectBuilder();
  }

  objectBuilder(){

    let tempNum = Math.floor(10000000 + Math.random() * 90000000);
    console.log(tempNum);
    console.log(this.recipientEmail);
    
    this.api.getGiftCard(tempNum).subscribe(res=>{
      if(res == null){
        this.giftCardNumber = tempNum;
      } else {
        console.log("restarting number generator");
        this.objectBuilder();
      }
      this.giftCard = {cardNumber: this.giftCardNumber, balance:this.amount * 100, email: this.recipientEmail };
      this.giftObj = {giftCard: this.giftCard, fromName: this.senderName, fromEmail: this.senderEmail, message: this.message};
      console.log(this.giftObj);
      
    }, err => {
      console.log(this.recipientEmail);
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
          price: this.amount
        }
        this.loadText = "Charging Card..."
        // sends charge object to the backend
        this.api.chargeCard(charge).pipe(takeUntil(this.unsubscibe), tap(()=>{
          
        }), switchMap((res: any)=>{
          if(res === "Success"){
            this.loadText = "Finishing up..."
            // if successful, giftObj is submitted to the DB
            return this.api.submitGiftCard(this.giftObj).pipe(tap(()=>{
              
              this.giftCardNumber = null;
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
  
  ngOnDestroy(){
    this.unsubscibe.next();
    this.unsubscibe.complete();
  }
}
