import { Component, OnInit } from '@angular/core';
import { Coupon } from 'src/app/models/Coupon';
import { Order } from 'src/app/models/Order';
import { OrderDisplay } from 'src/app/models/OrderDisplay';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  loginBoolean: boolean = true;
  errorBoolean: boolean = false;
  invalidBoolean: boolean = false;
  orderBoolean: boolean = false;
  safetyBoolean: boolean = false;
  isLoading: boolean = false;
  resBoolean: boolean = false;
  buttonBoolean: boolean = false;
  couponTable: boolean = false;
  addCouponBoolean: boolean = false;
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

  coupons: Coupon[];
  orders: Order[];
  orderDisplays: OrderDisplay[] = [];
  sortedOrderDisplays: OrderDisplay[]= [];
  yearlyOrderDisplays: OrderDisplay[]= [];
  monthlyOrderDisplays: OrderDisplay[]= [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.upcoming();
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
    this.orderBoolean = true;
    this.couponTable = false;
    this.addCouponBoolean = false;
    this.monthBoolean = false;
    this.monthlyDisplayBoolean = false; 


    //gets all orders and displays them in a view friendly way
      this.api.getAllOrders().subscribe(res=>{
      console.log(res);
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
    this.monthBoolean = false;
    this.monthlyDisplayBoolean = false; 




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
    this.monthBoolean = false;
    this.monthlyDisplayBoolean = false; 




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
    this.api.getAllCoupons().subscribe(res => this.coupons = res);
    if(this.couponTable === false){
      this.couponTable = true;
      this.orderBoolean = false;
    }else{
      this.couponTable = !this.couponTable;
      this.orderBoolean = !this.orderBoolean;
    }
    this.addCouponBoolean = false;
    this.resBoolean = false;
    this.safetyBoolean = false;
    this.monthBoolean = false;
    this.monthlyDisplayBoolean = false; 


  }

  addCoupon(){
    this.couponTable = false;
    this.addCouponBoolean = true;
  }

  submitCoupon(){
    this.addCouponBoolean = false;
    this.isLoading = true;
    let newCoupon: Coupon = {
      code: this.code,
      discount: this.discount,
      goodUntil: this.date
    }
    console.log(newCoupon);
    
    this.api.postNewCoupon(newCoupon).subscribe(res =>{
       console.log(res);
       this.isLoading = false;
       this.addCouponBoolean = true;
       this.couponAlert = true;
       this.couponMsg = res;
       setTimeout(() => {
         this.couponAlert = false;
       }, 4000);
    })
  }

  delete(id){
    this.api.deleteCoupon(id).subscribe(res => {
      console.log(res)
      this.coupons = this.coupons.filter(coupon => coupon.id !== id)
    }, err => console.log(err)
    )
  }

  deleteBoatBoolean(){
    this.deleteBoolean = !this.deleteBoolean;
  }

  deleteBoat(id){
    if(window.confirm("Are you sure?")){
      this.api.deleteBoat(id).subscribe(res => {
        console.log(res);
        this.sortedOrderDisplays = this.sortedOrderDisplays.filter(boat => boat.boatId !== id);
      });
    }
    
  }

  month(){
    if(this.monthBoolean === false){
      this.monthBoolean = true;
      this.orderBoolean = false;

    }else{
      this.monthBoolean = !this.monthBoolean;
      this.orderBoolean = !this.orderBoolean;
      
    }
    this.resBoolean = false;
    this.safetyBoolean = false;
    this.couponTable = false;
    this.addCouponBoolean = false;
    this.monthlyDisplayBoolean = false; 


  }

  monthlySubmit(){
    this.isLoading = true;
    this.monthBoolean = false;
    if(this.monthNum.length === 1){
      this.monthNum = "0" + this.monthNum;
    }

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
        price: boat.price
      }        
      this.orderDisplays.push(display);
    }
  }
  }
}
