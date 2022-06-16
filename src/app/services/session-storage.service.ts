import { Injectable } from '@angular/core';
import { Boat } from '../models/Boat';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  
  cartList: string;
  cartArray: Boat[] = [];

  constructor() { }

  public addToSessionStorage(boat:Boat){
    // Check session storage for already added boats
    if(sessionStorage.getItem("cartList")){
      //assign them to cartList
      this.cartList = sessionStorage.getItem("cartList");
      // initialize var with current cartlist
      const boatsInCart = JSON.parse(this.cartList);
      // push each boat into the cartArray
      for(let i=0; i < boatsInCart.length; i++){
        this.cartArray.push(boatsInCart[i]);
      }
      //push new boat into cartArray
      this.cartArray.push(boat);
      //sort cartArray by price ascending
      this.cartArray = this.cartArray.sort((a:any,b:any)=>{
        return a.price - b.price;
      })
      
      //convert cartArray to string
      this.cartList = JSON.stringify(this.cartArray);
      // add string to Session Storage
      sessionStorage.setItem("cartList", this.cartList);
      // clear the cartArray
      this.cartArray = [];
    } else {
      //push new boat to cartArray
      this.cartArray.push(boat);
      //add strigified version of cartArray to session storage
      sessionStorage.setItem("cartList", JSON.stringify(this.cartArray));
      //clear cartArray
      this.cartArray = [];
    }
  }
}
