import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BetActions } from './store/action/bet.action';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store
  ) { }

  public ngOnInit() {
    this.store.dispatch([new BetActions.GetBetters()]);

  }
}
