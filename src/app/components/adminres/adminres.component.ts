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

  orderObj: Order = {order_id:"", customer: {}, boats: []};
  
  firstName!: any;
  lastName!: any;
  email!: any;
  phone!: any;

  boatsArray: Boat[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem("cartList")){
      this.boatsArray = JSON.parse(sessionStorage.getItem("cartList"));
      console.log(this.boatsArray);
      this.boatsArray.forEach((boat)=> console.log(boat.date));
      console.log(this.boatsArray);
    
    }
  }

  infoSubmit(){
    if(this.firstName == "" || this.lastName == "" || this.email == "" || this.phone == "" || this.firstName == undefined || this.lastName == undefined || this.email == undefined || this.phone == undefined){
      this.alertBoolean = true;
    } else {
      this.isLoading = true;
      this.alertBoolean=false;
      this.infoBoolean = false;
      const customer: Customer = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone
      }
      // this.orderObj.order_id = uuid.v4();
      this.orderObj.customer = customer;
      this.orderObj.boats = this.boatsArray;
      this.api.submitOrder(this.orderObj).subscribe((res)=> {
        this.isLoading = false;
        this.infoBoolean = false;
        sessionStorage.clear()
        this.resAdded = true;
      })
    }
    
  }

}
