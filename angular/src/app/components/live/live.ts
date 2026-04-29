import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngxs/store';
import { UmpireActions } from '../../store/action/umpire.action';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { IPoint, SERVER_SIDE } from '../../models/point';
import { UmpireState } from '../../store/state/umpire.state';
import { AsyncPipe } from '@angular/common';
import { Court } from '../court/court';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IFirstPoint, ILaunchSetData } from '../../models/launch-data';
import { PlayerOnCourtService } from '../../services/player-on-court.service';
import { IEndOfSet } from '../../models/end-of-set';
import { PAIR_ALIAS } from '../../models/pair';
import { LaunchSet } from '../launch-set/launch-set';

@Component({
  selector: 'live',
  imports: [AsyncPipe, MatButtonModule, Court],
  templateUrl: './live.html',
  styleUrl: './live.scss',
})
export class Live implements OnInit, OnDestroy {
  private readonly store: Store = inject(Store);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly playerOnCourtService: PlayerOnCourtService =
    inject(PlayerOnCourtService);

  public justPlayedPoint$: Observable<IPoint | undefined>;
  public isEndOfFirstSet$: Observable<IEndOfSet | undefined>;
  public isEndOfSecondSet$: Observable<IEndOfSet | undefined>;

  private destroy$!: Subject<boolean>;

  constructor() {
    this.justPlayedPoint$ = this.store.select(UmpireState.justPlayedPoint);
    this.isEndOfFirstSet$ = this.store.select(UmpireState.isEndOfFirstSet);
    this.isEndOfSecondSet$ = this.store.select(UmpireState.isEndOfSecondSet);
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    this.isEndOfFirstSet$
      .pipe(
        takeUntil(this.destroy$),
        map((isEndOfFirstSet) => {
          if (isEndOfFirstSet) {
            // On demande à lancer le set suivant
            const config: MatDialogConfig<ILaunchSetData> = {
              data: this.calculatePairPositionEndFirstSet(
                isEndOfFirstSet.isPointWinnerOnLeftSide,
              ) as ILaunchSetData,
            };
            this.dialog
              .open(LaunchSet, config)
              .afterClosed()
              .subscribe((firstPoint: IFirstPoint) => {
                this.store.dispatch(new UmpireActions.InitSet(firstPoint));
              });
          }
        }),
      )
      .subscribe();

    this.isEndOfSecondSet$
      .pipe(
        takeUntil(this.destroy$),
        map((isEndOfSecondSet) => {
          if (isEndOfSecondSet) {
            // On demande à lancer le set suivant
            const config: MatDialogConfig<ILaunchSetData> = {
              data: this.calculatePairPositionEndSecondSet(
                isEndOfSecondSet.isPointWinnerOnLeftSide,
              ) as ILaunchSetData,
            };
            this.dialog
              .open(LaunchSet, config)
              .afterClosed()
              .subscribe((firstPoint: IFirstPoint) => {
                this.store.dispatch(new UmpireActions.InitSet(firstPoint));
              });
          }
        }),
      )
      .subscribe();
  }

  public ngOnDestroy() {
    if (this.destroy$) {
      this.destroy$.next(true);
    }
  }

  public addPointLeftPair() {
    this.store.dispatch(new UmpireActions.AddPoint(true));
  }

  public addPointRightPair() {
    this.store.dispatch(new UmpireActions.AddPoint(false));
  }

  private calculatePairPositionEndFirstSet(
    isPointWinnerOfLeftSide: boolean,
  ): ILaunchSetData {
    let isPlayer1Or2AsServer = false;
    let isPlayer3Or4AsServer = false;
    let serverSide: SERVER_SIDE;

    if (isPointWinnerOfLeftSide) {
      // L'équipe à gauche a marqué le dernier point
      serverSide = SERVER_SIDE.RIGHT;
      if (
        this.playerOnCourtService.getFirstSetLeftPair().valueOf() ===
        PAIR_ALIAS.ONE_TWO
      ) {
        isPlayer1Or2AsServer = true;
        isPlayer3Or4AsServer = false;
      } else {
        isPlayer1Or2AsServer = false;
        isPlayer3Or4AsServer = true;
      }
    } else {
      // L'équipe à droite a marqué le dernier point
      // Donc c'est l'équipe à gauche qui servira en premier dans le deuxième set
      serverSide = SERVER_SIDE.LEFT;
      if (
        this.playerOnCourtService.getFirstSetLeftPair().valueOf() ===
        PAIR_ALIAS.ONE_TWO
      ) {
        isPlayer1Or2AsServer = false;
        isPlayer3Or4AsServer = true;
      } else {
        isPlayer1Or2AsServer = true;
        isPlayer3Or4AsServer = false;
      }
    }

    return {
      isPlayer1Or2AsServer,
      isPlayer3Or4AsServer,
      serverSide,
    } as ILaunchSetData;
  }

  private calculatePairPositionEndSecondSet(
    isPointWinnerOfLeftSide: boolean,
  ): ILaunchSetData {
    let isPlayer1Or2AsServer = false;
    let isPlayer3Or4AsServer = false;
    let serverSide: SERVER_SIDE;

    if (isPointWinnerOfLeftSide) {
      // L'équipe à gauche a marqué le dernier point
      // Donc c'est l'équipe à droite qui servira en premier dans le deuxième set
      serverSide = SERVER_SIDE.RIGHT;
      if (
        this.playerOnCourtService.getSecondSetLeftPair().valueOf() ===
        PAIR_ALIAS.ONE_TWO
      ) {
        isPlayer1Or2AsServer = true;
        isPlayer3Or4AsServer = false;
      } else {
        isPlayer1Or2AsServer = false;
        isPlayer3Or4AsServer = true;
      }
    } else {
      // L'équipe à droite a marqué le dernier point
      // Donc c'est l'équipe à gauche qui servira en premier dans le deuxième set
      serverSide = SERVER_SIDE.LEFT;
      if (
        this.playerOnCourtService.getSecondSetLeftPair().valueOf() ===
        PAIR_ALIAS.ONE_TWO
      ) {
        isPlayer1Or2AsServer = false;
        isPlayer3Or4AsServer = true;
      } else {
        isPlayer1Or2AsServer = true;
        isPlayer3Or4AsServer = false;
      }
    }

    return {
      isPlayer1Or2AsServer,
      isPlayer3Or4AsServer,
      serverSide,
    } as ILaunchSetData;
  }
}
