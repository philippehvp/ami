import { Component, inject, model, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UmpireActions } from '../../store/action/umpire.action';
import { Observable } from 'rxjs';
import { ICategory } from '../../models/category';
import { UmpireState } from '../../store/state/umpire.state';

import { MatFormField, MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { IPlayer } from '../../models/player';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Launch } from '../launch/launch';
import { IFirstPoint, ILaunchData } from '../../models/launch-data';
import { IPoint } from '../../models/point';
import { PlayerNameService } from '../../services/player-name.service';

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
export class Selection implements OnInit, OnDestroy {
  private readonly store: Store = inject(Store);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly playerNameService: PlayerNameService =
    inject(PlayerNameService);

  public currentCategory = model<ICategory>();
  public currentPlayer1 = model<IPlayer>();
  public currentPlayer2 = model<IPlayer>();

  public categories$: Observable<ICategory[]>;

  public players$!: Observable<IPlayer[]>;

  constructor() {
    this.categories$ = this.store.select(UmpireState.categories);
    this.players$ = this.store.select(UmpireState.players);
  }

  public ngOnInit() {
    this.store.dispatch([new UmpireActions.GetContests()]);
  }

  public ngOnDestroy() {}

  public onSelectionChangeCategory() {
    // Sélection d'une série : on doit charger la liste des joueurs de la série
    this.store.dispatch([
      new UmpireActions.GetPlayers((this.currentCategory() as ICategory).id),
    ]);
  }

  public launchMatch() {
    const config: MatDialogConfig<ILaunchData> = {
      data: {
        player1: this.currentPlayer1() as IPlayer,
        player2: this.currentPlayer2() as IPlayer,
      },
    };
    this.dialog
      .open(Launch, config)
      .afterClosed()
      .subscribe((firstPoint: IFirstPoint) => {
        if (firstPoint) {
          // Mise en place des noms des joueurs
          this.playerNameService.setPlayersName([
            this.currentPlayer1()?.playerName1 || '',
            this.currentPlayer1()?.playerName2 || '',
            this.currentPlayer2()?.playerName1 || '',
            this.currentPlayer2()?.playerName2 || '',
          ]);

          // Initialisation match
          this.store.dispatch(new UmpireActions.InitMatch(firstPoint));
        }
      });
  }
}
