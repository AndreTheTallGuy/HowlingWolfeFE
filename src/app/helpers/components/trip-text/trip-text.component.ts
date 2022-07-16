import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-text',
  templateUrl: './trip-text.component.html',
  styleUrls: ['./trip-text.component.css']
})
export class TripTextComponent implements OnInit {

  @Input() shuttle: string;
  @Input() noAvailBoolean: string;

  @Output() goBackEvent = new EventEmitter<string>();

  bataviaBoolean: boolean = false;
  naBoolean: boolean = false;
  bluesBoolean: boolean = false;
  sunsetBoolean: boolean = false;
  brewsBoolean: boolean = false;
  fallBoolean: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log(this.noAvailBoolean);
    
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

  goBack() {
    this.goBackEvent.next()
  }

  brewsLink() {
    // this.router.navigateByUrl('https://www.brewscruise.com/chicagoland/fox-river-kayak-and-brews/')
    window.open("https://www.brewscruise.com/chicagoland/fox-river-kayak-and-brews/", "_blank")
  }

}
