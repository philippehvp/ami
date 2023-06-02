import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { IBetter } from 'src/app/models/better';
import { BetState } from 'src/app/store/state/bet.state';
import { BetStatState } from 'src/app/store/state/bet-stat.state';
import { BetStatActions } from 'src/app/store/action/bet-stat.action';
import { IBetStat } from 'src/app/models/bet-stat';

@Component({
  selector: 'bet-stat',
  templateUrl: './bet-stat.component.html',
  styleUrls: ['./bet-stat.component.scss'],
})
export class BetStatComponent implements OnInit, OnDestroy {
  private store = inject(Store);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetStatState.betStat)
  betStat$!: Observable<IBetStat[]>;

  private destroy$!: Subject<boolean>;

  public displayedColumns: string[] = [
    'playerName',
    'winner',
    'runnerUp',
    'category',
  ];

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    this.better$
      .pipe(
        takeUntil(this.destroy$),
        map((better) => {
          this.store.dispatch([
            new BetStatActions.GetBetStat(better.accessKey),
          ]);
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }
}
