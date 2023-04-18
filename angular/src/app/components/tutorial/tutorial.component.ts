import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BetActions } from 'src/app/store/action/bet.action';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent {
  constructor(private store: Store, private router: Router) {}

  public close() {
    this.store.dispatch([new BetActions.SetTutorialDone()]);
    this.router.navigate(['bet']);
  }
}
