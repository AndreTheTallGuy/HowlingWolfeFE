import * as uuid from 'uuid';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/Customer';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { PoolCheckerService } from 'src/app/services/pool-checker.service';
import { Boat } from 'src/app/models/Boat';

@Component({
  selector: 'app-guided',
  templateUrl: './guided.component.html',
  styleUrls: ['./guided.component.css']
})
export class GuidedComponent implements OnInit {

  selectionBoolean: boolean = true;
  mainTextBoolean: boolean = true;
  datePickerBoolean: boolean = false;
  errorBoolean: boolean = false;
  isLoading: boolean = false;
  quantityBoolean: boolean = false;
  addedToCartBoolean: boolean = false;
  
  errorText: string;
  tripText: string; 

  selectedTrip: string;
  totalBoatsArray: number[] = []
  numberOfGuests: number;

  shuttle: string;
  price: number;
  boatInfo: any;

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
       this.shuttle = "Batavia"
       this.tripText = " Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quam maxime commodi omnis dignissimos delectus corporis nesciunt voluptas repudiandae dolor sequi, tenetur unde pariatur ut aspernatur eligendi error eaque alias?  This is Batavia!";
       this.duration = "3";
       this.time = "5pm";
       this.price = 120;
        break;
      case "NA":
       this.shuttle = "North-Aurora"
       this.tripText = " Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quam maxime commodi omnis dignissimos delectus corporis nesciunt voluptas repudiandae dolor sequi, tenetur unde pariatur ut aspernatur eligendi error eaque alias?  This is NA!";
       this.duration = "1" 
       this.time = "5pm";
       this.price = 120;
        break;
      case "Blues":
       this.shuttle = "Blues"
       this.tripText = " Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quam maxime commodi omnis dignissimos delectus corporis nesciunt voluptas repudiandae dolor sequi, tenetur unde pariatur ut aspernatur eligendi error eaque alias?  This is Blues!";
       this.duration = "3" 
       this.time = "5pm";
       this.price = 120;
        break;
      case "Sunset":
       this.shuttle = "Sunset"
       this.tripText = " Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quam maxime commodi omnis dignissimos delectus corporis nesciunt voluptas repudiandae dolor sequi, tenetur unde pariatur ut aspernatur eligendi error eaque alias?  This is Sunset!";
       this.duration = "3"
       this.time = "5pm";
       this.price = 120;
        break;
    
    }
    this.selectionBoolean = false;
    this.datePickerBoolean = true;
  }

  submitDate(){
    //Date Validation *****************
    this.errorText = "Please enter a date";
    this.isLoading = true;
    this.datePickerBoolean = false;
    this.calcNumOfBoatsAvail();
  }

  calcNumOfBoatsAvail() {
    this.totalBoatsArray = [];
    this.checkPool.checkAvailability(this.date, "Single Kayak", this.duration, this.time).subscribe((res)=>{
      for (let i = 0; i <= res; i++) {
        this.totalBoatsArray.push(i); 
      }
      this.isLoading = false;
      this.quantityBoolean = true;
    });
  }


  submitTrip() {
    //Quantity Validation**************
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

  addAnotherBoat(){    
    this.selectionBoolean = true;
    this.mainTextBoolean = true;
    this.datePickerBoolean = false;
    this.errorBoolean = false;
    this.isLoading = false;
    this.quantityBoolean = false;
    this.addedToCartBoolean = false;
  }
}
