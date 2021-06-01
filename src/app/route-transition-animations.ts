import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';

export const routeTransitionAnimations = trigger('trigger', [
    transition('Zero => One, One => Two, Two => Three, Three => Four, Four => Five, Zero => Two, Zero => Three, Zero => Four, Zero => Five, One => Three, One => Four, One => Five, Two => Four, Two => Five, Three => Five', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                right: 0,
                // width: '100%'
            })
        ]),
        query(':enter', [style({ transform: 'translateX(2000px)', opacity: 1 })]),
        query(':leave', animateChild()),
        group([
            query(':leave', [animate('.5s ease-out', style({ transform: 'translateX(-2000px)', opacity: 0 }))]),
            query(':enter', [animate('.5s ease-out', style({ transform: 'translateX(0px)', opacity: 1 }))])
           ]),
        query(':enter', animateChild())
    ]),
    transition('Five => Four, Four => Three, Three => Two, Two => One, One => Zero, Five => Three, Five => Two, Five => One, Five => Zero, Four => Two, Four => One, Four => Zero, Three => One, Three => Zero, Two => Zero', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            // width: '100%'
          })
        ]),
        query(':enter', [style({ transform: 'translateX(-2000px)', opacity: 1 })]),
        query(':leave', animateChild()),
        group([
          query(':leave', [animate('.5s ease-out', style({ transform: 'translateX(2000px)', opacity: 0 }))]),
          query(':enter', [animate('.5s ease-out', style({ transform: 'translateX(0px)', opacity: 1 }))])
         ]),
         query(':enter', animateChild())
       ])
]);