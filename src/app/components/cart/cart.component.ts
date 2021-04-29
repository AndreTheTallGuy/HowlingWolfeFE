import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Order } from 'src/app/models/Order';
import { Customer } from 'src/app/models/Customer';
import { Boat } from '../../models/Boat';
import { ApiService } from '../../services/api.service';
import * as uuid from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  infoBoolean: boolean = false;
  emptyBoolean: boolean = false;
  tableBoolean: boolean = false;
  stripeCheckout: boolean = false;
  alertBoolean: boolean = false;
  isLoading: boolean = false;

  boatsArray: Boat[] = [];
  orderObj: Order = {order_id:"", customer: {}, boats: []};
  
  firstName!: any;
  lastName!: any;
  email!: any;
  phone!: any;

  subTotal: number = 0;
  taxes: number;
  total: number = 0;

  constructor(private api: ApiService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    if(sessionStorage.getItem("cartList")){
      this.boatsArray = JSON.parse(sessionStorage.getItem("cartList"));
      console.log(this.boatsArray);
      this.tableBoolean = true;
      } else {
        this.emptyBoolean = true;
    }
  }
  ngDoCheck(){
    this.getTotals();  

  }

  getTotals(){
    this.subTotal=0;
    for(let i =0; i< this.boatsArray.length; i++){
      this.subTotal += this.boatsArray[i].price;
    }
    this.taxes = this.subTotal * .08;
    this.total = this.subTotal + this.taxes;
  }

  delete(event){
    const id:string = event.path[3].children[0].innerText;
    console.log(id);
    console.log(event);
    this.boatsArray = this.boatsArray.filter(item => item.id !== id);
    console.log(this.boatsArray);
    sessionStorage.setItem("cartList", JSON.stringify(this.boatsArray));
     
  }

  checkOut(){
    console.log("check out");
    this.infoBoolean = true;
    this.tableBoolean = false;
  }

  infoSubmit(){
    if(this.firstName == "" || this.lastName == "" || this.email == "" || this.phone == "" || this.firstName == undefined || this.lastName == undefined || this.email == undefined || this.phone == undefined){
      this.alertBoolean = true;
    } else {
      this.alertBoolean=false;
      this.stripeCheckout = true;
      this.infoBoolean = false;
      const customer: Customer = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone
      }
      console.log(customer);
      
      // this.orderObj.order_id = uuid.v4();
      this.orderObj.customer = customer;
      this.orderObj.boats = this.boatsArray;
      console.log(this.orderObj);
      
    }
    
  }

  stripeSubmit(){
    this.stripeCheckout = false;
    this.isLoading = true;
    this.api.submitOrder(this.orderObj).subscribe(res =>{
      console.log(res);
      this.isLoading = false;
      sessionStorage.clear();
      this.router.navigate(['/thank-you'])
    });
  }
}
