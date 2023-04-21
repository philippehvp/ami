import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription, filter } from 'rxjs';
import { IBetter } from 'src/app/models/better';
import { IBetterBet, IPlayerBet } from 'src/app/models/better-bet';
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
  betterBet$!: Observable<IBetterBet[]>;

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  private betterBetSub!: Subscription;
  private betterSub!: Subscription;

  public displayedColumns: string[] = [];

  public bets: IPlayerBet[] = [];

  public ngOnInit() {
    this.betterSub = this.better$
      .pipe(filter((better) => !!better))
      .subscribe((better) => {
        this.store.dispatch([new BetActions.GetBetterBet(better.accessKey)]);
      });

    this.betterBetSub = this.betterBet$.subscribe((betterBet) => {
      if (betterBet && betterBet.length) {
        this.displayedColumns = ['Pronostiqueurs'];
        betterBet[0].header.map((header) => {
          this.displayedColumns.push(
            header.contestName + ' - ' + header.categoryName
          );
          this.displayedColumns.push(
            'Pts' + header.contestName + ' - ' + header.categoryName
          );
        });

        this.bets = betterBet[0].bets;
      }
    });
  }

  public ngOnDestroy() {
    if (this.betterBetSub) {
      this.betterBetSub.unsubscribe();
    }

    if (this.betterSub) {
      this.betterSub.unsubscribe();
    }
  }

  public isNameColumn(index: number): boolean {
    return index === 0;
  }

  public isBetColumn(index: number): boolean {
    return index !== 0 && index % 2 === 1;
  }

  public isPointsColumn(index: number): boolean {
    return index !== 0 && index % 2 === 0;
  }

  public getBetterName(bet: IPlayerBet): string {
    return bet.name;
  }

  public getBetDetail(
    index: number,
    bet: IPlayerBet,
    isFocusedOnWinner: boolean,
    isPlayer1: boolean
  ) {
    const i = (index - 1) / 2;
    const players = isFocusedOnWinner ? bet.winners : bet.runnersUp;
    return isPlayer1 ? players[i].playerName1 : players[i].playerName2;
  }

  public getColumnLabel(index: number, column: string) {
    if (index === 0) {
      return 'Pronostiqueurs';
    } else if (index % 2 === 1) {
      return column;
    } else {
      return '';
    }
  }
}
