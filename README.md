# Howling Wolfe Canoe and Kayak

Howling Wolfe is a Spring Boot / Angular application to allow customers to make reservations for canoe and kayak rentals in the west Chicago suburbs.
[Live Site](https://howlingwolfe.com)

## Features

- Ability for customers to make a reservation for a boat, date, time, and shuttle.
- Many verifications in place to ensure date, time, duration, etc match hours of operation.
- Program checks inventory at time of selection to prevent over booking rentals.
- On the cart screen, customers can add coupon codes.
- Once a coupon code is used it is put in local storage to prevent it being used again.
- Coupons are validated based on code and date of expiration.
- Checkout is acchieved through Stripe API and no cards are ever stored on the site.
- Upon successful checkout, an automated email is sent to customer and manager. 
- Admin page where managers can view/add reservations and create/view/delete coupons.

## Tech

- Angular 11
- Spring Boot
- Angular Material
- Bootstrap
- Heroku
- Firebase
- PostgreSQL
- Project Lombok
- JavaX Mail
- Stripe
- Maven

## Development

Site and design created by [Andre Entrekin](https://www.github.com/andrethetallguy)

[Front End Code](https://www.github.com/andrethetallguy/howlingwolfefe)

[Back End Code](https://www.github.com/andrethetallguy/howlingwolfe)
