import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/models/Customer';

@Component({
  selector: 'app-contactform',
  templateUrl: './contactform.component.html',
  styleUrls: ['./contactform.component.css']
})
export class ContactformComponent implements OnInit {

  @Output() customerEvent = new EventEmitter();

  isLoading: boolean = false;
  submitted: boolean = false;



  contact: FormGroup

  constructor(private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.contact = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: ['', Validators.compose([Validators.required, Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')])],
      message: ['', Validators.required]
    })
  }

  get f() { return this.contact.controls; }

  submit(){
    this.submitted = true;

    if(this.contact.invalid){
      return;
    } else {
      this.customerEvent.emit(this.contact.value);
    }


  }
}
