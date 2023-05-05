import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export class MyAnimations {
  public static fadeAnimation = trigger('fadeAnimation', [
    state(
      'hide',
      style({
        opacity: 0,
      })
    ),
    state(
      'show',
      style({
        opacity: 1,
      })
    ),
    transition('* => hide', [animate(250)]),
    transition('* => show', [animate(750)]),
  ]);

  public static classicAnimation = trigger('classicAnimation', [
    transition(':enter', [style({ opacity: 0 }), animate(500)]),
    transition(':leave', [animate(500, style({ opacity: 0 }))]),
  ]);
}
