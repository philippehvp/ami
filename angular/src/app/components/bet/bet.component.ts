import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { Subject, combineLatest, filter, map, takeUntil } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IBetter } from '../../models/better';
import { ICategory } from '../../models/category';
import { IContest } from '../../models/contest';
import { IDuration } from '../../models/duration';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from '../../models/information-dialog-type';
import { PersistenceService } from '../../services/persistence.service';
import { ThemeService } from '../../services/theme.service';
import { BetActions } from '../../store/action/bet.action';
import { BetState } from '../../store/state/bet.state';
import { InformationComponent } from '../information/information.component';
import { AsyncPipe } from '@angular/common';
import { CircleComponent } from '../animated-background/circle/circle.component';
import { WaveComponent } from '../animated-background/wave/wave.component';
import { BubbleComponent } from '../animated-background/bubble/bubble.component';
import { SkyComponent } from '../animated-background/sky/sky.component';
import { BetDurationComponent } from './bet-duration/bet-duration.component';
import { BetContestComponent } from './bet-contest/bet-contest.component';
import { BetPlayerComponent } from './bet-player/bet-player.component';
import { BetReviewOfComponent } from './bet-review-of/bet-review-of.component';
import { SettingComponent } from '../setting/setting.component';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.scss'],
  imports: [
    AsyncPipe,
    CircleComponent,
    WaveComponent,
    BubbleComponent,
    SkyComponent,
    BetDurationComponent,
    BetContestComponent,
    BetPlayerComponent,
    BetReviewOfComponent,
    SettingComponent,
    MatMenuTrigger,
    MatMenu,
  ],
})
export class BetComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('betPanel')
  public betPanel!: ElementRef;

  public better$!: Observable<IBetter>;
  public category$!: Observable<ICategory>;
  public contest$!: Observable<IContest>;
  public isOffline$!: Observable<boolean>;
  public allBetsDone$!: Observable<boolean>;
  public proposeAutoNavigation$!: Observable<boolean | undefined>;
  public duration$!: Observable<IDuration>;

  private resizeTimeout!: ReturnType<typeof setTimeout>;

  @HostListener('window:resize')
  onResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.resize();
    }, 500);
  }

  private destroy$!: Subject<boolean>;
  public tutorialLastStep: number = 4;

  public evaluations: number[] = [1, 2, 3, 4, 5];

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly persistenceService: PersistenceService,
    private readonly snackBar: MatSnackBar,
    private readonly themeService: ThemeService,
    private readonly renderer: Renderer2,
  ) {
    this.better$ = this.store.select(BetState.better);
    this.category$ = this.store.select(BetState.category);
    this.contest$ = this.store.select(BetState.contest);
    this.isOffline$ = this.store.select(BetState.isOffline);
    this.allBetsDone$ = this.store.select(BetState.allBetsDone);
    this.proposeAutoNavigation$ = this.store.select(
      BetState.proposeAutoNavigation,
    );
    this.duration$ = this.store.select(BetState.duration);
  }

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

  public get isCompactMode(): boolean {
    return this.persistenceService.isCompactMode;
  }

  public get isThemeAnimated(): boolean {
    return this.persistenceService.isThemeAnimated;
  }

  public get isThemeAnimationShown(): boolean {
    return this.persistenceService.isThemeAnimationShown;
  }

  public get isCircleAnimation(): boolean {
    return this.persistenceService.theme.id === 2;
  }

  public get isWaveAnimation(): boolean {
    return this.persistenceService.theme.id === 3;
  }

  public get isBubbleAnimation(): boolean {
    return this.persistenceService.theme.id === 4;
  }

  public get isSkyAnimation(): boolean {
    return this.persistenceService.theme.id === 5;
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
        filter(([isOffline, better]) => isOffline !== undefined && !!better),
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
                return this.persistenceService.navigate('relog');
              });
          }

          if (better) {
            if (better.isTutorialDone) {
              this.themeService.setTheme(
                this.renderer,
                this.persistenceService.theme,
              );

              window.localStorage.setItem('better', JSON.stringify(better));
              window.localStorage.setItem(
                'settings',
                JSON.stringify(this.persistenceService.getSettings()),
              );
            } else {
              this.persistenceService.tutorialStep = 1;
            }
          }
        }),
      )
      .subscribe();

    combineLatest([this.allBetsDone$, this.duration$])
      .pipe(
        takeUntil(this.destroy$),
        filter(([allBetsDone, duration]) => !!allBetsDone && !!duration),
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

              // Si la zone de pronostic de la durée du match est en mode compact, alors il faut désactiver ce mode
              if (this.persistenceService.isDurationCompactMode) {
                this.persistenceService.isDurationCompactMode =
                  !this.persistenceService.isDurationCompactMode;
              }

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
                    'Tous les pronostics ont été saisis et seront pris en compte. Tu peux te déconnecter à présent si tu le veux.',
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
        }),
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
                  this.store.dispatch([
                    new BetActions.GotoNextCategoryIfCurrentIsComplete(),
                  ]);
                }
              });
          }
        }),
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }

  public ngAfterViewInit() {
    this.resize();
  }

  private resize() {
    const toolbarHeight =
      document.querySelector('.toolbar-panel')?.clientHeight || 0;
    const settingHeight =
      document.querySelector('.setting-panel')?.clientHeight || 0;

    const expandHeightNormal = `${
      window.innerHeight - (toolbarHeight + settingHeight)
    }`;
    const expandHeightCompact = `${window.innerHeight - toolbarHeight}`;

    document.documentElement.style.setProperty(
      '--expand-height-normal',
      `${expandHeightNormal}px`,
    );

    document.documentElement.style.setProperty(
      '--expand-height-compact',
      `${expandHeightCompact}px`,
    );
  }

  public displayBetterPoints(
    betterPointsCategoryToDisplay: number | undefined,
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
    window.localStorage.setItem('better', JSON.stringify(better));
    window.localStorage.setItem(
      'settings',
      JSON.stringify(this.persistenceService.getSettings()),
    );
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
}
