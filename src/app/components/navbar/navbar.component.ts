import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  quantity?: number;

  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }
  ngDoCheck(){
    if(sessionStorage.getItem("cartList")){
        this.quantity = JSON.parse(sessionStorage.getItem("cartList")).length;        
      } else {
        this.quantity = undefined;
      }
  }
  rentals(){
    console.log("clicking");
    
    this.router.navigate(["/cart"]);
  }
 
}
