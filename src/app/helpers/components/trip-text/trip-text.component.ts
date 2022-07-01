import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-trip-text',
  templateUrl: './trip-text.component.html',
  styleUrls: ['./trip-text.component.css']
})
export class TripTextComponent implements OnInit {

  @Input() shuttle: string;

  bataviaBoolean: boolean = false;
  naBoolean: boolean = false;
  bluesBoolean: boolean = false;
  sunsetBoolean: boolean = false;
  brewsBoolean: boolean = false;
  fallBoolean: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
    console.log(this.shuttle);
    
    switch(this.shuttle){
      case "Batavia" :
        this.bataviaBoolean = true;
        break;
      case "North Aurora":
        this.naBoolean = true;
        break;
      case "Blues Cruise":
        this.bluesBoolean = true;
        break;
      case "Sunset Cruise":
        this.sunsetBoolean = true;
        break;
      case "Brews Cruise":
        this.brewsBoolean = true;
        break;
      case "Fall Cruise":
        this.fallBoolean = true;
        break;

    }

  }
  

}
