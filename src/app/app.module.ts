import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule,HttpClientJsonpModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule} from '@angular/material/icon'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';

import { NavbarComponent } from './components/navbar/navbar.component';
import { RentalComponent } from './components/rental/rental.component';
import { LessonsComponent } from './components/lessons/lessons.component';
import { GuidedComponent } from './components/guided/guided.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ContactComponent } from './components/contact/contact.component';
import { RentComponent } from './components/rent/rent.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminComponent } from './components/admin/admin.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { ThankyouemailComponent } from './components/thankyouemail/thankyouemail.component';
import { AdminresComponent } from './components/adminres/adminres.component';
import { FooterComponent } from './components/footer/footer.component';
import { GiftcardsComponent } from './components/giftcards/giftcards.component';
import { YesNoPipe } from './pipes/yes-no.pipe';
import { ContactformComponent } from './components/contactform/contactform.component'
import { PoolCheckerService } from './services/pool-checker.service';
import { ApiService } from './services/api.service';
import { CsvService } from './services/csv.service';
import { SessionStorageService } from './services/session-storage.service';
import { SubscribeService } from './services/subscribe.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RentalComponent,
    LessonsComponent,
    GuidedComponent,
    HomepageComponent,
    NotFoundComponent,
    ContactComponent,
    RentComponent,
    CartComponent,
    AdminComponent,
    ThankyouComponent,
    ThankyouemailComponent,
    AdminresComponent,
    FooterComponent,
    GiftcardsComponent,
    YesNoPipe,
    ContactformComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatTabsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatCheckboxModule,
    MatChipsModule,
    
  ],
  providers: [
    PoolCheckerService,
    ApiService,
    CsvService,
    SessionStorageService,
    SubscribeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
