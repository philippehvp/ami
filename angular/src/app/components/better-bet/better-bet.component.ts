import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { IBetterBet, IPlayerBet } from 'src/app/models/better-bet';
import { BetterBetActions } from 'src/app/store/action/better-bet';
import { BetterBetState } from 'src/app/store/state/better-bet.state';

@Component({
  selector: 'better-bet',
  templateUrl: './better-bet.component.html',
  styleUrls: ['./better-bet.component.scss'],
})
export class BetterBetComponent implements OnInit, OnDestroy {
  @Select(BetterBetState.betterBet)
  betterBet$!: Observable<IBetterBet[]>;

  private betterBetSub!: Subscription;

  public displayedColumns: string[] = [];

  public bets: IPlayerBet[] = [];

  constructor(private store: Store) {}

  public ngOnInit() {
    this.store.dispatch([new BetterBetActions.GetBetterBet()]);

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
      return 'Pts';
    }
  }
}
