import { Component, OnInit } from '@angular/core';
import { Coupon } from 'src/app/models/Coupon';
import { GiftCard } from 'src/app/models/GiftCard';
import { Order } from 'src/app/models/Order';
import { OrderDisplay } from 'src/app/models/OrderDisplay';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  loginBoolean: boolean = false; //true
  orderBoolean: boolean = true; //false
  buttonBoolean: boolean = true; //false
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

  userName: string;
  password: string;

  date: Date; 
  code: string;
  discount: number;
  couponMsg: string;
  monthNum: string;
  yearNum: string; 

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

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.upcoming();
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
    // validates for completed fields
    if(this.userName == undefined || this.password == undefined || this.userName == "" || this.password == ""){
      this.errorBoolean = true;
      this.isLoading = false;
      this.loginBoolean = true;
    } else {
      // sends username to the backend and validates the password
      this.api.login(this.userName).subscribe(res => {
                
        if(this.password == res){
          this.orderBoolean = true;
          this.buttonBoolean = true;
          this.isLoading = false;
        }else{
          this.isLoading = false;
          this.loginBoolean = true;
          this.invalidBoolean = true;
        }
      }, error =>{
        console.log(error);
        this.isLoading = false;
        this.invalidBoolean = true;
        this.loginBoolean = true;
      })
    }
  }

  all(){
    this.resBoolean = false;
    this.safetyBoolean = false;
    this.orderBoolean = false;
    this.couponTable = false;
    this.addCouponBoolean = false;
    this.monthBoolean = false;
    this.monthlyDisplayBoolean = false;
    this.giftCardTable = false; 
    this.isLoading = true;


    //gets all orders and displays them in a view friendly way
      this.api.getAllOrders().subscribe(res=>{
      console.log(res);
      this.isLoading = false;
      this.orderBoolean = true;
      this.displayify(res);      
      console.log(this.orderDisplays);
      this.sort();
    })
  }

  upcoming(){
    this.resBoolean = false;
    this.safetyBoolean = false;
    this.orderBoolean = true;
    this.couponTable = false;
    this.addCouponBoolean = false;
    this.addGiftCardBoolean = false;
    this.monthBoolean = false;
    this.monthlyDisplayBoolean = false;
    this.giftCardTable = false; 




    //gets all orders from today forward and displays them in a view friendly way
    this.api.getAllOrdersUpcoming().subscribe(res=>{
      console.log(res);
      this.displayify(res);      
      console.log(this.orderDisplays);
      this.sort();
      })

  }

  today(){
    this.resBoolean = false;
    this.safetyBoolean = false;
    this.orderBoolean = true;
    this.couponTable = false;
    this.addCouponBoolean = false;
    this.addGiftCardBoolean = false;
    this.monthBoolean = false;
    this.monthlyDisplayBoolean = false;
    this.giftCardTable = false; 


    //gets all of today's orders and displays them in a view friendly way
    this.api.getAllOrdersUpcoming().subscribe(res=>{
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
    this.addCouponBoolean = false;
    this.addGiftCardBoolean = false;
    this.resBoolean = false;
    this.safetyBoolean = false;
    this.monthBoolean = false;
    this.monthlyDisplayBoolean = false;
    this.giftCardTable = false; 

// gets all coupons and puts them in to this.coupons
    this.api.getAllCoupons().subscribe(res => this.coupons = res);
    if(this.couponTable === false){
      this.couponTable = true;
      this.orderBoolean = false;
    }else{
      this.couponTable = !this.couponTable;
      this.orderBoolean = !this.orderBoolean;
    }
  }
  
  giftCard(){
    this.addCouponBoolean = false;
    this.resBoolean = false;
    this.safetyBoolean = false;
    this.monthBoolean = false;
    this.monthlyDisplayBoolean = false;
    this.couponTable = false; 

// gets all giftcards and puts them in this.giftcards
    this.api.getAllGiftCards().subscribe(res => {
    this.giftCards = res});
    if(this.giftCardTable === false){
      this.giftCardTable = true;
      this.orderBoolean = false;
    }else{
      this.giftCardTable = !this.giftCardTable;
      this.orderBoolean = !this.orderBoolean;
    }
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
    this.addCouponBoolean = false;
    this.isLoading = true;
    // creates coupon object if submitted data
    let newCoupon: Coupon = {
      code: this.code,
      discount: this.discount,
      goodUntil: this.date
    }
    // Posts coupon object to the database
    this.api.postNewCoupon(newCoupon).subscribe(res =>{
       console.log(res);
       this.isLoading = false;
       this.addCouponBoolean = false;
       this.couponTable = true;
       this.couponAlert = true;
       this.couponMsg = res;
       setTimeout(() => {
         this.couponAlert = false;
       }, 4000);
    })
  }
  
  submitGiftCard(){
    this.addGiftCardBoolean = false;
    this.isLoading = true;
    // Creates giftcard object with submitted data
    let newGiftCard: GiftCard = {
      cardNumber: this.cardNumber,
      balance: this.balance * 100,
      email: this.email
    }
    // Posts giftcard object to the database
    this.api.submitGiftCard(newGiftCard).subscribe(res =>{
       console.log(res);
       this.isLoading = false;
       this.addGiftCardBoolean = false;
       this.giftCardTable = true;
       this.couponAlert = true;
       this.couponMsg = res;
       setTimeout(() => {
         this.couponAlert = false;
       }, 4000);
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
    this.resBoolean = false;
    this.safetyBoolean = false;
    this.couponTable = false;
    this.addCouponBoolean = false;
    this.monthlyDisplayBoolean = false; 
    this.giftCardTable = false; 
    

    if(this.monthBoolean === false){
      this.monthBoolean = true;
      this.orderBoolean = false;

    }else{
      this.monthBoolean = !this.monthBoolean;
      this.orderBoolean = !this.orderBoolean;
      }
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
        this.monthlyDisplayBoolean = true; 
        this.isLoading = false;
        console.log(res);
        this.displayify(res);      
        console.log(this.orderDisplays);
        this.sort();
        this.yearlyOrderDisplays = this.sortedOrderDisplays.filter(order => order.date.toString().substring(0,4) === this.yearNum
        )
        this.monthlyOrderDisplays = this.yearlyOrderDisplays.filter(order => order.date.toString().substring(5,7) === this.monthNum)        
      })
  }

  safety(){
    if(this.safetyBoolean === false){
      this.safetyBoolean = true;
      this.orderBoolean = false;
    }else{
      this.safetyBoolean = !this.safetyBoolean;
      this.orderBoolean = !this.orderBoolean;
     
    }
    this.resBoolean = false;
    this.couponTable = false;
    this.monthBoolean = false;
    this.monthlyDisplayBoolean = false; 
    this.giftCardTable = false; 
    



  }

  reservation(){
    if(this.resBoolean === false){
      this.resBoolean = true;
      this.orderBoolean = false;
    }else{
      this.resBoolean = !this.resBoolean;
      this.orderBoolean = !this.orderBoolean;
    }
    this.safetyBoolean = false;
    this.couponTable = false;
    this.monthBoolean = false;
    this.monthlyDisplayBoolean = false; 
    this.giftCardTable = false; 


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
        price: boat.price,
        orderedOn: order.ordered_on
      }        
      this.orderDisplays.push(display);
    }
  }
  }
}
