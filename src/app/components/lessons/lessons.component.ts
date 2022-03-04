import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/Customer';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {

  isLoading: boolean = false;

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  custEventHandler(event: any){
    const customer: Customer = event;
    this.isLoading = true;
    // sends customer object to backend
    this.api.sendEmail("lessons", customer).subscribe(res =>{
      this.isLoading = false;
      this.router.navigate(['thank-you-email']);
    });
  }


}
