import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { TripAvail } from 'src/app/models/TripAvail';
import { ApiService } from 'src/app/services/api.service';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';


@Component({
  selector: 'app-select-dates',
  templateUrl: './select-dates.component.html',
  styleUrls: ['./select-dates.component.css'],
  
})
export class SelectDatesComponent implements OnInit {

  typesBoolean: boolean = true;
  datesBoolean: boolean = false;
  successBoolean: boolean = false;
  submitBoolean: boolean = false;
  errorBoolean: boolean = false;
  errorText: string = "";
  isLoading: boolean = false;

  tripType: string = "";
  typeOfTripsArray: string[] = ["Guided", "Lessons"];
  guidedArray: string[] = ["Batavia", "North Aurora", "Blues Cruise", "Sunset Cruise"]
  lessonsArray: string[] = ["Beginner", "Intermediate", "Advanced", "Extreme"]
  subType: string = "";
  availObj: TripAvail = {
    tripType: "",
    subType: "",
    dates: []
  }

  daysSelected: Date[] = [];
  calTempDateArray: any[] = [];
  
  event: any;
  minDate: Date;
  
  res: string = "Temp Text"
  
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.minDate = new Date;
    this.minDate.setDate(this.minDate.getDate());
    // this.form = this.formBuilder.group({
      //   tripType: ['', Validators.required],
      //   subType: ['', Validators.required],
      //   dates: ['', Validators.required],
      // })
    }

    ngDoCheck(){
      
    }
    
  next(){
      if(this.tripType == "" || this.subType ==""){
        this.errorBoolean = true;
        this.errorText = "All fields are mandatory";
      } else {
        this.errorBoolean = false;
        this.typesBoolean = false;
        this.isLoading = true;
        this.availObj.tripType = this.tripType;
        this.availObj.subType = this.subType;
        console.log(this.availObj);
        console.log(this.subType);
        let currentDates = this.api.getTripAvail(this.subType).subscribe(res =>{
          console.log(res);
          if(res){
            res.dates.forEach(i => {
            this.availObj.dates.push(i);
            this.calTempDateArray.push(i);
            console.log(this.availObj.dates);
            });
          }
          this.isLoading = false;
          this.datesBoolean = true;
        }, err => {
          console.log(err);
            this.isLoading = false;
            this.typesBoolean = true;
            this.errorBoolean = true;
            this.errorText = err;
        })
    }
  }

  submit(){
    console.log(this.availObj);
    if(this.availObj.dates === []){
      this.errorBoolean = true;
      this.errorText = "Please select some dates";
    } else {
      console.log(this.calTempDateArray);
      this.errorBoolean = false;
      this.datesBoolean = false;
      this.isLoading = true;
      this.api.updateTripAvail(this.availObj).subscribe(res => {
        console.log(res);
        this.res = res;
        this.isLoading = false;
        this.successBoolean = true; 
        
      }, err => {
        console.log(err);
        this.isLoading = false;
        this.datesBoolean = true;
        this.errorBoolean = true;
        this.errorText = err;
        
      })



    }
  }

  isSelected = (event: any) => {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    return this.calTempDateArray.find(x => x == date) ? "selected" : null;
  };
  
  select(event: any, calendar: any) {
    console.log(event);
    
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    const index = this.calTempDateArray.findIndex(x => x == date);
    if (index < 0) {
      this.calTempDateArray.push(date);
      this.availObj.dates.push(event);
      console.log(this.availObj.dates);
      
    }
    else {
      this.calTempDateArray.splice(index, 1);
      this.availObj.dates.splice(index, 1);
    }
    calendar.updateTodaysDate();
  }

  remove(date: string){
    for (let i = 0; i < this.calTempDateArray.length; i++) {
      if(this.calTempDateArray[i] === date){
        this.calTempDateArray.splice(i,1);
        this.availObj.dates.splice(i,1);
        console.log(this.availObj.dates);
        
      }
    }
  }

  // get f() { return this.form.controls; }

  // openCal(couponId) {
  //   const coupon = this.coupons.find(x => x.id == couponId);
  //   const dates = coupon.whenGood;
  //     return (date: Date): MatCalendarCellCssClasses => {
  //       const highlightDate = dates
  //         .map((strDate) => new Date(strDate))
  //         .some(
  //           (d) =>
  //             d.getDate() === date.getDate() &&
  //             d.getMonth() === date.getMonth() &&
  //             d.getFullYear() === date.getFullYear()
  //         );
  //       return highlightDate ? 'selected' : null;
  //     };
  // }

}
