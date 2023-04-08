import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { BetActions } from './store/action/bet.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private store: Store, private router: Router) {
    const better: string = window.localStorage.getItem('better') || '';

    if (better) {
      this.store.dispatch([new BetActions.SetBetter(JSON.parse(better))]);
    } else {
      this.router.navigate(['login']);
    }
  }
}
