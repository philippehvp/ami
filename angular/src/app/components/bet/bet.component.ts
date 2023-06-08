import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { IDuration } from 'src/app/models/duration';
import { UtilsService } from 'src/app/services/utils.service';
import { BetterService } from 'src/app/services/rest/better.service';

@Component({
  selector: 'bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.scss'],
})
export class BetComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private persistenceService = inject(PersistenceService);
  private snackBar = inject(MatSnackBar);
  private utilsService = inject(UtilsService);
  private renderer = inject(Renderer2);
  private betterService = inject(BetterService);

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

  @Select(BetState.proposeAutoNavigation)
  proposeAutoNavigation$!: Observable<boolean>;

  @Select(BetState.duration)
  duration$!: Observable<IDuration>;

  private destroy$!: Subject<boolean>;
  public tutorialLastStep: number = 4;

  public evaluations: number[] = [1, 2, 3, 4, 5];

  public get tutorialStep(): number {
    return this.persistenceService.tutorialStep;
  }

  public set tutorialStep(tutorialStep: number) {
    this.persistenceService.tutorialStep = tutorialStep;
  }

  public get isEvaluationDone(): boolean {
    return this.persistenceService.isEvaluationDone;
  }

  public set isEvaluationDone(isEvaluationDone: boolean) {
    this.persistenceService.isEvaluationDone = isEvaluationDone;
  }

  public get isClubName(): boolean {
    return this.persistenceService.isClubName;
  }

  public get isAutoNavigation(): boolean {
    return this.persistenceService.isAutoNavigation;
  }

  public get isPlayerReverse(): boolean {
    return this.persistenceService.isPlayerReverse;
  }

  public get isDarkMode(): boolean {
    return this.persistenceService.isDarkMode;
  }

  public get isCompactMode(): boolean {
    return this.persistenceService.isCompactMode;
  }

  public get betPanelClass(): string {
    return this.persistenceService.isCompactMode
      ? 'compact-mode'
      : 'normal-mode';
  }

  public get isReviewOfVisible(): boolean {
    return this.persistenceService.isReviewOfVisible;
  }

  public get reviewOfClass(): string {
    return this.persistenceService.isCompactMode
      ? 'compact-mode'
      : 'normal-mode';
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    this.persistenceService.gobackPage = 'bet';

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
                return this.persistenceService.navigate('login');
              });
          }

          if (better) {
            if (better.isTutorialDone) {
              this.utilsService.setMode(
                this.renderer,
                this.persistenceService.isDarkMode
              );

              if (!CommonService.isProduction) {
                window.localStorage.setItem('better', JSON.stringify(better));
              }
            } else {
              this.persistenceService.tutorialStep = 1;
            }
          }
        })
      )
      .subscribe();

    combineLatest([this.allBetsDone$, this.duration$])
      .pipe(
        takeUntil(this.destroy$),
        map(([allBetsDone, duration]) => {
          if (allBetsDone) {
            if (!duration.isDurationModified) {
              // Le pronostic sur la durée du match a été modifié
              const config: MatDialogConfig<IInformationDialogConfig> = {
                data: {
                  title: 'Pronostics entièrement saisis',
                  message:
                    "Tous les pronostics ont été saisis mais tu n'as pas encore modifié le pronostic sur la durée du match le plus long de la journée.",
                  dialogType: InformationDialogType.Information,
                  labels: ['Fermer'],
                },
                disableClose: true,
              };

              this.dialog
                .open(InformationComponent, config)
                .afterClosed()
                .subscribe(() => {
                  this.store.dispatch([new BetActions.UnsetAllBetsDone()]);
                });
            } else {
              // Le pronostic sur la durée du match n'a pas encore été modifié
              const config: MatDialogConfig<IInformationDialogConfig> = {
                data: {
                  title: 'Pronostics entièrement saisis',
                  message:
                    'Tous les pronostics ont été saisis et seront pris en compte. Tu peux te déconnecter.',
                  dialogType: InformationDialogType.Information,
                  labels: ['Fermer'],
                },
                disableClose: true,
              };

              this.dialog
                .open(InformationComponent, config)
                .afterClosed()
                .subscribe(() => {
                  this.store.dispatch([new BetActions.UnsetAllBetsDone()]);
                });
            }
          }
        })
      )
      .subscribe();

    this.proposeAutoNavigation$
      .pipe(
        takeUntil(this.destroy$),
        map((proposeAutoNavigation) => {
          if (proposeAutoNavigation) {
            const config: MatDialogConfig<IInformationDialogConfig> = {
              data: {
                title: "Activer l'auto-navigation ?",
                message:
                  "L'auto-navigation te place à la série suivante lorsque tu viens de faire le pronostic d'une série. Veux-tu l'activer ?",
                dialogType: InformationDialogType.YesNo,
                labels: ["Non, ne pas l'activer", "Oui, l'activer"],
              },
              disableClose: true,
            };

            this.dialog
              .open(InformationComponent, config)
              .afterClosed()
              .subscribe((action: boolean) => {
                this.store.dispatch([new BetActions.UnsetAllBetsDone()]);
                if (action) {
                  this.persistenceService.isAutoNavigation = true;
                  this.store.dispatch([new BetActions.GotoNextCategory()]);
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

  public displayBetterPoints(
    betterPointsCategoryToDisplay: number | undefined
  ): boolean {
    return !!betterPointsCategoryToDisplay;
  }

  public gotoNextTutorial(better: IBetter | null) {
    if (better) {
      this.tutorialStep++;
      if (this.tutorialStep === this.tutorialLastStep + 1) {
        // Dernier tutoriel à afficher
        better.isTutorialDone = true;
        this.storeBetterInLocalStorage(better);
        this.store.dispatch([new BetActions.SetTutorialDone()]);
      }
    }
  }

  private storeBetterInLocalStorage(better: IBetter) {
    if (!CommonService.isProduction) {
      window.localStorage.setItem('better', JSON.stringify(better));
    }
  }

  public get likePanelClass(): string {
    return this.persistenceService.isPlayerReverse
      ? 'like-panel right'
      : 'like-panel left';
  }

  public get likeClass(): string {
    return this.persistenceService.isPlayerReverse ? 'like right' : 'like left';
  }

  public like(better: IBetter | null, evaluationLevel: number) {
    if (better) {
      this.store
        .dispatch([new BetActions.SetEvaluation(evaluationLevel)])
        .subscribe(() => {
          this.storeBetterInLocalStorage(better);

          this.snackBar.open('Merci pour ton vote', 'Fermer', {
            duration: 2500,
          });
          this.persistenceService.isEvaluationDone = true;
        });
    }
  }

  public evaluationIcon(evaluation: number, index: number): string {
    return evaluation >= index ? 'star' : 'star_border';
  }

  public get clubName(): boolean {
    return this.persistenceService.isClubName;
  }

  public set clubName(isClubName: boolean) {
    this.persistenceService.isClubName = isClubName;
  }

  public toggleClubName(better: IBetter | null, $event: any) {
    this.persistenceService.isClubName = !this.persistenceService.isClubName;

    if (better) {
      this.updateSetting(better);
    }

    $event.stopPropagation();
  }

  public get isPlayerNameOnly(): boolean {
    return this.persistenceService.isPlayerNameOnly;
  }

  public set isPlayerNameOnly(isPlayerNameOnly: boolean) {
    this.persistenceService.isPlayerNameOnly = isPlayerNameOnly;
  }

  public togglePlayerNameOnly(better: IBetter | null, $event: any) {
    this.persistenceService.isPlayerNameOnly =
      !this.persistenceService.isPlayerNameOnly;

    if (better) {
      this.updateSetting(better);
    }

    $event.stopPropagation();
  }

  public get isPlayerRanking(): boolean {
    return this.persistenceService.isPlayerRanking;
  }

  public set isPlayerRanking(isPlayerRanking: boolean) {
    this.persistenceService.isPlayerRanking = isPlayerRanking;
  }
  public togglePlayerRanking(better: IBetter | null, $event: any) {
    this.persistenceService.isPlayerRanking =
      !this.persistenceService.isPlayerRanking;

    if (better) {
      this.updateSetting(better);
    }

    $event.stopPropagation();
  }

  public toggleAutoNavigation(better: IBetter | null) {
    this.persistenceService.isAutoNavigation =
      !this.persistenceService.isAutoNavigation;
    if (better) {
      this.updateSetting(better);
    }
  }

  public togglePlayerReverse(better: IBetter | null) {
    this.persistenceService.isPlayerReverse =
      !this.persistenceService.isPlayerReverse;
    if (better) {
      this.updateSetting(better);
    }
  }

  public toggleDarkMode(better: IBetter | null) {
    this.persistenceService.isDarkMode = !this.persistenceService.isDarkMode;
    this.utilsService.setMode(
      this.renderer,
      this.persistenceService.isDarkMode
    );
    if (better) {
      this.updateSetting(better);
    }
  }

  private updateSetting(better: IBetter) {
    this.betterService.updateSetting(better).subscribe();
  }
}
