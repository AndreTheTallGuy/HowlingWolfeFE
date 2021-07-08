import * as uuid from 'uuid';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Boat } from 'src/app/models/Boat';
import { Time } from 'src/app/models/Time';
import { Duration } from 'src/app/models/Duration';
import { Times } from 'src/app/models/Times';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { LogicalFileSystem } from '@angular/compiler-cli/src/ngtsc/file_system';



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
  isLoading: boolean = false;
  noAvailError: boolean = false;
  adminResBoolean: boolean = false;
  adminResOptions: boolean = false;
  dateErrorBoolean = false;

  noAvailText: string;
  
  date: any;
  shuttle: any;
  time: any;
  duration: any;
  height: any;
  weight: any;
  price: number;

  cartArray?: Boat[] = [];
  cartList?: string;
  boatsInCart: Boat[];
  
  minDate: Date = new Date;

  timeOptions: Time[];
  durationOptions: Duration[];

  availability: Times[] = []

  constructor(private api: ApiService, private router: Router ) { }
  
  ngOnInit(): void {
    // if url is /rentals, sets the datepickers mindate to tomorrow
    if(this.router.url.includes('rentals')){
      this.minDate.setDate(this.minDate.getDate() + 1);
    }
    this.resetTimesArray();
  }
  // ability to prevent certain days from being selected
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Monday and Tuesday from being selected.
    // return day !== 1 && day !== 2;
    return true;
  }

  resetDuration(){
    this.duration = "";
  }
  
  dateReset(){
    this.time = "";
    this.resetTimesArray();
  }

  resetTimeAndDuration(){
    this.duration = "";
    this.time = "";
  }
 
  boatSelection(boat){
    this.selectedBoat = boat;
    this.boatBoolean = false;
    this.dateBoolean = true;
  }

  // resets availability to how many boats there are in total
  resetTimesArray(){
    console.log("times array reset");
    
    this.availability = [
    {time:"8am", boats:{kayak: 9, canoe: 2, tandem: 1}},
    {time:"9am", boats:{kayak: 9, canoe: 2, tandem: 1}},
    {time: "10am", boats: {kayak: 9, canoe: 2, tandem: 1}},
    {time: "11am", boats: {kayak: 9, canoe: 2, tandem: 1}},
    {time: "12pm", boats: {kayak: 9, canoe: 2, tandem: 1}},
    {time: "1pm", boats: {kayak: 9, canoe: 2, tandem: 1}},
    {time: "2pm", boats: {kayak: 9, canoe: 2, tandem: 1}},
    {time: "3pm", boats: {kayak: 9, canoe: 2, tandem: 1}},
    {time: "4pm", boats: {kayak: 9, canoe: 2, tandem: 1}},
    {time: "5pm", boats: {kayak: 9, canoe: 2, tandem: 1}},
    {time: "6pm", boats: {kayak: 9, canoe: 2, tandem: 1}}
  ]
  }

  submitDate(){
    // validates empty fields
    if(this.height == "" || this.weight == "" || this.date == "" || this.duration == "" || this.time == "" || this.height == undefined || this.weight == undefined || this.date == undefined || this.duration == undefined || this.time == undefined){
      this.errorBoolean = true;
    }else{
    this.isLoading = true;
    this.dateBoolean = false;
    this.noAvailError = false;
    this.errorBoolean = false;
    this.resetTimesArray();
      // Gets all orders by the user's selected date
      console.log(this.date);

      this.api.getAllOrdersByDate(this.date).subscribe((res)=>{
        console.log(res);
        //loops through orders to get each boat
        for(let order of res){
          for(let boat of order.boats){
           // if boat's date matches user's date, it is subtracted from the pool
          //  let boatDate = boat.date;
           
            if(Date.parse(boat.date.toString()) === Date.parse(this.date.toISOString())){
              this.pool(boat.boat, boat.duration, boat.time);
            }
          }
        }

        if(sessionStorage.getItem("cartList")){
          this.boatsInCart = JSON.parse(sessionStorage.getItem("cartList"));
          for(let boat of this.boatsInCart){
            if(boat.date === this.date.toISOString()){
              this.pool(boat.boat, boat.duration, boat.time);
              
            }
          }
        }
        // subtracts user's selected boat from pool
        this.pool(this.selectedBoat, this.duration, this.time);
        console.log(this.availability);
        // checks if the pool count is less than 0 on any of the time slots
      if(this.selectedBoat === "Canoe" && this.availability[0].boats.canoe < 0 || this.selectedBoat === "Single Kayak" && this.availability[0].boats.kayak <0 || this.selectedBoat === "Tandem" && this.availability[0].boats.tandem < 0 || 
        this.selectedBoat === "Canoe" && this.availability[1].boats.canoe < 0 || this.selectedBoat === "Single Kayak" && this.availability[1].boats.kayak <0 || this.selectedBoat === "Tandem" && this.availability[1].boats.tandem < 0 || 
        this.selectedBoat === "Canoe" && this.availability[2].boats.canoe < 0 || this.selectedBoat === "Single Kayak" && this.availability[2].boats.kayak <0 || this.selectedBoat === "Tandem" && this.availability[2].boats.tandem < 0 || 
        this.selectedBoat === "Canoe" && this.availability[3].boats.canoe < 0 || this.selectedBoat === "Single Kayak" && this.availability[3].boats.kayak <0 || this.selectedBoat === "Tandem" && this.availability[3].boats.tandem < 0 || 
        this.selectedBoat === "Canoe" && this.availability[4].boats.canoe < 0 || this.selectedBoat === "Single Kayak" && this.availability[4].boats.kayak <0 || this.selectedBoat === "Tandem" && this.availability[4].boats.tandem < 0 || 
        this.selectedBoat === "Canoe" && this.availability[5].boats.canoe < 0 || this.selectedBoat === "Single Kayak" && this.availability[5].boats.kayak <0 || this.selectedBoat === "Tandem" && this.availability[5].boats.tandem < 0 || 
        this.selectedBoat === "Canoe" && this.availability[6].boats.canoe < 0 || this.selectedBoat === "Single Kayak" && this.availability[6].boats.kayak <0 || this.selectedBoat === "Tandem" && this.availability[6].boats.tandem < 0 || 
        this.selectedBoat === "Canoe" && this.availability[7].boats.canoe < 0 || this.selectedBoat === "Single Kayak" && this.availability[7].boats.kayak <0 || this.selectedBoat === "Tandem" && this.availability[7].boats.tandem < 0 || 
        this.selectedBoat === "Canoe" && this.availability[8].boats.canoe < 0 || this.selectedBoat === "Single Kayak" && this.availability[8].boats.kayak <0 || this.selectedBoat === "Tandem" && this.availability[8].boats.tandem < 0 || 
        this.selectedBoat === "Canoe" && this.availability[9].boats.canoe < 0 || this.selectedBoat === "Single Kayak" && this.availability[9].boats.kayak <0 || this.selectedBoat === "Tandem" && this.availability[9].boats.tandem < 0 || 
        this.selectedBoat === "Canoe" && this.availability[10].boats.canoe < 0 || this.selectedBoat === "Single Kayak" && this.availability[10].boats.kayak <0 || this.selectedBoat === "Tandem" && this.availability[10].boats.tandem < 0){
          this.isLoading = false;
          this.noAvailText = `Sorry, we do not have any ${this.selectedBoat}s for that date and time. Please try another date or time.`
          this.noAvailError = true;
          this.dateBoolean = true;

        }else{
          // if time is available, get price and construct boatInfo object
          this.priceResolver(this.selectedBoat, this.shuttle);
          this.boatInfo = {
            id: uuid.v4(),
            boat: this.selectedBoat,
            shuttle: this.shuttle,
            height: this.height,
            weight: this.weight,
            date: this.date.toISOString(),
            duration: this.duration,
            time: this.time,
            price: this.price,
          }
          // add boat to session storage
          this.addToSessionStorage(this.boatInfo);
          this.isLoading = false;
          // if customer facing, offer to send user to cart or add more boats
          if(this.router.url.includes('rentals')){
            this.addedToCartBoolean = true;
          } else {
            this.adminResOptions = true;
          }
          this.height = "";
          this.weight = "";
        }
      }, err => {
        console.log(err.message);
        this.isLoading = false;
        this.noAvailError = true;
        this.noAvailText = err.message;
        this.dateBoolean = true;
        
        
      })
      
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
    this.adminResOptions = false;
    this.boatBoolean = true;
  }

  adminResFinish(){
    this.adminResOptions = false;
    this.adminResBoolean = true;
  }

   priceResolver(boat:string, shuttle: string){
     // checks type of boat and shuttle and then sets price
     if(this.router.url.includes('rentals')){
      if(boat == "Single Kayak"){
        switch(shuttle){
          case "None": this.price = 20; break;
          case "North-Aurora": this.price = 30; break;
          case "Batavia": this.price = 55; break;
        }
      } else if(boat == "Tandem" || boat == "Canoe"){
        switch(shuttle){
          case "None": this.price = 40; break;
          case "North-Aurora": this.price = 60; break;
          case "Batavia": this.price = 110; break;
        }
      } else if(boat == "Fishing Kayak"){
        switch(shuttle){
          case "None": this.price = 60; break;
          case "North-Aurora": this.price = 70; break;
          case "Batavia": this.price = 80; break;
        }
      }
    }else{
      this.price = null;
    }
  }

  durationResolver(){
    // resets time
    this.time = "";
    // sets duration based on shuttle
    if(this.shuttle == "None"){
      this.durationOptions = [
        {duration:"1 hour", value:"1"},
      ]
    }else if(this.shuttle == "North-Aurora"){
      this.durationOptions = [
        {duration:"1 hour", value:"1"}
      ]
    }else if(this.shuttle == "Batavia"){
      this.durationOptions = [
        {duration:"3 hours", value:"3"}
      ]
    }
  }

  timeResolver(){
    if(!this.date){
      this.dateErrorBoolean = true;
    } else {
      this.dateErrorBoolean = false;
      // gets three character day from date    
      const split = this.date.toString().split(" ")[0];
      // checks day and sets timeOptions to the available times of that day. 
      //Available times also based on shuttles
      if(split == "Mon" || split == "Tue" || split  == "Thu" || split  == "Fri"){
        if(this.shuttle === "None"){
          this.timeOptions = [
            {time:"8am", value:"8am"},
            {time:"10am", value:"10am"},
            {time:"12pm", value:"12pm"},
            {time:"2pm", value:"2pm"},
            {time:"4pm", value:"4pm"},
            {time:"6pm", value:"6pm"},
          ];
        }else if(this.shuttle === "North-Aurora"){
          this.timeOptions = [
            {time:"9am", value:"9am"},
            {time:"11am", value:"11am"},
            {time:"1pm", value:"1pm"},
            {time:"3pm", value:"3pm"},
            {time:"5pm", value:"5pm"},
          ];
        }else if(this.shuttle == "Batavia"){
          this.timeOptions =[
            {time:"9am", value:"9am"},
            {time:"11am", value:"11am"},
            {time:"1pm", value:"1pm"},
            {time:"3pm", value:"3pm"},
          ]
        }
      }else if(split == "Wed"){
        if(this.shuttle === "None"){
          this.timeOptions = [
            {time:"8am", value:"8am"},
            {time:"10am", value:"10am"},
            {time:"12pm", value:"12pm"},
            {time:"2pm", value:"2pm"},
          ];
        }else if(this.shuttle === "North-Aurora"){
          this.timeOptions = [
            {time:"9am", value:"9am"},
            {time:"11am", value:"11am"},
            {time:"1pm", value:"1pm"},
            {time:"3pm", value:"3pm"},
            {time:"5pm", value:"5pm"},
          ];
        }else if(this.shuttle == "Batavia"){
          this.timeOptions =[
            {time:"9am", value:"9am"},
            {time:"11am", value:"11am"},
            {time:"1pm", value:"1pm"},
            {time:"3pm", value:"3pm"},
          ]
        }
      }else if(split == "Sat" || split == "Sun"){
        if(this.shuttle == "None"){
          this.timeOptions = [
            {time:"8am", value:"8am"},
            {time:"10am", value:"10am"},
            {time:"12pm", value:"12pm"},
            {time:"2pm", value:"2pm"},
            {time:"4pm", value:"4pm"},
          ];
        } else if(this.shuttle == "North-Aurora"){
          this.timeOptions = [
            {time:"9am", value:"9am"},
            {time:"11am", value:"11am"},
            {time:"1pm", value:"1pm"},
            {time:"3pm", value:"3pm"},
            {time:"5pm", value:"5pm"},
          ];
        } else if(this.shuttle == "Batavia"){
          this.timeOptions = [
            {time:"9am", value:"9am"},
            {time:"11am", value:"11am"},
            {time:"1pm", value:"1pm"},
            {time:"3pm", value:"3pm"},
          ];
        }
      }
    }
    }

    pool(boat, duration, time){
      // subtracts from availability based on duration of trip plus one hour buffer
      if(boat === "Single Kayak" && duration === "1"){
        if(time === "8am"){
          this.availability[0].boats.kayak -= 1;
          this.availability[1].boats.kayak -= 1;
          // this.availability[2].boats.kayak -= 1;
        } else if( time === "9am"){
          this.availability[1].boats.kayak -= 1;
          this.availability[2].boats.kayak -= 1;
          // this.availability[3].boats.kayak -= 1;
        } else if( time === "10am"){
          this.availability[2].boats.kayak -= 1;
          this.availability[3].boats.kayak -= 1;
          // this.availability[4].boats.kayak -= 1;
        }else if( time === "11am"){
          this.availability[3].boats.kayak -= 1;
          this.availability[4].boats.kayak -= 1;
          // this.availability[5].boats.kayak -= 1;
        }else if( time === "12pm"){
          this.availability[4].boats.kayak -= 1;
          this.availability[5].boats.kayak -= 1;
          // this.availability[6].boats.kayak -= 1;
        }else if( time === "1pm"){
          this.availability[5].boats.kayak -= 1;
          this.availability[6].boats.kayak -= 1;
          // this.availability[7].boats.kayak -= 1;
        }else if( time === "2pm"){
          this.availability[6].boats.kayak -= 1;
          this.availability[7].boats.kayak -= 1;
          // this.availability[8].boats.kayak -= 1;
        }else if( time === "3pm"){
          this.availability[7].boats.kayak -= 1;
          this.availability[8].boats.kayak -= 1;
          // this.availability[9].boats.kayak -= 1;
        }else if( time === "4pm"){
          this.availability[8].boats.kayak -= 1;
          this.availability[9].boats.kayak -= 1;
          // this.availability[10].boats.kayak -= 1;
        }else if( time === "5pm"){
          this.availability[9].boats.kayak -= 1;
          this.availability[10].boats.kayak -= 1;
        }else if( time === "6pm"){
          this.availability[10].boats.kayak -= 1;
        }
    } else if (boat === "Single Kayak" && duration === "3"){
      if(time === "8am"){
        this.availability[0].boats.kayak -= 1;
        this.availability[1].boats.kayak -= 1;
        this.availability[2].boats.kayak -= 1;
        this.availability[3].boats.kayak -= 1;
        // this.availability[4].boats.kayak -= 1;
      } else if( time === "9am"){
        this.availability[1].boats.kayak -= 1;
        this.availability[2].boats.kayak -= 1;
        this.availability[3].boats.kayak -= 1;
        this.availability[4].boats.kayak -= 1;
        // this.availability[5].boats.kayak -= 1;
      } else if( time === "10am"){
        this.availability[2].boats.kayak -= 1;
        this.availability[3].boats.kayak -= 1;
        this.availability[4].boats.kayak -= 1;
        this.availability[5].boats.kayak -= 1;
        // this.availability[6].boats.kayak -= 1;
      }else if( time === "11am"){
        this.availability[3].boats.kayak -= 1;
        this.availability[4].boats.kayak -= 1;
        this.availability[5].boats.kayak -= 1;
        this.availability[6].boats.kayak -= 1;
        // this.availability[7].boats.kayak -= 1;
      }else if( time === "12pm"){
        this.availability[4].boats.kayak -= 1;
        this.availability[5].boats.kayak -= 1;
        this.availability[6].boats.kayak -= 1;
        this.availability[7].boats.kayak -= 1;
        // this.availability[8].boats.kayak -= 1;
      }else if( time === "1pm"){
        this.availability[5].boats.kayak -= 1;
        this.availability[6].boats.kayak -= 1;
        this.availability[7].boats.kayak -= 1;
        this.availability[8].boats.kayak -= 1;
        // this.availability[9].boats.kayak -= 1;
      }else if( time === "2pm"){
        this.availability[6].boats.kayak -= 1;
        this.availability[7].boats.kayak -= 1;
        this.availability[8].boats.kayak -= 1;
        this.availability[9].boats.kayak -= 1;
        // this.availability[10].boats.kayak -= 1;
      }else if( time === "3pm"){
        this.availability[7].boats.kayak -= 1;
        this.availability[8].boats.kayak -= 1;
        this.availability[9].boats.kayak -= 1;
        this.availability[10].boats.kayak -= 1;
      }else if( time === "4pm"){
        this.availability[8].boats.kayak -= 1;
        this.availability[9].boats.kayak -= 1;
        this.availability[10].boats.kayak -= 1;
      }else if( time === "5pm"){
        this.availability[9].boats.kayak -= 1;
        this.availability[10].boats.kayak -= 1;
      }else if( time === "6pm"){
        this.availability[10].boats.kayak -= 1;
      }
    } else if (boat === "Canoe" && duration === "1"){
      if(time === "8am"){
        this.availability[0].boats.canoe -= 1;
        this.availability[1].boats.canoe -= 1;
        // this.availability[2].boats.canoe -= 1;
      } else if( time === "9am"){
        this.availability[1].boats.canoe -= 1;
        this.availability[2].boats.canoe -= 1;
        // this.availability[3].boats.canoe -= 1;
      } else if( time === "10am"){
        this.availability[2].boats.canoe -= 1;
        this.availability[3].boats.canoe -= 1;
        // this.availability[4].boats.canoe -= 1;
      }else if( time === "11am"){
        this.availability[3].boats.canoe -= 1;
        this.availability[4].boats.canoe -= 1;
        // this.availability[5].boats.canoe -= 1;
      }else if( time === "12pm"){
        this.availability[4].boats.canoe -= 1;
        this.availability[5].boats.canoe -= 1;
        // this.availability[6].boats.canoe -= 1;
      }else if( time === "1pm"){
        this.availability[5].boats.canoe -= 1;
        this.availability[6].boats.canoe -= 1;
        // this.availability[7].boats.canoe -= 1;
      }else if( time === "2pm"){
        this.availability[6].boats.canoe -= 1;
        this.availability[7].boats.canoe -= 1;
        // this.availability[8].boats.canoe -= 1;
      }else if( time === "3pm"){
        this.availability[7].boats.canoe -= 1;
        this.availability[8].boats.canoe -= 1;
        // this.availability[9].boats.canoe -= 1;
      }else if( time === "4pm"){
        this.availability[8].boats.canoe -= 1;
        this.availability[9].boats.canoe -= 1;
        // this.availability[10].boats.canoe -= 1;
      }else if( time === "5pm"){
        this.availability[9].boats.canoe -= 1;
        this.availability[10].boats.canoe -= 1;
      }else if( time === "6pm"){
        this.availability[10].boats.canoe -= 1;
      }
    } else if (boat === "Canoe" && duration === "3"){
      if(time === "8am"){
        this.availability[0].boats.canoe -= 1;
        this.availability[1].boats.canoe -= 1;
        this.availability[2].boats.canoe -= 1;
        this.availability[3].boats.canoe -= 1;
        // this.availability[4].boats.canoe -= 1;
      } else if( time === "9am"){
        this.availability[1].boats.canoe -= 1;
        this.availability[2].boats.canoe -= 1;
        this.availability[3].boats.canoe -= 1;
        this.availability[4].boats.canoe -= 1;
        // this.availability[5].boats.canoe -= 1;
      } else if( time === "10am"){
        this.availability[2].boats.canoe -= 1;
        this.availability[3].boats.canoe -= 1;
        this.availability[4].boats.canoe -= 1;
        this.availability[5].boats.canoe -= 1;
        // this.availability[6].boats.canoe -= 1;
      }else if( time === "11am"){
        this.availability[3].boats.canoe -= 1;
        this.availability[4].boats.canoe -= 1;
        this.availability[5].boats.canoe -= 1;
        this.availability[6].boats.canoe -= 1;
        // this.availability[7].boats.canoe -= 1;
      }else if( time === "12pm"){
        this.availability[4].boats.canoe -= 1;
        this.availability[5].boats.canoe -= 1;
        this.availability[6].boats.canoe -= 1;
        this.availability[7].boats.canoe -= 1;
        // this.availability[8].boats.canoe -= 1;
      }else if( time === "1pm"){
        this.availability[5].boats.canoe -= 1;
        this.availability[6].boats.canoe -= 1;
        this.availability[7].boats.canoe -= 1;
        this.availability[8].boats.canoe -= 1;
        // this.availability[9].boats.canoe -= 1;
      }else if( time === "2pm"){
        this.availability[6].boats.canoe -= 1;
        this.availability[7].boats.canoe -= 1;
        this.availability[8].boats.canoe -= 1;
        this.availability[9].boats.canoe -= 1;
        // this.availability[10].boats.canoe -= 1;
      }else if( time === "3pm"){
        this.availability[7].boats.canoe -= 1;
        this.availability[8].boats.canoe -= 1;
        this.availability[9].boats.canoe -= 1;
        this.availability[10].boats.canoe -= 1;
      }else if( time === "4pm"){
        this.availability[8].boats.canoe -= 1;
        this.availability[9].boats.canoe -= 1;
        this.availability[10].boats.canoe -= 1;
      }else if( time === "5pm"){
        this.availability[9].boats.canoe -= 1;
        this.availability[10].boats.canoe -= 1;
      }else if( time === "6pm"){
        this.availability[10].boats.canoe -= 1;
      }
    } else if (boat === "Tandem" && duration === "1"){
      if(time === "8am"){
        this.availability[0].boats.tandem -= 1;
        this.availability[1].boats.tandem -= 1;
        // this.availability[2].boats.tandem -= 1;
      } else if( time === "9am"){
        this.availability[1].boats.tandem -= 1;
        this.availability[2].boats.tandem -= 1;
        // this.availability[3].boats.tandem -= 1;
      } else if( time === "10am"){
        this.availability[2].boats.tandem -= 1;
        this.availability[3].boats.tandem -= 1;
        // this.availability[4].boats.tandem -= 1;
      }else if( time === "11am"){
        this.availability[3].boats.tandem -= 1;
        this.availability[4].boats.tandem -= 1;
        // this.availability[5].boats.tandem -= 1;
      }else if( time === "12pm"){
        this.availability[4].boats.tandem -= 1;
        this.availability[5].boats.tandem -= 1;
        // this.availability[6].boats.tandem -= 1;
      }else if( time === "1pm"){
        this.availability[5].boats.tandem -= 1;
        this.availability[6].boats.tandem -= 1;
        // this.availability[7].boats.tandem -= 1;
      }else if( time === "2pm"){
        this.availability[6].boats.tandem -= 1;
        this.availability[7].boats.tandem -= 1;
        // this.availability[8].boats.tandem -= 1;
      }else if( time === "3pm"){
        this.availability[7].boats.tandem -= 1;
        this.availability[8].boats.tandem -= 1;
        // this.availability[9].boats.tandem -= 1;
      }else if( time === "4pm"){
        this.availability[8].boats.tandem -= 1;
        this.availability[9].boats.tandem -= 1;
        // this.availability[10].boats.tandem -= 1;
      }else if( time === "5pm"){
        this.availability[9].boats.tandem -= 1;
        this.availability[10].boats.tandem -= 1;
      }else if( time === "6pm"){
        this.availability[10].boats.tandem -= 1;
      }
    } else if (boat === "Tandem" && duration === "3"){
      if(time === "8am"){
        this.availability[0].boats.tandem -= 1;
        this.availability[1].boats.tandem -= 1;
        this.availability[2].boats.tandem -= 1;
        this.availability[3].boats.tandem -= 1;
        // this.availability[4].boats.tandem -= 1;
      } else if( time === "9am"){
        this.availability[1].boats.tandem -= 1;
        this.availability[2].boats.tandem -= 1;
        this.availability[3].boats.tandem -= 1;
        this.availability[4].boats.tandem -= 1;
        // this.availability[5].boats.tandem -= 1;
      } else if( time === "10am"){
        this.availability[2].boats.tandem -= 1;
        this.availability[3].boats.tandem -= 1;
        this.availability[4].boats.tandem -= 1;
        this.availability[5].boats.tandem -= 1;
        // this.availability[6].boats.tandem -= 1;
      }else if( time === "11am"){
        this.availability[3].boats.tandem -= 1;
        this.availability[4].boats.tandem -= 1;
        this.availability[5].boats.tandem -= 1;
        this.availability[6].boats.tandem -= 1;
        // this.availability[7].boats.tandem -= 1;
      }else if( time === "12pm"){
        this.availability[4].boats.tandem -= 1;
        this.availability[5].boats.tandem -= 1;
        this.availability[6].boats.tandem -= 1;
        this.availability[7].boats.tandem -= 1;
        // this.availability[8].boats.tandem -= 1;
      }else if( time === "1pm"){
        this.availability[5].boats.tandem -= 1;
        this.availability[6].boats.tandem -= 1;
        this.availability[7].boats.tandem -= 1;
        this.availability[8].boats.tandem -= 1;
        // this.availability[9].boats.tandem -= 1;
      }else if( time === "2pm"){
        this.availability[6].boats.tandem -= 1;
        this.availability[7].boats.tandem -= 1;
        this.availability[8].boats.tandem -= 1;
        this.availability[9].boats.tandem -= 1;
        // this.availability[10].boats.tandem -= 1;
      }else if( time === "3pm"){
        this.availability[7].boats.tandem -= 1;
        this.availability[8].boats.tandem -= 1;
        this.availability[9].boats.tandem -= 1;
        this.availability[10].boats.tandem -= 1;
      }else if( time === "4pm"){
        this.availability[8].boats.tandem -= 1;
        this.availability[9].boats.tandem -= 1;
        this.availability[10].boats.tandem -= 1;
      }else if( time === "5pm"){
        this.availability[9].boats.tandem -= 1;
        this.availability[10].boats.tandem -= 1;
      }else if( time === "6pm"){
        this.availability[10].boats.tandem -= 1;
      }
    } 
    
  }

}
