import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { IBet } from 'src/app/models/bet';
import { IBetter } from 'src/app/models/better';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetState } from 'src/app/store/state/bet.state';
import { BetReviewComponent } from '../bet/bet-review/bet-review.component';
// import { SettingDialogComponent } from '../setting-dialog/setting-dialog.component';

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

  // public openSettingDialog() {
  //   this.dialog.open(SettingDialogComponent);
  // }
}
