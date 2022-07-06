import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  quantity?: number;
  background: ThemePalette = undefined;

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


  toggleBackground() {
    this.background = this.background ? undefined : 'primary';
  }


  cart(){
    this.router.navigate(["/cart"]);
  }
 
}
