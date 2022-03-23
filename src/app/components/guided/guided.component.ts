import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/Customer';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-guided',
  templateUrl: './guided.component.html',
  styleUrls: ['./guided.component.css']
})
export class GuidedComponent implements OnInit {

  errorBoolean: boolean = false;
  isLoading: boolean = false;
  submitted: boolean = false;  

  constructor(private api: ApiService, private router: Router) {}

  rentalType: string = "guided";

  ngOnInit(): void {
  }

  custEventHandler(event: any){
    const customer: Customer = event;
    this.isLoading = true;
    // sends customer object to backend
    this.api.sendEmail("guided", customer).subscribe(res =>{
      this.isLoading = false;
      this.router.navigate(['thank-you-email']);
    });
  }
  
  


}
