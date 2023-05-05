import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { Subject, combineLatest, map, takeUntil } from 'rxjs';
import { ICategory } from 'src/app/models/category';
import { IContest } from 'src/app/models/contest';
import { BetState } from 'src/app/store/state/bet.state';
import { InformationComponent } from '../information/information.component';
import { Router } from '@angular/router';
import { IBetter } from 'src/app/models/better';
import { BetActions } from 'src/app/store/action/bet.action';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from 'src/app/models/information-dialog-type';
import { CommonService } from 'src/app/services/rest/common.service';
import { PersistenceService } from 'src/app/services/persistence.service';

@Component({
  selector: 'bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.scss'],
})
export class BetComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private persistenceService = inject(PersistenceService);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.category)
  category$!: Observable<ICategory>;

  @Select(BetState.contest)
  contest$!: Observable<IContest>;

  @Select(BetState.isOffline)
  isOffline$!: Observable<boolean>;

  @Select(BetState.allBetsDone)
  allBetsDone$!: Observable<boolean>;

  private destroy$!: Subject<boolean>;

  private better!: IBetter;

  public tutorialLastStep: number = 4;

  public get tutorialStep(): number {
    return this.persistenceService.tutorialStep;
  }

  public set tutorialStep(tutorialStep: number) {
    this.persistenceService.tutorialStep = tutorialStep;
  }

  public displayBetterPoints(
    betterPointsCategoryToDisplay: number | undefined
  ): boolean {
    return !!betterPointsCategoryToDisplay;
  }

  public get withClubName(): boolean {
    return this.persistenceService.withClubName;
  }

  public set withClubName(withClubName: boolean) {
    this.persistenceService.withClubName = withClubName;
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    this.persistenceService.currentPage = 'bet';

    combineLatest([this.isOffline$, this.better$])
      .pipe(
        takeUntil(this.destroy$),
        map(([isOffline, better]) => {
          if (isOffline) {
            const config: MatDialogConfig<IInformationDialogConfig> = {
              data: {
                title: 'Session expirée',
                message: 'Ta session est expirée. Merci de te reconnecter.',
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

          this.better = better;

          if (better) {
            if (better.isTutorialDone) {
              if (!CommonService.isProduction) {
                window.localStorage.setItem(
                  'better',
                  JSON.stringify(this.better)
                );
              }
            } else {
              this.tutorialStep = 1;
            }
          }
        })
      )
      .subscribe();

    this.allBetsDone$
      .pipe(
        takeUntil(this.destroy$),
        map((allBetsDone) => {
          if (allBetsDone) {
            const config: MatDialogConfig<IInformationDialogConfig> = {
              data: {
                title: 'Pronostics entièrement saisis',
                message:
                  'Tous les pronostics ont été saisis. Vérifie que la durée du match le plus long te convienne.',
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
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
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
    if (!CommonService.isProduction) {
      window.localStorage.setItem('better', JSON.stringify(this.better));
    }
  }
}
