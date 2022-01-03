import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { CartComponent } from './components/cart/cart.component';
import { ContactComponent } from './components/contact/contact.component';
import { GiftcardsComponent } from './components/giftcards/giftcards.component';
import { GuidedComponent } from './components/guided/guided.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LessonsComponent } from './components/lessons/lessons.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RentComponent } from './components/rent/rent.component';
import { RentalComponent } from './components/rental/rental.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { ThankyouemailComponent } from './components/thankyouemail/thankyouemail.component';

const routes: Routes = [
  { path: '', component: HomepageComponent, data: { animationState: 'Zero'}},
  { path: 'rentals', component: RentalComponent, data: { animationState: 'One'} },
  { path: 'lessons', component: LessonsComponent, data: { animationState: 'Two'} },
  { path: 'guided', component: GuidedComponent, data: { animationState: 'Three'} },
  { path: 'contact', component: ContactComponent, data: { animationState: 'Four'} },
  { path: 'giftcards', component: GiftcardsComponent },
  { path: 'rentme', component: RentComponent },
  { path: 'cart', component: CartComponent, data: { animationState: 'Five'}},
  { path: 'admin', component: AdminComponent },
  { path: 'thank-you', component: ThankyouComponent},
  { path: 'thank-you-email', component: ThankyouemailComponent},
  { path: '**', component: NotFoundComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }