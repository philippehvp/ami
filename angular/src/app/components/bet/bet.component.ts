import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { Subject, combineLatest, map, takeUntil } from 'rxjs';
import { ICategory } from 'src/app/models/category';
import { IContest } from 'src/app/models/contest';
import { BetState } from 'src/app/store/state/bet.state';
import { InformationComponent } from '../information/information.component';
import { IBetter } from 'src/app/models/better';
import { BetActions } from 'src/app/store/action/bet.action';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from 'src/app/models/information-dialog-type';
import { CommonService } from 'src/app/services/rest/common.service';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetReviewComponent } from './bet-review/bet-review.component';

@Component({
  selector: 'bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.scss'],
})
export class BetComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private persistenceService = inject(PersistenceService);

  @ViewChild('betPanel')
  public betPanel!: ElementRef;

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

  @Select(BetState.isAutoNavigation)
  isAutoNavigation$!: Observable<boolean>;

  private destroy$!: Subject<boolean>;
  private better!: IBetter;
  public tutorialLastStep: number = 4;
  public betPanelHeight!: number;

  public get tutorialStep(): number {
    return this.persistenceService.tutorialStep;
  }

  public set tutorialStep(tutorialStep: number) {
    this.persistenceService.tutorialStep = tutorialStep;
  }

  public toggleWithClubName() {
    this.persistenceService.withClubName =
      !this.persistenceService.withClubName;
  }

  public get withClubNameIcon() {
    return this.persistenceService.withClubName
      ? 'check_box'
      : 'check_box_outline_blank';
  }

  public autoNavigationIcon(isAutoNavigation: boolean): string {
    return isAutoNavigation ? 'check_box' : 'check_box_outline_blank';
  }

  public toggleAutoNavigation() {
    this.store.dispatch([new BetActions.ToggleAutoNavigation()]);
  }

  public ngOnInit() {
    this.betPanelHeight = window.innerHeight - 53;
    this.destroy$ = new Subject<boolean>();

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
              disableClose: true,
            };

            this.dialog
              .open(InformationComponent, config)
              .afterClosed()
              .subscribe(() => {
                return this.persistenceService.navigate('logout');
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
                dialogType: InformationDialogType.YesNo,
                labels: ['Fermer', 'Voir mes pronostics'],
              },
              disableClose: true,
            };

            this.dialog
              .open(InformationComponent, config)
              .afterClosed()
              .subscribe((action: boolean) => {
                this.store.dispatch([new BetActions.UnsetAllBetsDone()]);
                if (action) {
                  this.showBetsReview();
                }
              });
          }
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }

  private showBetsReview() {
    const config: MatDialogConfig = {
      disableClose: true,
    };

    this.dialog.open(BetReviewComponent, config);
  }

  public displayBetterPoints(
    betterPointsCategoryToDisplay: number | undefined
  ): boolean {
    return !!betterPointsCategoryToDisplay;
  }

  public get withClubName(): boolean {
    return this.persistenceService.withClubName;
  }

  public gotoNextTutorial() {
    this.tutorialStep++;
    if (this.tutorialStep === this.tutorialLastStep + 1) {
      // Dernier tutoriel à afficher
      this.better.isTutorialDone = true;
      this.storeBetterInLocalStorage();
      this.store.dispatch([new BetActions.SetTutorialDone()]);
    }
  }

  private storeBetterInLocalStorage() {
    if (!CommonService.isProduction) {
      window.localStorage.setItem('better', JSON.stringify(this.better));
    }
  }

  public like(evaluationLevel: number) {
    this.store
      .dispatch([new BetActions.SetEvaluation(evaluationLevel)])
      .subscribe(() => {
        this.better.isEvaluationDone = true;
        this.storeBetterInLocalStorage();

        const config: MatDialogConfig<IInformationDialogConfig> = {
          data: {
            title: 'Merci',
            message: 'Merci pour ton évaluation',
            dialogType: InformationDialogType.Information,
            labels: ['Fermer'],
          },
          disableClose: true,
        };

        this.dialog
          .open(InformationComponent, config)
          .afterClosed()
          .subscribe(() => {});
      });
  }
}
