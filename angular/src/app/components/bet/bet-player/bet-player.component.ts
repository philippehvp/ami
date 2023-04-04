import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs/internal/operators/filter';
import { IBet } from 'src/app/models/bet';
import { IPlayer } from 'src/app/models/player';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'bet-player',
  templateUrl: './bet-player.component.html',
  styleUrls: ['./bet-player.component.scss']
})
export class BetPlayerComponent implements OnInit, OnDestroy {
  @Input()
  isWinner: string | undefined;

  @Select(BetState.players)
  players$: Observable<IPlayer[]> | undefined;

  @Select(BetState.bet)
  bet$: Observable<IBet> | undefined;

  private bet: IBet | undefined;

  private betSub: Subscription | undefined;

  public playerChosen: number | undefined;

  public getColor(playerId: number): string {
    return playerId === this.playerChosen ? 'primary' : 'basic';
  }

  public isDisabled(playerId: number): boolean {
    if (this.isWinner === '1') {
      return playerId === this.bet?.runnerUpId ? true : false;
    } else {
      return playerId === this.bet?.winnerId ? true : false;
    }
  }
  constructor(private store: Store) {}

  public ngOnInit() {
    this.betSub = this.bet$?.pipe(filter(bet => bet !== null && bet !== undefined)).subscribe(bet => {
      this.bet = bet;
      if (this.isWinner === '1') {
        this.playerChosen = bet.winnerId;
      } else {
        this.playerChosen = bet.runnerUpId;
      }
    });
  }

  public ngOnDestroy() {
    if (this.betSub) {
      this.betSub.unsubscribe();
    }
  }

  public changePlayer(playerId: number) {
    if (this.isWinner === '1') {
      this.store.dispatch([new BetActions.SetWinner(playerId)]);
    } else {
      this.store.dispatch([new BetActions.SetRunnerUp(playerId)]);
    }
  }


}
