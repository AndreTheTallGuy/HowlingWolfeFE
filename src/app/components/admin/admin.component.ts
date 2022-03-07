import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { Coupon } from 'src/app/models/Coupon';
import { GiftCard } from 'src/app/models/GiftCard';
import { GiftObj } from 'src/app/models/GiftObj';
import { Order } from 'src/app/models/Order';
import { OrderDisplay } from 'src/app/models/OrderDisplay';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation:ViewEncapsulation.None

})
export class AdminComponent implements OnInit {

  loginBoolean: boolean = true; //true
  orderBoolean: boolean = false; //false
  buttonBoolean: boolean = false; //false
  errorBoolean: boolean = false;
  invalidBoolean: boolean = false;
  safetyBoolean: boolean = false;
  isLoading: boolean = false;
  resBoolean: boolean = false;
  couponTable: boolean = false;
  giftCardTable: boolean = false;
  addCouponBoolean: boolean = false;
  addGiftCardBoolean: boolean = false;
  couponAlert: boolean = false;
  deleteBoolean: boolean = false;
  monthBoolean: boolean = false;
  monthlyDisplayBoolean: boolean = false;
  editGiftCardBoolean: boolean = false;

  isLoggedIn: boolean = false;
  userName: string;
  password: string;
  loginErrorMessage: string;
  loadText: string;

  date: Date; 
  code: string;
  discount: number;
  couponMsg: string;
  monthNum: string;
  yearNum: string;
  discountType: string;
  goodForGC: boolean;

  cardNumber: number;
  balance: number;
  email: string;

  giftCards: GiftCard[];
  coupons: Coupon[];
  orders: Order[];
  orderDisplays: OrderDisplay[] = [];
  sortedOrderDisplays: OrderDisplay[]= [];
  yearlyOrderDisplays: OrderDisplay[]= [];
  monthlyOrderDisplays: OrderDisplay[]= [];

  navigation: string;

