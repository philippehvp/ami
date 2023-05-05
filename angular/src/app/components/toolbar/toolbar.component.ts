import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { IBet } from 'src/app/models/bet';
import { IBetter } from 'src/app/models/better';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetState } from 'src/app/store/state/bet.state';

export interface IToolbarOption {
  hasToolbar: boolean;
  isGobackToolbar: boolean;
}

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  private router = inject(Router);
  private persistenceService = inject(PersistenceService);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.completedBets)
  completedBets$!: Observable<number>;

  @Select(BetState.bets)
  bets$!: Observable<IBet[]>;

  public displayBettersBet() {
    this.router.navigate(['better-bet']);
  }

  public displayBettersRanking() {
    this.router.navigate(['better-ranking']);
  }

  public displayBettersOrderedByName() {
    this.router.navigate(['better-name']);
  }

  public toggleSideMenu() {
    this.persistenceService.sidenav.open();
  }
}
