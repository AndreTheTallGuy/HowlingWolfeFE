import * as uuid from 'uuid';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Boat } from 'src/app/models/Boat';
import { Time } from 'src/app/models/Time';
import { Duration } from 'src/app/models/Duration';
import { Times } from 'src/app/models/Times';
import { ApiService } from 'src/app/services/api.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { Router } from '@angular/router';
import { LogicalFileSystem } from '@angular/compiler-cli/src/ngtsc/file_system';
import { PoolCheckerService } from 'src/app/services/pool-checker.service';



@Component({
  selector: 'app-rent',
  templateUrl: './rent.component.html',
  styleUrls: ['./rent.component.css']
})
export class RentComponent implements OnInit {

  @Input() rentalType: string;

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
  adminPageBoolean: boolean = false;
  dateErrorBoolean: boolean = false;

  noAvailText: string;
  
  date: any;
  shuttle: any;
  time: any;
  duration: any;
  height: any;
  weight: any;
  price: number;
  comment: string;
  
  typeArray: string[] = ["Rental", "Guided", "Lesson", "Blocked"]
  type: string;

  cartArray?: Boat[] = [];
  cartList?: string;
  boatsInCart: Boat[];
  isBoatInCart: boolean = false;
  
  minDate: Date;

  timeOptions: Time[];
  durationOptions: Duration[];

  guidedLessonsDates: number[] = [new Date("3/20/2022").getTime(),
  new Date("3/24/2022").getTime()];

  constructor(private api: ApiService, private router: Router, private sessStore: SessionStorageService, private poolChecker: PoolCheckerService) { }
  
  ngOnInit(): void {
    // if url is /rentals, sets the datepickers mindate to tomorrow
    if(this.rentalType === 'rental'){
      this.minDate = new Date;
      this.minDate.setDate(this.minDate.getDate() + 1);
    }
    if(JSON.parse(sessionStorage.getItem("cartList")) && JSON.parse(sessionStorage.getItem("cartList")).length > 0){
      this.isBoatInCart = true;
    }
    
  }
  // ability to prevent certain days from being selected
  myFilter = (d: Date): boolean => {
    if(this.rentalType === 'guided' || this.rentalType === 'lessons'){
      if(d != undefined){
        return !(!this.guidedLessonsDates.find(x=>x==d.getTime()));
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  resetDuration(){
    this.duration = "";
  }
  
  dateReset(){
    this.time = "";
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

  

  submitDate(){
    // validates empty fields
    if(this.height == "" || this.weight == "" || this.date == "" || this.duration == "" || this.time == "" || this.height == undefined || this.weight == undefined || this.date == undefined || this.duration == undefined || this.time == undefined){
      this.errorBoolean = true;
    }else{
    this.isLoading = true;
    this.dateBoolean = false;
    this.noAvailError = false;
    this.errorBoolean = false;
    let checkPoolService = this.poolChecker.checkPool(this.date, this.selectedBoat, this.duration, this.time).subscribe((res)=> {
      console.log(res)
      if(res){
        // if on the customer facing rental page
        if(this.router.url.includes('rentals')){
        // if time is available, get price and construct boatInfo object
        this.priceResolver(this.selectedBoat, this.shuttle);
        } 
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
          type: this.type,
          comment: this.comment
        }
        // add boat to session storage
        this.sessStore.addToSessionStorage(this.boatInfo);
        this.isLoading = false;
        this.isBoatInCart = true;
        // if customer facing, offer to send user to cart or add more boats
        if(this.router.url.includes('rentals')){
          this.addedToCartBoolean = true;
        } else {
          this.adminResOptions = true;
        }
        this.height = "";
        this.weight = "";

        }else{
          this.isLoading = false;
          this.dateBoolean = true;
          this.noAvailText = `Sorry, we do not have any ${this.selectedBoat}s for that date and time. Please try another date or time.`;
          this.noAvailError = true; 
        }      
      })
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
    this.dateBoolean = false;
    this.adminResOptions = false;
    this.adminResBoolean = true;
  }

  backToBoatSelect(){
    this.selectedBoat = null;
    this.boatBoolean = true;
    this.dateBoolean = false;
  }

  priceResolver(boat:string, shuttle: string){
     // checks type of boat and shuttle and then sets price
      if(boat == "Single Kayak"){
        switch(shuttle){
          case "None": this.price = 20; break;
          case "North-Aurora": this.price = 39; break;
          case "Batavia": this.price = 69; break;
        }
      } else if(boat == "Tandem" || boat == "Canoe"){
        switch(shuttle){
          case "None": this.price = 40; break;
          case "North-Aurora": this.price = 78; break;
          case "Batavia": this.price = 138; break;
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

 
}