  daysSelected: Date[] = [];
  calTempDateArray: any[] = [];
  event: any;
  minDate: Date;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getAllOrdersUpcoming().subscribe();
    this.minDate = new Date;
    this.minDate.setDate(this.minDate.getDate());
  }

  resetBooleans(){
      this.orderBoolean = false; 
      this.buttonBoolean = true; 
      this.errorBoolean = false;
      this.invalidBoolean = false;
      this.safetyBoolean = false;
      this.isLoading = false;
      this.resBoolean = false;
      this.couponTable = false;
      this.giftCardTable = false;
      this.addCouponBoolean = false;
      this.addGiftCardBoolean = false;
      this.couponAlert = false;
      this.deleteBoolean = false;
      this.monthBoolean = false;
      this.monthlyDisplayBoolean = false;
      this.editGiftCardBoolean = false;
  }

  dropdown(){
    switch(this.navigation){
      case "all": {
        this.all();
      }
      break;
      case "upcoming": {
        this.upcoming();
      }
      break;
      case "today": {
        this.today();
      }
      break;
      case "month": {
        this.month();
      }
      break;
      case "coupons": {
        this.coupon();
      }
      break;
      case "giftcards": {
        this.giftCard();
      }
      break;
      case "reservation": {
        this.reservation();
      }
      break;
      case "video": {
        this.safety();
      }
      break;
    }
  }

  submit(){
    this.errorBoolean = false;
    this.invalidBoolean = false;
    this.isLoading = true;
    this.loginBoolean = false;
    this.orderBoolean = false;
    // validates for completed fields
    if(this.userName == undefined || this.password == undefined || this.userName == "" || this.password == ""){
      this.errorBoolean = true;
      this.isLoading = false;
      this.loginBoolean = true;
    } else {
      // sends username to the backend and validates the password
      this.api.login(this.userName).subscribe(res => {
                
        if(this.password == res){
          this.isLoggedIn = true;
          this.upcoming();
        }else{
          this.isLoading = false;
          this.loginBoolean = true;
          this.invalidBoolean = true;
          this.loginErrorMessage = "Username or Password are incorrect";
        }
      }, error =>{
        console.log(error);
        this.isLoading = false;
        this.invalidBoolean = true;
        this.loginBoolean = true;
        this.loginErrorMessage = error.message;
        setTimeout(()=>{
          this.invalidBoolean = false;
        }, 4000);
      })
    }
  }

  all(){
    this.resetBooleans();
    this.isLoading = true;
    //gets all orders and displays them in a view friendly way
      this.api.getAllOrders().subscribe(res=>{
      this.isLoading = false;
      this.orderBoolean = true;
      this.displayify(res);      
      this.sort();
    })
  }

  upcoming(){
    this.resetBooleans();
    this.isLoading = true;
    //gets all orders from today forward and displays them in a view friendly way
    this.api.getAllOrdersUpcoming().subscribe(res=>{
      console.log(res);
      
      this.isLoading = false;
      this.orderBoolean = true;
      this.displayify(res);      
      this.sort();
      })
  }

  today(){
    this.resetBooleans();
    this.isLoading = true;
    //gets all of today's orders and displays them in a view friendly way
    this.api.getAllOrdersUpcoming().subscribe(res=>{
      this.isLoading = false;
      this.orderBoolean = true;
      this.displayify(res);      
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() +1);
      tomorrow.setHours(0,0,0,0);
      // filters out boats not scheduled for today
      this.orderDisplays = this.orderDisplays.filter(order => Date.parse(order.date.toString()) < Date.parse(tomorrow.toISOString()));
      this.sort();
      })    
  }

  coupon(){
    this.resetBooleans();
    this.isLoading = true;

// gets all coupons and puts them in to this.coupons
    this.api.getAllCoupons().subscribe(res => {   
      console.log(res);
         
      this.isLoading = false;
      this.couponTable = true;
      this.coupons = res.sort((a:any,b:any)=>{
        return +new Date(b.goodUntil) - +new Date(a.goodUntil)
      });
      
    });
  }
  
  giftCard(){
    this.resetBooleans();
    this.isLoading = true;

    // gets all giftcards and puts them in this.giftcards
    this.api.getAllGiftCards().subscribe(res => {
      this.isLoading = false;
      this.giftCardTable = true;
      this.giftCards = res.sort((a:any,b:any)=>{
        return +new Date(b.purchased_on) - +new Date(a.purchased_on)});
      
    });
  }

  addCoupon(){
    this.couponTable = false;
    this.addCouponBoolean = true;
  }
  
  addGiftCard(){
    this.giftCardTable = false;
    this.addGiftCardBoolean = true;
  }

  submitCoupon(){
    if(this.daysSelected.length == 0){
      this.errorBoolean = true;
    }else {
      this.errorBoolean = false;
      this.addCouponBoolean = false;
      this.isLoading = true;
      // creates coupon object if submitted data
      let newCoupon: Coupon = {
        code: this.code,
        discountType: this.discountType,
        discount: this.discount,
        goodUntil: this.date,
        whenGood: this.daysSelected,
        goodForGC: this.goodForGC
      }
      console.log(newCoupon);
      
      // Posts coupon object to the database
      this.api.postNewCoupon(newCoupon).subscribe(res =>{
         this.isLoading = false;
         this.couponTable = true;
         this.couponAlert = true;
         this.couponMsg = res;
         setTimeout(() => {
           this.couponAlert = false;
         }, 4000);
         this.coupon();
      }, error =>{
        this.isLoading = false;
         this.couponTable = true;
         this.couponAlert = true;
         this.couponMsg = error;
         setTimeout(() => {
           this.couponAlert = false;
         }, 4000);
         this.coupon();
      })
    }
  }

  remove(date: string){
    for (let i = 0; i < this.calTempDateArray.length; i++) {
      if(this.calTempDateArray[i] === date){
        this.calTempDateArray.splice(i,1);
        this.daysSelected.splice(i,1);
      }
    }
  }
  
  submitGiftCard(){
    this.addGiftCardBoolean = false;
    this.isLoading = true;

    let tempNum = Math.floor(10000000 + Math.random() * 90000000);
    console.log(tempNum);
    
    this.api.getGiftCard(tempNum).subscribe(res=>{
      if(res !== null){
        this.submitGiftCard();
      } else {
        // Creates giftcard object with submitted data
        let newGiftCard: GiftCard = {
          cardNumber: tempNum,
          balance: this.balance * 100,
          email: this.email
        };
        let giftObj:GiftObj = {
          giftCard: newGiftCard,
          fromName: null,
          fromEmail: null,
          message: null
        }
        // Posts giftcard object to the database
        this.api.submitGiftCard(giftObj).subscribe(res =>{
           this.isLoading = false;
           this.addGiftCardBoolean = false;
           this.giftCardTable = true;
           this.couponAlert = true;
           this.couponMsg = res;
           setTimeout(() => {
             this.couponAlert = false;
           }, 4000);
           this.giftCard();
      });
      }
    })
  }

  deleteCoupon(id){
    // deletes coupon by coupon id
    this.api.deleteCoupon(id).subscribe(res => {
      console.log(res)
      this.coupons = this.coupons.filter(coupon => coupon.id !== id)
    }, err => console.log(err)
    )
  }
  
  deleteGiftCard(cardNumber){
    // deletes giftcard by card number
    if(window.confirm("Are you sure?")){
      this.api.deleteGiftCard(cardNumber).subscribe(res => {
        console.log(res)
        this.giftCards = this.giftCards.filter(giftCard => giftCard.cardNumber !== cardNumber)
      }, err => console.log(err)
      )
    }
  }

  editGiftCard(gc){
    this.cardNumber = gc.cardNumber;
    this.email = gc.email;
    this.giftCardTable = false;
    this.editGiftCardBoolean = true;
    
  }

  editGiftCardSubmit(){
    this.editGiftCardBoolean = false;    
    this.isLoading = true;

    let giftcard:GiftCard = {
      cardNumber: this.cardNumber,
      balance: this.balance * 100,
      email: this.email
    }
    this.api.updateGiftCard(giftcard).subscribe(res => {
           this.giftCard();
           this.couponAlert = true;
           this.couponMsg = res;
           setTimeout(() => {
             this.couponAlert = false;
           }, 4000);
    }, err => {
           this.giftCard();
           this.couponAlert = true;
           this.couponMsg = err;
           setTimeout(() => {
             this.couponAlert = false;
           }, 4000);
    })
  }

  editGiftCardCancel(){
    this.giftCardTable = true;
    this.editGiftCardBoolean = false;
  }

  deleteBoatBoolean(){
    this.deleteBoolean = !this.deleteBoolean;
  }

  deleteBoat(id){
    // deletes boat by id
    if(window.confirm("Are you sure?")){
      this.api.deleteBoat(id).subscribe(res => {
        console.log(res);
        this.sortedOrderDisplays = this.sortedOrderDisplays.filter(boat => boat.boatId !== id);
      });
    }
    
  }

  month(){
    this.resetBooleans();
    this.monthBoolean = true;
  }

  monthlySubmit(){
    this.isLoading = true;
    this.monthBoolean = false;
    if(this.monthNum.length === 1){
      this.monthNum = "0" + this.monthNum;
    }
    if(this.yearNum.length === 2){
      this.yearNum = "20" + this.yearNum;
    }
      // gets all orders and sorts them by month
      this.api.getAllOrders().subscribe(res=>{
        this.monthBoolean = true;
        // this.monthlyDisplayBoolean = true; 
        this.orderBoolean = true;
        this.isLoading = false;
        this.displayify(res);      
        this.sort();
        this.yearlyOrderDisplays = this.sortedOrderDisplays.filter(order => order.date.toString().substring(0,4) === this.yearNum
        )
        this.sortedOrderDisplays = this.yearlyOrderDisplays.filter(order => order.date.toString().substring(5,7) === this.monthNum)
               
      })
  }

  safety(){
    this.resetBooleans();
    this.safetyBoolean = true;
  }

  reservation(){
    this.resetBooleans();
    this.resBoolean = true;
  }

  sort(){
    //sorts the displays
    this.sortedOrderDisplays = this.orderDisplays.sort((a:any, b:any)=>{
      return +new Date(a.date) - +new Date(b.date);
    })
  }


  displayify(orders){
    this.orderDisplays = [];
    //loops through orders and then through each boat and converts them to a view friendly display
    for(let order of orders){
      for(let boat of order.boats){
        const display: OrderDisplay ={
          id: order.order_id,
          boatId: boat.id, 
          date: boat.date,
          shuttle: boat.shuttle,
          time: boat.time,
          duration: boat.duration,
          boat: boat.boat,
          name: order.customer.firstName +" "+ order.customer.lastName,
          height: boat.height,
          weight: boat.weight,
          email: order.customer.email,
          phone: order.customer.phone,
          coupon: order.customer.coupon,
          price: boat.price /100,
          discount: boat.discount /100,
          giftCard: boat.giftCard,
          gcDebit: boat.gcDebit/100,
          orderedOn: order.ordered_on,
          type: boat.type,
          comment: boat.comment
        }
        if(display.price < 1.18){
          display.price = display.price *100;
        }
        if(display.discount === 0){
          display.discount = null;
        }
        if(display.gcDebit === 0){
          display.gcDebit = null;
        }
        this.orderDisplays.push(display);
      }
    }
  }


  isSelected = (event: any) => {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    return this.calTempDateArray.find(x => x == date) ? "selected" : null;
  };
  
  select(event: any, calendar: any) {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    const index = this.calTempDateArray.findIndex(x => x == date);
    if (index < 0) {
      this.calTempDateArray.push(date);
      this.daysSelected.push(event);
    }
    else {
      this.calTempDateArray.splice(index, 1);
      this.daysSelected.splice(index, 1);
    }
    calendar.updateTodaysDate();
  }

  openCal(couponId) {
    const coupon = this.coupons.find(x => x.id == couponId);
    const dates = coupon.whenGood;
      return (date: Date): MatCalendarCellCssClasses => {
        const highlightDate = dates
          .map((strDate) => new Date(strDate))
          .some(
            (d) =>
              d.getDate() === date.getDate() &&
              d.getMonth() === date.getMonth() &&
              d.getFullYear() === date.getFullYear()
          );
        return highlightDate ? 'selected' : null;
      };
  }
}
