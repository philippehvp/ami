import { DOCUMENT } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { IBet } from 'src/app/models/bet';
import { IBetter } from 'src/app/models/better';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetState } from 'src/app/store/state/bet.state';
import { BetReviewComponent } from '../bet/bet-review/bet-review.component';

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
  private persistenceService = inject(PersistenceService);
  private dialog = inject(MatDialog);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.completedBets)
  completedBets$!: Observable<number>;

  @Select(BetState.bets)
  bets$!: Observable<IBet[]>;

  constructor() {}

  public get isDarkMode(): boolean {
    return this.persistenceService.isDarkMode;
  }

  public get darkModeIcon(): string {
    return this.persistenceService.isDarkMode ? 'dark_mode' : 'light_mode';
  }

  public toggleSideNav() {
    this.persistenceService.sidenav.open();
  }

  public toggleSponsor() {
    this.persistenceService.aboutnav.open();
  }

  public showBetsReview() {
    const config: MatDialogConfig = {
      disableClose: true,
    };

    this.dialog.open(BetReviewComponent, config);
  }
}
