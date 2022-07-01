import * as uuid from 'uuid';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/Customer';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { PoolCheckerService } from 'src/app/services/pool-checker.service';
import { Boat } from 'src/app/models/Boat';
import { ThrowStmt } from '@angular/compiler';
import { forEachChild } from 'typescript';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';

@Component({
  selector: 'app-guided',
  templateUrl: './guided.component.html',
  styleUrls: ['./guided.component.css'],
  // encapsulation: ViewEncapsulation.None,
})
export class GuidedComponent implements OnInit {

  selectionBoolean: boolean = true;
  mainTextBoolean: boolean = true;
  datePickerBoolean: boolean = false;
  errorBoolean: boolean = false;
  isLoading: boolean = false;
  quantityBoolean: boolean = false;
  addedToCartBoolean: boolean = false;
  noAvailBoolean: boolean = false; 
  
  errorText: string;
  tripText: string; 

  selectedTrip: string;
  totalBoatsArray: number[] = []
  numberOfGuests: number = 0;

  shuttle: string;
  price: number;
  boatInfo: any;
  descTitle: string;
  displayTime: string;

  date: Date;
  guidedLessonsDates: any[] =[]
  minDate: Date;
  duration: string;
  time: string;

  dateValidation: FormGroup;
  dSubBoolean: boolean = false;
  quantityValidation: FormGroup;
  qSubBoolean: boolean = false;

  
  constructor(private api: ApiService, private router: Router, private sessStore: SessionStorageService, private checkPool: PoolCheckerService, private fb: FormBuilder) {}


  ngOnInit(): void {
    this.minDate = new Date;
    this.minDate.setDate(this.minDate.getDate() + 1);
    //Date Validation 
    this.dateValidation = this.fb.group({
      date: ['', Validators.required]
    })

    //Quantity Validation
    this.quantityValidation = this.fb.group({
      guests: ['', Validators.required]
    })

  }

  // ability to prevent certain days from being selected
  myFilter = (d: Date): boolean => {
    let tempArr = [];
    this.guidedLessonsDates.forEach(i => {
      let date = new Date(i);
      let ISO = new Date(`${date.getMonth() +1}/${date.getDate()+1}/${date.getFullYear()}`).getTime();
      tempArr.push(ISO);
    });
    if(d != undefined){
      return !(!tempArr.find(x=>x==d.getTime()));
    } else {
      return true;
    }
  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const highlightDate = this.guidedLessonsDates
        .map(i => new Date(i))
        .some(d => 
          d.getDate() === date.getDate() && 
          d.getMonth() === date.getMonth() && 
          d.getFullYear() === date.getFullYear());
        return highlightDate ? 'avail-date' : undefined;

    }
  }

  cardSelection(selectedTrip) {
    this.isLoading = false
    this.mainTextBoolean = false;
    this.selectedTrip = selectedTrip;
    switch (selectedTrip) {
      case "Sunset":
        this.descTitle = "Family Sunset & S'mores Kayak Tour";
        this.shuttle = "Sunset Cruise"
        this.duration = "1"
        this.time = "6pm";
        this.displayTime = "From 6pm-7pm on designated days listed below";
        this.price = 59;
        break;
      case "Blues":
        this.descTitle = "Blues Cruise";
        this.shuttle = "Blues Cruise"
        this.duration = "1" 
        this.time = "5pm";
        this.displayTime = "From 5pm-6pm on designated days listed below";
        this.price = 39;
        break;
      case "Batavia":
        this.descTitle = "Batavia - Aurora";
        this.shuttle = "Batavia"
        this.duration = "3";
        this.time = "8am";
        this.displayTime = "From 8am-11am on designated days listed below";
        this.price = 99;
        break;
      case "NA":
        this.descTitle = "North Aurora - Aurora";
        this.shuttle = "North Aurora"
        this.duration = "1" 
        this.time = "5pm";
        this.displayTime = "From 5pm-6pm on designated days listed below";
        this.price = 59;
        break;
      case "Brews":
        this.descTitle = "Brews Cruise";
        this.shuttle = "Brews Cruise"
        this.duration = "3"
        this.time = "5pm";
        this.displayTime = "From 5pm-8pm on designated days listed below";
        this.price = 115;
        break;
      case "Fall":
        this.descTitle = "Fall Colors Guided Kayak Tour (Batavia &ndash; Aurora)";
        this.shuttle = "Fall Cruise"
        this.duration = "3"
        this.time = "10am";
        this.displayTime = "From 10am-1pm on designated days listed below";
        this.price = 99;
        break;
    
    }
    this.selectionBoolean = false;

    this.isLoading = true;
    this.api.getTripAvail(this.shuttle).subscribe(res =>{
      if(res && res.dates.length >0){
        this.isLoading = false;
        console.log(res);
        this.guidedLessonsDates = res.dates;
        this.datePickerBoolean = true;
        this.noAvailBoolean = false; 
      } else {
        this.noAvailBoolean = true; 
        this.isLoading = false;
      } 
    })
    
  }


  submitDate(){
    if(this.date === undefined){
      this.errorBoolean = true;
      this.errorText = "Please pick a valid date";
    }else {
      this.errorBoolean = false;
      this.dSubBoolean = true;
      this.isLoading = true;
      this.datePickerBoolean = false;
      this.calcNumOfBoatsAvail();
    }
  }

  calcNumOfBoatsAvail() {
    this.numberOfGuests = 0;
    this.totalBoatsArray = [];
    this.checkPool.checkAvailability(this.date, "Single Kayak", this.duration, this.time).subscribe((res)=>{
      for (let i = 1; i <= res; i++) {
        this.totalBoatsArray.push(i); 
      }
      this.isLoading = false;
      if(this.totalBoatsArray.length < 1){
        this.errorBoolean = true; 
        this.errorText = "Sorry, there are no more reservations available for that date. Please choose another date.";
        this.datePickerBoolean = true;
      } else {
        this.quantityBoolean = true;
      }
    });
  }


  submitTrip() {
    if(this.numberOfGuests === 0){
      this.errorBoolean = true;
      this.errorText = "Please select how many people"
    }else {
      this.errorBoolean = false;
      this.qSubBoolean = true;
      this.isLoading = true;
  
      //Create Boat info multiplied by number of guests
      for (let i = 0; i < this.numberOfGuests; i++) {
        this.boatInfo = {
          id: uuid.v4(),
          boat: "Single Kayak",
          shuttle: this.shuttle,
          height: "N/A",
          weight: "N/A",
          date: this.date.toISOString(),
          duration: this.duration,
          time: this.time,
          price: this.price,
          type: "Guided",
          comment: ''
        }
        this.sessStore.addToSessionStorage(this.boatInfo);
      }
  
      this.errorBoolean = false;
      this.isLoading = false;
      this.datePickerBoolean = false;
      this.quantityBoolean = false;
      this.addedToCartBoolean = true;

    }
  }

  goBack(){    
    this.selectionBoolean = true;
    this.mainTextBoolean = true;
    this.datePickerBoolean = false;
    this.errorBoolean = false;
    this.isLoading = false;
    this.quantityBoolean = false;
    this.addedToCartBoolean = false;
  }

  addMore(){
    this.selectionBoolean = false;
    this.mainTextBoolean = true;
    this.datePickerBoolean = false;
    this.errorBoolean = false;
    this.isLoading = true;
    this.quantityBoolean = false;
    this.addedToCartBoolean = false;
    this.calcNumOfBoatsAvail()
  }

  get f() { return this.dateValidation.controls; }
  get b() { return this.quantityValidation.controls; }
}
