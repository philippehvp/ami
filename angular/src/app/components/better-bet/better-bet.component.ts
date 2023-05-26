import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { IBetter } from 'src/app/models/better';
import {
  IBetterBet,
  IDisplayedBetterBet,
  IPlayerBet,
  IPlayerOfCategory,
} from 'src/app/models/better-bet';
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

  private destroy$!: Subject<boolean>;

  public displayedColumns: string[] = [];
  public manualDisplayedColumns: string[] = [];

  public bets: IPlayerBet[] = [];
  public displayedBetterBet: IDisplayedBetterBet = { rows: [] };

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
          if (betterBet && betterBet.length) {
            this.displayedColumns = ['NOM PRENOM'];
            this.displayedColumns.push('V/F');

            betterBet[0].header.map((header) => {
              this.displayedColumns.push(
                header.contestName + ' - ' + header.categoryName
              );
              this.displayedColumns.push(
                'Pts ' + header.contestName + ' - ' + header.categoryName
              );
            });
            this.bets = betterBet[0].bets;

            betterBet[0].header.map((header) => {
              this.manualDisplayedColumns.push(
                header.contestName + ' - ' + header.categoryName
              );
              this.manualDisplayedColumns.push('');
            });

            for (let i: number = 0; i < betterBet[0].bets.length; i++) {
              // Pour chaque pronostiqueur

              // Ajout des vainqueurs de chaque série
              const winners: IPlayerOfCategory = {
                players: [],
                duration: betterBet[0].bets[i].duration,
              };
              betterBet[0].bets[i].winners.map((winner) => {
                winners.players.push({
                  playerName1: winner.playerName1,
                  playerName2: winner.playerName2,
                });
              });

              this.displayedBetterBet.rows.push(winners);

              // Ajout des finalistes de chaque série
              const runnersUp: IPlayerOfCategory = {
                players: [],
                duration: betterBet[0].bets[i].duration,
              };
              betterBet[0].bets[i].runnersUp.map((runnerUp) => {
                runnersUp.players.push({
                  playerName1: runnerUp.playerName1,
                  playerName2: runnerUp.playerName2,
                });
              });

              this.displayedBetterBet.rows.push(runnersUp);
            }

            console.log(this.displayedBetterBet);

            this.displayedColumns.push('Temps match');
          }
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }

  public isNameColumn(index: number): boolean {
    return index === 0;
  }

  public isWinnerRunnerUpColumn(index: number): boolean {
    return index === 1;
  }

  public isBetColumn(index: number): boolean {
    return index !== 0 && index % 2 === 0 && !this.isDurationColumn(index);
  }

  public isPointsColumn(index: number): boolean {
    return index !== 0 && index % 2 === 1 && !this.isDurationColumn(index);
  }

  public isDurationColumn(index: number): boolean {
    return index === this.displayedColumns.length - 1;
  }

  public getBetterName(bet: IPlayerBet): string {
    return bet.name;
  }

  public getWinnerFirstPlayerName(index: number, bet: IPlayerBet): string {
    const i = (index - 2) / 2;
    return bet.winners[i].playerName1;
  }

  public getWinnersSecondPlayerName(index: number, bet: IPlayerBet): string {
    const i = (index - 2) / 2;
    return bet.winners[i].playerName2;
  }

  public getRunnerUpFirstPlayerName(index: number, bet: IPlayerBet): string {
    const i = (index - 2) / 2;
    return bet.runnersUp[i].playerName1;
  }

  public getRunnerUpSecondPlayerName(index: number, bet: IPlayerBet): string {
    const i = (index - 2) / 2;
    return bet.runnersUp[i].playerName2;
  }

  public getColumnLabel(index: number, column: string) {
    if (index <= 1 || index % 2 === 0) {
      return column;
    } else {
      return '';
    }
  }

  public getName(i: number): string {
    if (i % 2 === 0) {
      return this.bets[i].name;
    }

    return '';
  }

  public getWinnerOrRunnerUp(i: number): string {
    return i % 2 === 0 ? 'V' : 'F';
  }

  public getPlayerName(i: number, j: number): string {
    if (j % 2 === 0) {
      const playersName =
        this.displayedBetterBet.rows[i].players[j / 2].playerName1 +
        ' ' +
        this.displayedBetterBet.rows[i].players[j / 2].playerName2;
      const playersNameOnly = playersName.match(/(\b[A-Z][A-Z']+|\b[A-Z']\b)/g);
      return playersNameOnly?.join(' ') || '';
    }
    return '';
  }

  private getRowSpanForTwo(i: number): number {
    return i % 2 === 0 ? 2 : 0;
  }

  public getRowSpanForBetterName(i: number): number {
    return this.getRowSpanForTwo(i);
  }

  public getRowSpanForDuration(i: number): number {
    return i % 2 === 0 ? 4 : 0;
  }

  public getRowSpanForTotal(i: number): number {
    return i % 2 === 0 ? 4 : 0;
  }

  public getColSpanForTwo(i: number): number {
    return i % 2 === 0 ? 2 : 0;
  }

  public isWinner(i: number): boolean {
    return i % 2 === 0 ? true : false;
  }
}
