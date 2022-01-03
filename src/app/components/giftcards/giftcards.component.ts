import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-giftcards',
  templateUrl: './giftcards.component.html',
  styleUrls: ['./giftcards.component.css']
})
export class GiftcardsComponent implements OnInit {

  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  message: string = null;
  amount: number = 60;

  constructor() { }

  ngOnInit(): void {
  }

  submit(){
    console.log(this.amount);
  }

}
