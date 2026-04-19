import { Component, inject, model, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UmpireActions } from '../../store/action/umpire.action';
import { map, Observable, of, Subject, takeUntil } from 'rxjs';
import { ICategory } from '../../models/category';
import { UmpireState } from '../../store/state/umpire.state';

import { MatFormField, MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { IPlayer } from '../../models/player';

@Component({
  selector: 'selection',
  imports: [
    AsyncPipe,
    MatFormField,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './selection.html',
  styleUrl: './selection.scss',
})
export class Selection implements OnInit, OnDestroy {
  private readonly store: Store = inject(Store);

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
}
