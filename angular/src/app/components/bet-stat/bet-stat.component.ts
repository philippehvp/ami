import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { IBetStat } from 'src/app/models/bet-stat';
import { IBetter } from 'src/app/models/better';
import { BetStatActions } from 'src/app/store/action/bet-stat.action';
import { BetStatState } from 'src/app/store/state/bet-stat.state';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'bet-stat',
  templateUrl: './bet-stat.component.html',
  styleUrls: ['./bet-stat.component.scss'],
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
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }
}
