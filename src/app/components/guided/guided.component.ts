import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/Customer';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionStorageService } from 'src/app/services/session-storage.service';

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

  selectedTrip: string;
  totalBoatsAvailable: number;
  totalBoatsArray: number[] = []
  numberOfGuests: number;

  date: Date;
  guidedLessonsDates: number[] = [new Date("6/20/2022").getTime(),
  new Date("6/24/2022").getTime()];
  minDate: Date;

  constructor(private api: ApiService, private router: Router, private sessStore: SessionStorageService) {}


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
    this.selectedTrip = selectedTrip;
    this.selectionBoolean = false;
    this.datePickerBoolean = true;
  }

  calcNumOfBoatsAvail() {
    console.log('inside calc');
    
    //***************pull current orders and check pool
    this.totalBoatsAvailable = 16;
    for (let i = 1; i <= this.totalBoatsAvailable; i++) {
      console.log("inside loop" + this.totalBoatsArray);
      
      this.totalBoatsArray.push(i); 
      console.log(this.totalBoatsArray);
    }
    
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

  // custEventHandler(event: any){
  //   const customer: Customer = event;
  //   this.isLoading = true;
  //   // sends customer object to backend
  //   this.api.sendEmail("guided", customer).subscribe(res =>{
  //     this.isLoading = false;
  //     this.router.navigate(['thank-you-email']);
  //   });
  // }
  
  


}
