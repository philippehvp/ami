import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs/operators';
import { ICategory } from 'src/app/models/category';
import { IContest } from 'src/app/models/contest';
import { BetState } from 'src/app/store/state/bet.state';
import { InformationComponent } from '../information/information.component';
import { Router } from '@angular/router';
import { BetterPointState } from 'src/app/store/state/better-point.state';
import { BetterPointActions } from 'src/app/store/action/better-point.action';
import { IBetter } from 'src/app/models/better';
import { TutorialComponent } from '../tutorial/tutorial.component';

@Component({
  selector: 'bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.scss'],
})
export class BetComponent implements OnInit, OnDestroy {
  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.category)
  category$!: Observable<ICategory>;

  @Select(BetState.contest)
  contest$!: Observable<IContest>;

  @Select(BetState.allBetsDone)
  allBetsDone$!: Observable<boolean>;

  @Select(BetState.isOffline)
  isOffline$!: Observable<boolean>;

  @Select(BetterPointState.categoryToDisplay)
  betterPointsCategoryToDisplay$!: Observable<number>;

  private isOfflineSub!: Subscription;
  private allBetsDoneSub!: Subscription;
  private betterPointsCategoryToDisplaySub!: Subscription;
  private betterSub!: Subscription;

  private betterPointsCategoryToDisplay!: number;

  private better!: IBetter;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private router: Router
  ) {}

  public get displayBetterPoints(): boolean {
    return !!this.betterPointsCategoryToDisplay;
  }

  public ngOnInit() {
    this.isOfflineSub = this.isOffline$
      ?.pipe(filter((isOffline) => !!isOffline))
      .subscribe((isOffline) => {
        if (isOffline) {
          const config: MatDialogConfig = {
            data: {
              title: 'Session expirée',
              message: 'Votre session est expirée. Veuillez vous reconnecter.',
            },
          };

          this.dialog
            .open(InformationComponent, config)
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
              title: 'Pronostics entièrement saisis',
              message:
                'Vous avez saisi tous les pronostics. Assurez-vous que la durée du match le plus long vous convienne.',
            },
          };

          this.dialog.open(InformationComponent, config);
        }
      });

    this.betterPointsCategoryToDisplaySub =
      this.betterPointsCategoryToDisplay$.subscribe(
        (betterPointsCategoryToDisplay) =>
          (this.betterPointsCategoryToDisplay = betterPointsCategoryToDisplay)
      );

    this.betterSub = this.better$
      .pipe(filter((better) => !!better))
      .subscribe((better) => {
        this.better = better;
      });
  }

  public ngOnDestroy() {
    if (this.isOfflineSub) {
      this.isOfflineSub.unsubscribe();
    }

    if (this.allBetsDoneSub) {
      this.allBetsDoneSub.unsubscribe();
    }

    if (this.betterPointsCategoryToDisplaySub) {
      this.betterPointsCategoryToDisplaySub.unsubscribe();
    }

    if (this.betterSub) {
      this.betterSub.unsubscribe();
    }
  }

  public closeBetterPoints() {
    this.store.dispatch([
      new BetterPointActions.GetBetterPoint(this.better.accessKey, 0),
    ]);
  }
}
