import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import { BetActions } from 'src/app/store/action/bet.action';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from 'src/app/models/information-dialog-type';

@Component({
  selector: 'bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.scss'],
})
export class BetComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.category)
  category$!: Observable<ICategory>;

  @Select(BetState.contest)
  contest$!: Observable<IContest>;

  @Select(BetState.isOffline)
  isOffline$!: Observable<boolean>;

  @Select(BetterPointState.categoryToDisplay)
  betterPointsCategoryToDisplay$!: Observable<number>;

  @Select(BetState.allBetsDone)
  allBetsDone$!: Observable<boolean>;

  private isOfflineSub!: Subscription;
  private allBetsDoneSub!: Subscription;
  private betterSub!: Subscription;

  private better!: IBetter;

  public tutorialStep: number = 0;
  public tutorialLastStep: number = 4;

  public displayBetterPoints(
    betterPointsCategoryToDisplay: number | undefined
  ): boolean {
    return !!betterPointsCategoryToDisplay;
  }

  public ngOnInit() {
    this.isOfflineSub = this.isOffline$
      ?.pipe(filter((isOffline) => !!isOffline))
      .subscribe((isOffline) => {
        if (isOffline) {
          const config: MatDialogConfig<IInformationDialogConfig> = {
            data: {
              title: 'Session expirée',
              message: 'Votre session est expirée. Veuillez vous reconnecter.',
              dialogType: InformationDialogType.Information,
              labels: ['Me connecter'],
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
          const config: MatDialogConfig<IInformationDialogConfig> = {
            data: {
              title: 'Pronostics entièrement saisis',
              message:
                'Tous les pronostics ont été saisis. Vérifie que la durée du match le plus long te convienne',
              dialogType: InformationDialogType.Information,
              labels: ['Fermer'],
            },
          };

          this.dialog
            .open(InformationComponent, config)
            .afterClosed()
            .subscribe(() => {
              this.store.dispatch([new BetActions.UnsetAllBetsDone()]);
            });
        }
      });

    this.betterSub = this.better$
      .pipe(filter((better) => !!better))
      .subscribe((better) => {
        this.better = better;
        if (better.isTutorialDone) {
          window.localStorage.setItem('better', JSON.stringify(this.better));
        } else {
          this.tutorialStep = 1;
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

    if (this.betterSub) {
      this.betterSub.unsubscribe();
    }
  }

  public closeBetterPoints(better: IBetter | undefined) {
    this.store.dispatch([
      new BetterPointActions.GetBetterPoint(better?.accessKey || '', 0),
    ]);
  }

  public gotoNextTutorial() {
    this.tutorialStep++;
    if (this.tutorialStep === this.tutorialLastStep + 1) {
      // Dernier tutoriel à afficher
      this.storeBetterInLocalStorage();
      this.store.dispatch([new BetActions.SetTutorialDone()]);
    }
  }

  private storeBetterInLocalStorage() {
    this.better.isTutorialDone = true;
    window.localStorage.setItem('better', JSON.stringify(this.better));
  }
}
