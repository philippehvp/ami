import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { IBetter } from '../../models/better';
import { IBetterBet, IPlayer } from '../../models/better-bet';
import { BetActions } from '../../store/action/bet.action';
import { BetState } from '../../store/state/bet.state';
import { BetterBetState } from '../../store/state/better-bet.state';
import { TitlebarComponent } from '../titlebar/titlebar.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'better-bet',
  templateUrl: './better-bet.component.html',
  styleUrls: ['./better-bet.component.scss'],
  imports: [AsyncPipe, TitlebarComponent],
})
export class BetterBetComponent implements OnInit, OnDestroy {
  public betterBet$!: Observable<IBetterBet | undefined>;
  public better$!: Observable<IBetter>;

  private destroy$!: Subject<boolean>;

  public displayedColumns: string[] = [];

  constructor(private readonly store: Store) {
    this.better$ = this.store.select(BetState.better);
    this.betterBet$ = this.store.select(BetterBetState.betterBet);
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    this.better$
      .pipe(
        takeUntil(this.destroy$),
        map((better) => {
          if (better) {
            this.store.dispatch([
              new BetActions.GetBetterBet(better.accessKey),
            ]);
          }
        }),
      )
      .subscribe();

    this.betterBet$
      .pipe(
        takeUntil(this.destroy$),
        map((betterBet) => {
          if (betterBet) {
            this.displayedColumns = [];
            betterBet.header.map((header) => {
              this.displayedColumns.push(
                header.contestName + ' - ' + header.categoryName,
              );
              this.displayedColumns.push('Pts');
            });
          }
        }),
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }

  public getPlayerName(players: IPlayer[], j: number): string {
    if (j % 2 === 0) {
      const playersName =
        players[j / 2].playerNameOnly1 + ' ' + players[j / 2].playerNameOnly2;

      if (!playersName || playersName === '') {
        return '-';
      } else {
        return playersName;
      }
    }
    return '';
  }
}
