import { Component, OnInit } from '@angular/core';
import { Boat } from 'src/app/models/Boat';
import { Customer } from 'src/app/models/Customer';
import { Order } from 'src/app/models/Order';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-adminres',
  templateUrl: './adminres.component.html',
  styleUrls: ['./adminres.component.css']
})
export class AdminresComponent implements OnInit {

  infoBoolean: boolean = true;
  alertBoolean: boolean = false;
  isLoading: boolean = false;
  resAdded: boolean = false;

  alertText: string;

  orderObj: Order = {order_id:0, customer: {}, boats: []};
  orderId: number;

  firstName!: any;
  lastName!: any;
  email!: any;
  phone!: any;

  boatsArray: Boat[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    // pulls boats from the session storage
    if(sessionStorage.getItem("cartList")){
      this.boatsArray = JSON.parse(sessionStorage.getItem("cartList"));
    }
    this.api.getAllOrdersUpcoming().subscribe(res=>{
      this.orderId = res[res.length -1].order_id+1;
     
    });
  }

  infoSubmit(){
    // validates for empty fields
    if(this.firstName == "" || this.lastName == "" || this.email == "" || this.phone == "" || this.firstName == undefined || this.lastName == undefined || this.email == undefined || this.phone == undefined){
      this.alertBoolean = true;
      this.alertText = "All fields are mandatory"
    } else {
      this.isLoading = true;
      this.alertBoolean=false;
      this.infoBoolean = false;
      // creates customer object
      const customer: Customer = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone
      }
      this.orderObj.order_id = this.orderId;
      this.orderObj.customer = customer;
      this.orderObj.boats = this.boatsArray;
        
      // submits constructed order to DB
      this.api.submitOrder(this.orderObj).subscribe((res)=> {
        
        this.isLoading = false;
        this.infoBoolean = false;
        sessionStorage.clear()
        this.resAdded = true;
      }, err =>{
        console.log(err.message);
        this.isLoading = false;
        this.infoBoolean = true;
        this.alertBoolean = true;
        this.alertText = err.message
      });
      
    }
    
  }

}
