import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/Customer';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { PoolCheckerService } from 'src/app/services/pool-checker.service';

@Component({
  selector: 'app-guided',
  templateUrl: './guided.component.html',
  styleUrls: ['./guided.component.css']
})
export class GuidedComponent implements OnInit {

  selectionBoolean: boolean = true;
  datePickerBoolean: boolean = false;
  errorBoolean: boolean = false;
  errorText: string;
  isLoading: boolean = false;
  mainTextBoolean: boolean = true;

  tripText: string; 

  selectedTrip: string;
  // totalBoatsAvailable: number;
  totalBoatsArray: number[] = []
  numberOfGuests: number;

  date: Date;
  guidedLessonsDates: number[] = [new Date("6/19/2022").getTime(),
  new Date("6/22/2022").getTime()];
  minDate: Date;
  duration: string;
  time: string;

  constructor(private api: ApiService, private router: Router, private sessStore: SessionStorageService, private checkPool: PoolCheckerService) {}


  ngOnInit(): void {
    this.minDate = new Date;
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  // ability to prevent certain days from being selected
  myFilter = (d: Date): boolean => {
    if(d != undefined){
      return !(!this.guidedLessonsDates.find(x=>x==d.getTime()));
    } else {
      return true;
    }
  }

  cardSelection(selectedTrip) {
    this.mainTextBoolean = false;
    this.selectedTrip = selectedTrip;
    switch (selectedTrip) {
      case "Batavia":
       this.tripText = " Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quam maxime commodi omnis dignissimos delectus corporis nesciunt voluptas repudiandae dolor sequi, tenetur unde pariatur ut aspernatur eligendi error eaque alias?  This is Batavia!";
       this.duration = "3";
       this.time = "1pm";
        break;
      case "NA":
       this.tripText = " Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quam maxime commodi omnis dignissimos delectus corporis nesciunt voluptas repudiandae dolor sequi, tenetur unde pariatur ut aspernatur eligendi error eaque alias?  This is NA!";
       this.duration = "1" 
       this.time = "1pm";
        break;
      case "Blues":
       this.tripText = " Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quam maxime commodi omnis dignissimos delectus corporis nesciunt voluptas repudiandae dolor sequi, tenetur unde pariatur ut aspernatur eligendi error eaque alias?  This is Blues!";
       this.duration = "3" 
       this.time = "1pm";
        break;
      case "Sunset":
       this.tripText = " Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quam maxime commodi omnis dignissimos delectus corporis nesciunt voluptas repudiandae dolor sequi, tenetur unde pariatur ut aspernatur eligendi error eaque alias?  This is Sunset!";
       this.duration = "3"
       this.time = "1pm";
        break;
    
    }
    this.selectionBoolean = false;
    this.datePickerBoolean = true;
  }

  calcNumOfBoatsAvail() {
    this.totalBoatsArray = [];

    this.checkPool.checkAvailability(this.date, "Single Kayak", this.duration, this.time).subscribe((res)=>{
      for (let i = 0; i <= res; i++) {
        this.totalBoatsArray.push(i); 
      }
    });
    
  }

  submitTrip() {
    //**************Enter Pool Validation
    this.errorText = "Please enter a date";
    
    this.isLoading = true;

    //************** Create Boat info
    
    //************** Add to Cart/Session Storage service
    this.errorBoolean = false;
    this.isLoading = false;
    this.datePickerBoolean = false;

    console.log(this.numberOfGuests + " " + this.date);

  }
}
