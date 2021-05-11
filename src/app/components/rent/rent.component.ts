import * as uuid from 'uuid';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Boat } from 'src/app/models/Boat';
import { Time } from 'src/app/models/Time';
import { Duration } from 'src/app/models/Duration';


@Component({
  selector: 'app-rent',
  templateUrl: './rent.component.html',
  styleUrls: ['./rent.component.css']
})
export class RentComponent implements OnInit {

  boatList: string[] = [];
  selectedBoat?: string;
  boatInfo: Boat;
  
  boatBoolean: boolean = true;
  shuttleBoolean: boolean = false;
  dateBoolean: boolean = false;
  addedToCartBoolean: boolean = false;
  errorBoolean: boolean = false;
  
  date: any;
  shuttle: any;
  time: any;
  duration: any;
  height: any;
  weight: any;
  price: number;

  cartArray?: Boat[] = [];
  cartList?: string;
  
  minDate: Date = new Date;

  timeOptions: Time[];
  durationOptions: Duration[];

  constructor( ) { }
  
  ngOnInit(): void {
    this.minDate.setDate(this.minDate.getDate() + 1);
    
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Monday and Tuesday from being selected.
    // return day !== 1 && day !== 2;
    return true;
  }

  resetDuration(){
    this.duration = "";
  }
  
  resetTime(){
    this.time = "";
  }
 
  boatSelection(event){
    console.log(event.srcElement.alt);
    this.selectedBoat = event.srcElement.alt;
    this.boatBoolean = false;
    this.dateBoolean = true;
  }

  submitDate(){
    if(this.height == "" || this.weight == "" || this.date == "" || this.duration == "" || this.time == "" || this.height == undefined || this.weight == undefined || this.date == undefined || this.duration == undefined || this.time == undefined){
      this.errorBoolean = true;
      
    }else{
      this.priceResolver(this.selectedBoat, this.duration);
      this.boatInfo = {
        id: uuid.v4(),
        boat: this.selectedBoat,
        shuttle: this.shuttle,
        height: this.height,
        weight: this.weight,
        date: this.date,
        duration: this.duration,
        time: this.time,
        price: this.price,
      }
      console.log(this.boatInfo);
      this.addToSessionStorage(this.boatInfo);
      this.dateBoolean = false;
      this.addedToCartBoolean = true;
    }
  }

  addToSessionStorage(boat:Boat){
    // Check session storage for already added boats
    if(sessionStorage.getItem("cartList")){
      //assign them to cartList
      this.cartList = sessionStorage.getItem("cartList");
      // initialize var with current cartlist
      const boatsInCart = JSON.parse(this.cartList);
      // push each boat into the cartArray
      for(let i=0; i < boatsInCart.length; i++){
        this.cartArray.push(boatsInCart[i]);
      }
      //push new boat into cartArray
      this.cartArray.push(boat);
      //convert cartArray to string
      this.cartList = JSON.stringify(this.cartArray);
      // add string to Session Storage
      sessionStorage.setItem("cartList", this.cartList);
      // clear the cartArray
      this.cartArray = [];
    } else {
      //push new boat to cartArray
      this.cartArray.push(boat);
      //add strigified version of cartArray to session storage
      sessionStorage.setItem("cartList", JSON.stringify(this.cartArray));
      //clear cartArray
      this.cartArray = [];
    }

  }

  addAnotherBoat(){
    this.boatInfo.height = "";
    this.boatInfo.weight = "";
    this.addedToCartBoolean = false;
    this.boatBoolean = true;
  }

   priceResolver(boat:string, duration: string){
    if(boat == "Single Kayak"){
      switch(duration){
        case "2": this.price = 1; break;
        case "4": this.price = 40; break;
        case "6": this.price = 55; break;
      }
    } else if(boat == "Tandem Kayak" || boat == "Canoe"){
      switch(duration){
        case "2": this.price = 45; break;
        case "4": this.price = 55; break;
        case "6": this.price = 65; break;
      }
    } else if(boat == "Fishing Kayak"){
      switch(duration){
        case "2": this.price = 35; break;
        case "4": this.price = 45; break;
        case "6": this.price = 60; break;
      }
    }
  }

  durationResolver(){
    this.time = "";

    if(this.shuttle == "none"){
      this.durationOptions = [
        {duration:"2 hours", value:"2"},
        {duration:"4 hours", value:"4"},
        {duration:"6 hours", value:"6"}
      ]
    }else if(this.shuttle == "north-aurora"){
      this.durationOptions = [
        {duration:"2 hours", value:"2"}
      ]
    }else if(this.shuttle == "batavia"){
      this.durationOptions = [
        {duration:"4 hours", value:"4"}
      ]
    }
  }

  timeResolver(){
    
    const split = this.date.toString().split(" ")[0];
    console.log(split);
    
    if(split == "Mon" || split == "Tue" || split == "Wed" || split  == "Thu" || split  == "Fri"){
      if(this.duration == "2"){
        this.timeOptions = [
          {time:"9am", value:"9am"},
          {time:"10am", value:"10am"},
          {time:"11am", value:"11am"},
          {time:"12pm", value:"12pm"},
          {time:"1pm", value:"1pm"},
          {time:"2pm", value:"2pm"},
          {time:"3pm", value:"3pm"},
          {time:"4pm", value:"4pm"},
        ];
      }else if(this.duration == "4"){
        this.timeOptions = [
          {time:"9am", value:"9am"},
          {time:"10am", value:"10am"},
          {time:"11am", value:"11am"},
          {time:"12pm", value:"12pm"},
          {time:"1pm", value:"1pm"},
          {time:"2pm", value:"2pm"}
        ];
      }else if(this.duration == "6"){
        this.timeOptions =[
          {time:"9am", value:"9am"},
          {time:"10am", value:"10am"},
          {time:"11am", value:"11am"},
          {time:"12pm", value:"12pm"},
        ]
      }
    }else if(split == "Sat"){
      if(this.duration == "2"){
        this.timeOptions = [
          {time:"9am", value:"9am"},
          {time:"10am", value:"10am"},
          {time:"11am", value:"11am"},
          {time:"12pm", value:"12pm"},
          {time:"1pm", value:"1pm"},
          {time:"2pm", value:"2pm"},
          {time:"3pm", value:"3pm"},
        ];
      } else if(this.duration == "4"){
        this.timeOptions = [
          {time:"9am", value:"9am"},
          {time:"10am", value:"10am"},
          {time:"11am", value:"11am"},
          {time:"12pm", value:"12pm"},
          {time:"1pm", value:"1pm"},
        ];
      } else if(this.duration == "6"){
        this.timeOptions = [
          {time:"9am", value:"9am"},
          {time:"10am", value:"10am"},
          {time:"11am", value:"11am"},
        ];
      }
    }else if(split == "Sun"){
      if(this.duration == "2"){
        this.timeOptions = [
          {time:"9am", value:"9am"},
          {time:"10am", value:"10am"},
          {time:"11am", value:"11am"},
          {time:"12pm", value:"12pm"},
          {time:"1pm", value:"1pm"},
          {time:"2pm", value:"2pm"},
        ];
      } else if(this.duration == "4"){
        this.timeOptions = [
          {time:"9am", value:"9am"},
          {time:"10am", value:"10am"},
          {time:"11am", value:"11am"},
          {time:"12pm", value:"12pm"},
        ];
      } else if(this.duration == "6"){
        this.timeOptions = [
          {time:"9am", value:"9am"},
          {time:"10am", value:"10am"},
        ];
      }
    }
  }
}
