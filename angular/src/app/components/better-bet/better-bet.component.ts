import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { IBetter } from 'src/app/models/better';
import { IBetterBet, IPlayer, IPlayerBet } from 'src/app/models/better-bet';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetState } from 'src/app/store/state/bet.state';
import { BetterBetState } from 'src/app/store/state/better-bet.state';

@Component({
  selector: 'better-bet',
  templateUrl: './better-bet.component.html',
  styleUrls: ['./better-bet.component.scss'],
})
export class BetterBetComponent implements OnInit, OnDestroy {
  private store = inject(Store);

  @Select(BetterBetState.betterBet)
  betterBet$!: Observable<IBetterBet>;

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  private destroy$!: Subject<boolean>;

  public displayedColumns: string[] = [];

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    this.better$
      .pipe(
        takeUntil(this.destroy$),
        map((better) => {
          this.store.dispatch([new BetActions.GetBetterBet(better.accessKey)]);
        })
      )
      .subscribe();

    this.betterBet$
      .pipe(
        takeUntil(this.destroy$),
        map((betterBet) => {
          if (betterBet) {
            betterBet.header.map((header) => {
              this.displayedColumns.push(
                header.contestName + ' - ' + header.categoryName
              );
              this.displayedColumns.push('Pts');
            });
          }
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }

  public getPlayerName(players: IPlayer[], j: number): string {
    if (j % 2 === 0) {
      const playersName =
        players[j / 2].playerName1 + ' ' + players[j / 2].playerName2;
      const playersNameOnly = playersName.match(
        /(\b[A-Z][A-Z'-]+|\b[A-Z'-]\b)/g
      );
      const ret = playersNameOnly?.join(' ') || '';
      if (ret === '') {
        return '-';
      } else {
        return ret;
      }
    }
    return '';
  }
}
