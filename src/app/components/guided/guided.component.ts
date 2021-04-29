import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/Customer';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-guided',
  templateUrl: './guided.component.html',
  styleUrls: ['./guided.component.css']
})
export class GuidedComponent implements OnInit {

  errorBoolean: boolean = false;
  isLoading: boolean = false;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  submit(){
    if(this.firstName == "" || this.lastName == "" || this.email == "" || this.phone == "" || this.message == "" || this.firstName == undefined || this.lastName == undefined || this.email == undefined || this.phone == undefined || this.message == undefined){
      this.errorBoolean = true;
    }else{
      this.isLoading = true;
      const customer:Customer = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        message: this.message
      }
      console.log(customer);
      
      this.api.sendEmail("guided", customer).subscribe(res =>{
        console.log(res)
        this.isLoading = false;
        this.router.navigate(['thank-you-email']);
      });
    }
  }


}
