import { animate, style, transition, trigger } from '@angular/animations';

const leaveTrans = transition(':leave', [
  style({
    opacity: 1,
  }),
  animate(
    '0.2s ease-out',
    style({
      opacity: 0,
    })
  ),
]);

export const fadeOut = trigger('fadeOut', [leaveTrans]);
