import { Component, OnInit } from '@angular/core';
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

  userName: string;
  password: string;

  orders: Order[];
  orderDisplays: OrderDisplay[] = [];
  sortedOrderDisplays: OrderDisplay[]= [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.upcoming();
  }

  submit(){
    this.errorBoolean = false;
    this.invalidBoolean = false;
    this.isLoading = true;
    this.loginBoolean = false;
    if(this.userName == undefined || this.password == undefined || this.userName == "" || this.password == ""){
      this.errorBoolean = true;
      this.isLoading = false;
      this.loginBoolean = true;
    } else {
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
      this.api.getAllOrders().subscribe(res=>{
      console.log(res);
      this.displayify(res);      
      console.log(this.orderDisplays);
      this.sort();
    })
  }

  upcoming(){
    this.api.getAllOrdersUpcoming().subscribe(res=>{
      console.log(res);
      this.displayify(res);      
      console.log(this.orderDisplays);
      this.sort();
      })

  }

  today(){
    this.api.getAllOrdersToday().subscribe(res=>{
      console.log(res);
      this.displayify(res);      
      console.log(this.orderDisplays);
      this.sort();
      })    
  }

  delete(id){
    // this.api.deleteOrder(id).subscribe()

    this.sortedOrderDisplays = this.sortedOrderDisplays.filter(order => order.id !== id)
  }

  safety(){
    this.safetyBoolean = !this.safetyBoolean;
    this.orderBoolean = !this.orderBoolean;
  }

  reservation(){
    this.orderBoolean = !this.orderBoolean;
    this.safetyBoolean = false;
    this.resBoolean = !this.resBoolean;
  }

  sort(){
    this.sortedOrderDisplays = this.orderDisplays.sort((a:any, b:any)=>{
      return +new Date(a.date) - +new Date(b.date);
    })
  }

  displayify(orders){
    this.orderDisplays = [];
    for(let order of orders){
      for(let boat of order.boats){
      const display: OrderDisplay ={
        id: order.order_id,
        date: boat.date,
        shuttle: boat.shuttle,
        time: boat.time,
        duration: boat.duration,
        boat: boat.boat,
        name: order.customer.firstName +" "+ order.customer.lastName,
        height: boat.height,
        weight: boat.weight,
        email: order.customer.email,
        phone: order.customer.phone
      }        
      this.orderDisplays.push(display);
    }
  }
  }
}
