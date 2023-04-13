import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Subscription, filter } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IBet } from 'src/app/models/bet';
import { IBetter } from 'src/app/models/better';
import { ConnectionActions } from 'src/app/store/action/connection.action';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.completedBets)
  completedBets$!: Observable<number>;

  @Select(BetState.bets)
  bets$!: Observable<IBet[]>;

  constructor(private store: Store, private router: Router) {}

  public ngOnInit() {}

  public ngOnDestroy() {}

  public logout() {
    this.store.dispatch([new ConnectionActions.Logout()]).subscribe(() => {
      this.router.navigate(['login']);
    });
  }

  public displayBettersBet() {
    this.router.navigate(['better-bet']);
  }

  public displayBettersRanking() {
    this.router.navigate(['better-ranking']);
  }
}
