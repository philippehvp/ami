import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { BetActions } from './store/action/bet.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private store = inject(Store);
  private router = inject(Router);

  constructor() {
    //const better: string = window.localStorage.getItem('better') || '';

    //if (better) {
    //   this.store.dispatch([new BetActions.SetBetter(JSON.parse(better))]);
    //   this.router.navigate(['bet']);
    // } else {
    this.router.navigate(['login']);
    //}
  }
}
