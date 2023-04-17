import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
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
export class ToolbarComponent {
  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.completedBets)
  completedBets$!: Observable<number>;

  @Select(BetState.bets)
  bets$!: Observable<IBet[]>;

  constructor(private store: Store, private router: Router) {}

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

  public displayBettersOrderedByName() {
    this.router.navigate(['better-name']);
  }
}
