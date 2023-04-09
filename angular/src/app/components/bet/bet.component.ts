import { Dialog } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs/operators';
import { ICategory } from 'src/app/models/category';
import { IContest } from 'src/app/models/contest';
import { BetState } from 'src/app/store/state/bet.state';
import { InformationDialogComponent } from '../information-dialog/information-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.scss'],
})
export class BetComponent implements OnInit, OnDestroy {
  @Select(BetState.category)
  category$!: Observable<ICategory>;

  @Select(BetState.contest)
  contest$!: Observable<IContest>;

  @Select(BetState.allBetsDone)
  allBetsDone$!: Observable<boolean>;

  @Select(BetState.isOffline)
  isOffline$!: Observable<boolean>;

  private isOfflineSub!: Subscription;
  private allBetsDoneSub!: Subscription;

  constructor(private dialog: MatDialog, private router: Router) {}

  public ngOnInit() {
    this.isOfflineSub = this.isOffline$
      ?.pipe(filter((isOffline) => !!isOffline))
      .subscribe((isOffline) => {
        if (isOffline) {
          const config: MatDialogConfig = {
            data: {
              title: 'Session expirée',
              message: 'Votre session est expirée. Veuillez vous reconnecter',
            },
          };

          this.dialog
            .open(InformationDialogComponent, config)
            .afterClosed()
            .subscribe(() => {
              return this.router.navigate(['login']);
            });
        }
        return;
      });

    this.allBetsDoneSub = this.allBetsDone$
      .pipe(filter((allBetsDone) => !!allBetsDone))
      .subscribe((allBetsDone) => {
        if (allBetsDone) {
          const config: MatDialogConfig = {
            data: {
              title: 'Pronostics saisis et validés',
              message:
                'Vous avez saisi tous les pronostics. Assurez-vous que la durée du match le plus long vous convienne.',
            },
          };

          this.dialog.open(InformationDialogComponent, config);
        }
      });
  }

  public ngOnDestroy() {
    if (this.isOfflineSub) {
      this.isOfflineSub.unsubscribe();
    }

    if (this.allBetsDoneSub) {
      this.allBetsDoneSub.unsubscribe();
    }
  }
}
