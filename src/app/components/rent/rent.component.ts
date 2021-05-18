import * as uuid from 'uuid';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Boat } from 'src/app/models/Boat';
import { Time } from 'src/app/models/Time';
import { Duration } from 'src/app/models/Duration';
import { Times } from 'src/app/models/Times';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';


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
  
  minDate: Date = new Date;

  timeOptions: Time[];
  durationOptions: Duration[];

  availability: Times[] = []

  constructor(private api: ApiService, private router: Router ) { }
  
  ngOnInit(): void {
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.resetTimesArray();
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

  resetTimeAndDuration(){
    this.duration = "";
    this.time = "";
  }
 
  boatSelection(event){
    console.log(event.srcElement.alt);
    this.selectedBoat = event.srcElement.alt;
    this.boatBoolean = false;
    this.dateBoolean = true;
  }

  resetTimesArray(){
    this.availability = [
    {time:"8am", boats:{kayak: 9, canoe: 2}},
    {time:"9am", boats:{kayak: 9, canoe: 2}},
    {time: "10am", boats: {kayak: 9, canoe: 2}},
    {time: "11am", boats: {kayak: 9, canoe: 2}},
    {time: "12pm", boats: {kayak: 9, canoe: 2}},
    {time: "1pm", boats: {kayak: 9, canoe: 2}},
    {time: "2pm", boats: {kayak: 9, canoe: 2}},
    {time: "3pm", boats: {kayak: 9, canoe: 2}},
    {time: "4pm", boats: {kayak: 9, canoe: 2}},
    {time: "5pm", boats: {kayak: 9, canoe: 2}},
    {time: "6pm", boats: {kayak: 9, canoe: 2}}
  ]
  }

  submitDate(){
    this.isLoading = true;
    this.dateBoolean = false;
    this.noAvailError = false;
    if(this.height == "" || this.weight == "" || this.date == "" || this.duration == "" || this.time == "" || this.height == undefined || this.weight == undefined || this.date == undefined || this.duration == undefined || this.time == undefined){
      this.errorBoolean = true;
    }else{
      this.api.getAllOrdersByDate(this.date).subscribe((res)=>{
        console.log(res);
        for(let order of res){
          for(let boat of order.boats){
            this.pool(boat.boat, boat.duration, boat.time);
          }
        }
        this.pool(this.selectedBoat, this.duration, this.time);
      if(this.availability[0].boats.canoe < 0 || this.availability[0].boats.kayak <0 ||
        this.availability[1].boats.canoe < 0 || this.availability[1].boats.kayak <0 ||
        this.availability[2].boats.canoe < 0 || this.availability[2].boats.kayak <0 ||
        this.availability[3].boats.canoe < 0 || this.availability[3].boats.kayak <0 ||
        this.availability[4].boats.canoe < 0 || this.availability[4].boats.kayak <0 ||
        this.availability[5].boats.canoe < 0 || this.availability[5].boats.kayak <0 ||
        this.availability[6].boats.canoe < 0 || this.availability[6].boats.kayak <0 ||
        this.availability[7].boats.canoe < 0 || this.availability[7].boats.kayak <0 ||
        this.availability[8].boats.canoe < 0 || this.availability[8].boats.kayak <0 ||
        this.availability[9].boats.canoe < 0 || this.availability[9].boats.kayak <0 ||
        this.availability[10].boats.canoe < 0 || this.availability[10].boats.kayak <0){
          console.log("Out of " + this.selectedBoat);
          this.isLoading = false;
          this.noAvailText = `Sorry, we do not have any ${this.selectedBoat}s for that date and time. Please try another date or time.`
          this.noAvailError = true;
          this.dateBoolean = true;
          this.resetTimesArray();

        }else{
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
          console.log(this.boatInfo);
          this.addToSessionStorage(this.boatInfo);
          this.isLoading = false;
          if(this.router.url.includes('rentals')){
            this.addedToCartBoolean = true;
          } else {
            this.adminResOptions = true;
          }
          this.height = "";
          this.weight = "";
          this.resetTimesArray();
        }
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
    if(boat == "Single Kayak"){
      switch(shuttle){
        case "None": this.price = 40; break;
        case "North-Aurora": this.price = 50; break;
        case "Batavia": this.price = 60; break;
      }
    } else if(boat == "Tandem Kayak" || boat == "Canoe"){
      switch(shuttle){
        case "None": this.price = 55; break;
        case "North-Aurora": this.price = 65; break;
        case "Batavia": this.price = 75; break;
      }
    } else if(boat == "Fishing Kayak"){
      switch(shuttle){
        case "None": this.price = 60; break;
        case "North-Aurora": this.price = 70; break;
        case "Batavia": this.price = 80; break;
      }
    }
  }

  durationResolver(){
    this.time = "";

    if(this.shuttle == "None"){
      this.durationOptions = [
        {duration:"2 hours", value:"2"},
      ]
    }else if(this.shuttle == "North-Aurora"){
      this.durationOptions = [
        {duration:"2 hours", value:"2"}
      ]
    }else if(this.shuttle == "Batavia"){
      this.durationOptions = [
        {duration:"4 hours", value:"4"}
      ]
    }
  }

  timeResolver(){
    
    const split = this.date.toString().split(" ")[0];
    console.log(split);
    
    if(split == "Mon" || split == "Tue" || split == "Wed" || split  == "Thu" || split  == "Fri"){
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
        ];
      }else if(this.shuttle == "Batavia"){
        this.timeOptions =[
          {time:"9am", value:"9am"},
          {time:"11am", value:"11am"},
          {time:"1pm", value:"1pm"},
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
        ];
      } else if(this.shuttle == "Batavia"){
        this.timeOptions = [
          {time:"9am", value:"9am"},
          {time:"11am", value:"11am"},
        ];
      }
    }
  }

  pool(boat, duration, time){
    
    if(boat === "Single Kayak" && duration === "2"){
        if(time === "8am"){
          this.availability[0].boats.kayak -= 1;
          this.availability[1].boats.kayak -= 1;
          this.availability[2].boats.kayak -= 1;
        } else if( time === "9am"){
          this.availability[1].boats.kayak -= 1;
          this.availability[2].boats.kayak -= 1;
          this.availability[3].boats.kayak -= 1;
        } else if( time === "10am"){
          this.availability[2].boats.kayak -= 1;
          this.availability[3].boats.kayak -= 1;
          this.availability[4].boats.kayak -= 1;
        }else if( time === "11am"){
          this.availability[3].boats.kayak -= 1;
          this.availability[4].boats.kayak -= 1;
          this.availability[5].boats.kayak -= 1;
        }else if( time === "12pm"){
          this.availability[4].boats.kayak -= 1;
          this.availability[5].boats.kayak -= 1;
          this.availability[6].boats.kayak -= 1;
        }else if( time === "1pm"){
          this.availability[5].boats.kayak -= 1;
          this.availability[6].boats.kayak -= 1;
          this.availability[7].boats.kayak -= 1;
        }else if( time === "2pm"){
          this.availability[6].boats.kayak -= 1;
          this.availability[7].boats.kayak -= 1;
          this.availability[8].boats.kayak -= 1;
        }else if( time === "3pm"){
          this.availability[7].boats.kayak -= 1;
          this.availability[8].boats.kayak -= 1;
          this.availability[9].boats.kayak -= 1;
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
    } else if (boat === "Single Kayak" && duration === "4"){
      if(time === "8am"){
        this.availability[0].boats.kayak -= 1;
        this.availability[1].boats.kayak -= 1;
        this.availability[2].boats.kayak -= 1;
        this.availability[3].boats.kayak -= 1;
        this.availability[4].boats.kayak -= 1;
      } else if( time === "9am"){
        this.availability[1].boats.kayak -= 1;
        this.availability[2].boats.kayak -= 1;
        this.availability[3].boats.kayak -= 1;
        this.availability[4].boats.kayak -= 1;
        this.availability[5].boats.kayak -= 1;
      } else if( time === "10am"){
        this.availability[2].boats.kayak -= 1;
        this.availability[3].boats.kayak -= 1;
        this.availability[4].boats.kayak -= 1;
        this.availability[5].boats.kayak -= 1;
        this.availability[6].boats.kayak -= 1;
      }else if( time === "11am"){
        this.availability[3].boats.kayak -= 1;
        this.availability[4].boats.kayak -= 1;
        this.availability[5].boats.kayak -= 1;
        this.availability[6].boats.kayak -= 1;
        this.availability[7].boats.kayak -= 1;
      }else if( time === "12pm"){
        this.availability[4].boats.kayak -= 1;
        this.availability[5].boats.kayak -= 1;
        this.availability[6].boats.kayak -= 1;
        this.availability[7].boats.kayak -= 1;
        this.availability[8].boats.kayak -= 1;
      }else if( time === "1pm"){
        this.availability[5].boats.kayak -= 1;
        this.availability[6].boats.kayak -= 1;
        this.availability[7].boats.kayak -= 1;
        this.availability[8].boats.kayak -= 1;
        this.availability[9].boats.kayak -= 1;
      }else if( time === "2pm"){
        this.availability[6].boats.kayak -= 1;
        this.availability[7].boats.kayak -= 1;
        this.availability[8].boats.kayak -= 1;
        this.availability[9].boats.kayak -= 1;
        this.availability[10].boats.kayak -= 1;
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
    } else if (boat === "Canoe" && duration === "2"){
      if(time === "8am"){
        this.availability[0].boats.canoe -= 1;
        this.availability[1].boats.canoe -= 1;
        this.availability[2].boats.canoe -= 1;
      } else if( time === "9am"){
        this.availability[1].boats.canoe -= 1;
        this.availability[2].boats.canoe -= 1;
        this.availability[3].boats.canoe -= 1;
      } else if( time === "10am"){
        this.availability[2].boats.canoe -= 1;
        this.availability[3].boats.canoe -= 1;
        this.availability[4].boats.canoe -= 1;
      }else if( time === "11am"){
        this.availability[3].boats.canoe -= 1;
        this.availability[4].boats.canoe -= 1;
        this.availability[5].boats.canoe -= 1;
      }else if( time === "12pm"){
        this.availability[4].boats.canoe -= 1;
        this.availability[5].boats.canoe -= 1;
        this.availability[6].boats.canoe -= 1;
      }else if( time === "1pm"){
        this.availability[5].boats.canoe -= 1;
        this.availability[6].boats.canoe -= 1;
        this.availability[7].boats.canoe -= 1;
      }else if( time === "2pm"){
        this.availability[6].boats.canoe -= 1;
        this.availability[7].boats.canoe -= 1;
        this.availability[8].boats.canoe -= 1;
      }else if( time === "3pm"){
        this.availability[7].boats.canoe -= 1;
        this.availability[8].boats.canoe -= 1;
        this.availability[9].boats.canoe -= 1;
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
    } else if (boat === "Canoe" && duration === "4"){
      if(time === "8am"){
        this.availability[0].boats.canoe -= 1;
        this.availability[1].boats.canoe -= 1;
        this.availability[2].boats.canoe -= 1;
        this.availability[3].boats.canoe -= 1;
        this.availability[4].boats.canoe -= 1;
      } else if( time === "9am"){
        this.availability[1].boats.canoe -= 1;
        this.availability[2].boats.canoe -= 1;
        this.availability[3].boats.canoe -= 1;
        this.availability[4].boats.canoe -= 1;
        this.availability[5].boats.canoe -= 1;
      } else if( time === "10am"){
        this.availability[2].boats.canoe -= 1;
        this.availability[3].boats.canoe -= 1;
        this.availability[4].boats.canoe -= 1;
        this.availability[5].boats.canoe -= 1;
        this.availability[6].boats.canoe -= 1;
      }else if( time === "11am"){
        this.availability[3].boats.canoe -= 1;
        this.availability[4].boats.canoe -= 1;
        this.availability[5].boats.canoe -= 1;
        this.availability[6].boats.canoe -= 1;
        this.availability[7].boats.canoe -= 1;
      }else if( time === "12pm"){
        this.availability[4].boats.canoe -= 1;
        this.availability[5].boats.canoe -= 1;
        this.availability[6].boats.canoe -= 1;
        this.availability[7].boats.canoe -= 1;
        this.availability[8].boats.canoe -= 1;
      }else if( time === "1pm"){
        this.availability[5].boats.canoe -= 1;
        this.availability[6].boats.canoe -= 1;
        this.availability[7].boats.canoe -= 1;
        this.availability[8].boats.canoe -= 1;
        this.availability[9].boats.canoe -= 1;
      }else if( time === "2pm"){
        this.availability[6].boats.canoe -= 1;
        this.availability[7].boats.canoe -= 1;
        this.availability[8].boats.canoe -= 1;
        this.availability[9].boats.canoe -= 1;
        this.availability[10].boats.canoe -= 1;
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
    }
    
    console.log(this.availability);
    
    
  }

}
