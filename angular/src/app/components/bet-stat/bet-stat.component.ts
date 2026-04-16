import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { IBetStat } from '../../models/bet-stat';
import { IBetter } from '../../models/better';
import { BetStatActions } from '../../store/action/bet-stat.action';
import { BetStatState } from '../../store/state/bet-stat.state';
import { BetState } from '../../store/state/bet.state';
import { TitlebarComponent } from '../titlebar/titlebar.component';
import {
  MatCellDef,
  MatHeaderCellDef,
  MatHeaderRowDef,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bet-stat',
  templateUrl: './bet-stat.component.html',
  styleUrls: ['./bet-stat.component.scss'],
  imports: [
    AsyncPipe,
    TitlebarComponent,
    MatTable,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
  ],
})
export class BetStatComponent implements OnInit, OnDestroy {
  public better$!: Observable<IBetter>;
  public betStat$!: Observable<IBetStat[] | undefined>;

  private destroy$!: Subject<boolean>;

  public displayedColumns: string[] = [
    'playerName',
    'winner',
    'runnerUp',
    'category',
  ];

  constructor(private readonly store: Store) {
    this.better$ = this.store.select(BetState.better);
    this.betStat$ = this.store.select(BetStatState.betStat);
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    this.better$
      .pipe(
        takeUntil(this.destroy$),
        map((better) => {
          if (better) {
            this.store.dispatch([
              new BetStatActions.GetBetStat(better.accessKey),
            ]);
          }
        }),
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }
}
