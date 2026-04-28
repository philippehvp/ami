import { Component, inject, model, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UmpireActions } from '../../store/action/umpire.action';
import { Observable } from 'rxjs';
import { ICategory } from '../../models/category';
import { UmpireState } from '../../store/state/umpire.state';

import { MatFormField, MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { IPair, PAIR_ALIAS } from '../../models/pair';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LaunchMatch } from '../launch-match/launch-match';
import { IFirstPoint, ILaunchMatchData } from '../../models/launch-data';
import { PlayerOnCourtService } from '../../services/player-on-court.service';
import { SERVER_SIDE } from '../../models/point';

@Component({
  selector: 'selection',
  imports: [
    AsyncPipe,
    MatFormField,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './selection.html',
  styleUrl: './selection.scss',
})
export class Selection implements OnInit {
  private readonly store: Store = inject(Store);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly playerOnCourtService: PlayerOnCourtService =
    inject(PlayerOnCourtService);

  public currentCategory = model<ICategory>();
  public leftPair = model<IPair>({} as IPair);
  public rightPair = model<IPair>({} as IPair);

  public categories$: Observable<ICategory[]>;

  public pairs$!: Observable<IPair[]>;

  constructor() {
    this.categories$ = this.store.select(UmpireState.categories);
    this.pairs$ = this.store.select(UmpireState.players);
  }

  public ngOnInit() {
    this.store.dispatch([new UmpireActions.GetContests()]);
  }

  public onSelectionChangeCategory() {
    // Sélection d'une série : on doit charger la liste des joueurs de la série
    this.store.dispatch([
      new UmpireActions.GetPlayers((this.currentCategory() as ICategory).id),
    ]);

    this.leftPair.set({} as IPair);
    this.rightPair.set({} as IPair);
  }

  public launch() {
    const config: MatDialogConfig<ILaunchMatchData> = {
      data: {
        leftPair: this.leftPair() as IPair,
        rightPair: this.rightPair() as IPair,
      },
    };
    this.dialog
      .open(LaunchMatch, config)
      .afterClosed()
      .subscribe((firstPoint: IFirstPoint) => {
        if (firstPoint) {
          this.setPlayersName();
          this.setPairsPositionForAllSets(firstPoint);

          // Initialisation match
          this.store.dispatch(new UmpireActions.InitMatch(firstPoint));
        }
      });
  }

  public isLaunchDisabled(): boolean {
    return this.leftPair()?.id &&
      this.rightPair()?.id &&
      this.leftPair()?.id !== this.rightPair()?.id
      ? false
      : true;
  }

  private setPlayersName() {
    this.playerOnCourtService.setPlayersName([
      this.leftPair()?.playerName1 || '',
      this.leftPair()?.playerName2 || '',
      this.rightPair()?.playerName1 || '',
      this.rightPair()?.playerName2 || '',
    ]);
  }

  private setPairsPositionForAllSets(firstPoint: IFirstPoint) {
    if (
      firstPoint.playerPositionLeftPair.playerLeft === 1 ||
      firstPoint.playerPositionLeftPair.playerLeft === 2
    ) {
      this.playerOnCourtService.setFirstSetLeftPair(PAIR_ALIAS.ONE_TWO);
      this.playerOnCourtService.setSecondSetLeftPair(PAIR_ALIAS.THREE_FOUR);
      this.playerOnCourtService.setThirdSetLeftPair(PAIR_ALIAS.ONE_TWO);

      this.playerOnCourtService.setFirstSetRightPair(PAIR_ALIAS.THREE_FOUR);
      this.playerOnCourtService.setSecondSetRightPair(PAIR_ALIAS.ONE_TWO);
      this.playerOnCourtService.setThirdSetRightPair(PAIR_ALIAS.THREE_FOUR);
    } else {
      this.playerOnCourtService.setFirstSetLeftPair(PAIR_ALIAS.THREE_FOUR);
      this.playerOnCourtService.setSecondSetLeftPair(PAIR_ALIAS.ONE_TWO);
      this.playerOnCourtService.setThirdSetLeftPair(PAIR_ALIAS.THREE_FOUR);

      this.playerOnCourtService.setFirstSetRightPair(PAIR_ALIAS.ONE_TWO);
      this.playerOnCourtService.setSecondSetRightPair(PAIR_ALIAS.THREE_FOUR);
      this.playerOnCourtService.setThirdSetRightPair(PAIR_ALIAS.ONE_TWO);
    }
  }
}
