import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { IBet } from 'src/app/models/bet';
import { IBetter } from 'src/app/models/better';
import { ConnectionActions } from 'src/app/store/action/connection.action';
import { BetState } from 'src/app/store/state/bet.state';
import { InformationComponent } from '../information/information.component';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from 'src/app/models/information-type';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  private store = inject(Store);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.completedBets)
  completedBets$!: Observable<number>;

  @Select(BetState.bets)
  bets$!: Observable<IBet[]>;

  @Select(BetState.allBetsDone)
  allBetsDone$!: Observable<boolean>;

  public logout(allBetsDone: boolean, isAdmin: boolean) {
    // On vérifie que le pronostiqueur ait saisi tous ses pronostics
    if (!allBetsDone && !isAdmin) {
      const config: MatDialogConfig<IInformationDialogConfig> = {
        data: {
          title: 'Pronostics incomplets',
          message:
            "Vous n'avez pas saisi tous les pronostics. Voulez-vous vraiment vous déconnecter ?",
          dialogType: InformationDialogType.YesNo,
        },
      };

      this.dialog
        .open(InformationComponent, config)
        .afterClosed()
        .subscribe((action: boolean) => {
          if (action) {
            this.disconnect();
          }
        });
    } else {
      this.disconnect();
    }
  }

  private disconnect() {
    this.store.dispatch([new ConnectionActions.Logout()]).subscribe(() => {
      window.localStorage.removeItem('better');
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
