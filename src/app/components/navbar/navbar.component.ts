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
    // constantly checks session storage for new boats and updates quantity on cart img
    if(sessionStorage.getItem("cartList")){
        this.quantity = JSON.parse(sessionStorage.getItem("cartList")).length;        
      } else {
        this.quantity = undefined;
      }
  }
  cart(){
    this.router.navigate(["/cart"]);
  }
 
}
