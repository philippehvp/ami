import { Injectable } from '@angular/core';
import {
  Action,
  Selector,
  State,
  StateContext,
} from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { BetActions } from '../action/bet.action';
import { BetService } from 'src/app/services/rest/bet.service';
import { IBetter } from 'src/app/models/better';
import { IContest } from 'src/app/models/contest';
import { ICategory } from 'src/app/models/category';
import { IPlayer } from 'src/app/models/player';
import { PlayerService } from 'src/app/services/rest/player.service';
import { IBet } from 'src/app/models/bet';
import { updateItem, patch } from '@ngxs/store/operators';
import { UtilsService } from 'src/app/services/utils.service';

export interface INextBetToFill {
  category: number;
  focusOnWinner: boolean;
}

export class BetStateModel {
    better: IBetter | undefined;
    betters: IBetter[] | undefined;
    contest: IContest | undefined;
    contests: IContest[] | undefined;
    category: ICategory | undefined;
    players: IPlayer[] | undefined;
    bet: IBet | undefined;
    bets: IBet[] | undefined;
    winner: string | undefined;
    runnerUp: string | undefined;
    duration: number | undefined;
}

@State<BetStateModel>({
  name: 'bet',
  defaults: {
    better: undefined,
    betters: undefined,
    contest: undefined,
    contests: undefined,
    category: undefined,
    players: undefined,
    bet: undefined,
    bets: undefined,
    winner: undefined,
    runnerUp: undefined,
    duration: undefined
  },
})
@Injectable()
export class BetState {
  constructor(
    private betService: BetService,
    private playerService: PlayerService
  ) {}

  @Selector()
  static better(state: BetStateModel) {
    return state.better;
  }

  @Selector()
  static betters(state: BetStateModel) {
    return state.betters;
  }

  @Selector()
  static contest(state: BetStateModel) {
    return state.contest;
  }

  @Selector()
  static contests(state: BetStateModel) {
    return state.contests;
  }

  @Selector()
  static category(state: BetStateModel) {
    return state.category;
  }

  @Selector()
  static players(state: BetStateModel) {
    return state.players;
  }

  @Selector()
  static bet(state: BetStateModel) {
    return state.bet;
  }

  @Selector()
  static bets(state: BetStateModel) {
    return state.bets;
  }

  @Selector()
  static winner(state: BetStateModel) {
    return state.winner;
  }

  @Selector()
  static runnerUp(state: BetStateModel) {
    return state.runnerUp;
  }

  @Action(BetActions.SetBetter)
  setBetter(state: StateContext<BetStateModel>, action: BetActions.SetBetter) {
    // Recherche du participant ayant l'identifiant passé en paramètre
    const better = state.getState().betters?.find((better => { return better.id === action.betterId }));
    if(better) {
        state.patchState({better: better});
    
        // Lecture des concours auxquels est inscrit le participant
        state.dispatch([
          new BetActions.GetContests(better.id),
          new BetActions.GetBets(better.id),
          new BetActions.GetDuration(better.id)
        ]);
    } else {
        return;
    }
  }

  @Action(BetActions.Betters)
  betters(state: StateContext<BetStateModel>) {
    return state.getState().betters;
  }

  @Action(BetActions.GetBetters)
  getBetters(state: StateContext<BetStateModel>) {
    return this.betService.getBetters().pipe(
        tap(readBetters => {
          state.patchState({ betters: readBetters });

          // PHU - On se met sur le premier des participants en phase de dév
          state.dispatch([new BetActions.SetBetter(readBetters[1].id)]);
        })
    );
  }

  @Action(BetActions.GetContests)
  getContests(state: StateContext<BetStateModel>, action: BetActions.GetContests) {
    return this.betService.getContests(action.betterId).pipe(
      map(readContests => {
        state.patchState({ contests: readContests});
      })
    );
  }

  @Action(BetActions.SetCategory)
  setCategory(state: StateContext<BetStateModel>, action: BetActions.SetCategory) {
    const currentState = state.getState();

    return currentState.contests?.map(contest => {
      contest.categories?.map(category => {
        if (category.id === action.categoryId) {
          state.patchState( { category, contest });
          
          state.dispatch([new BetActions.GetPlayers(category.id)]);
        }
      });
    });
  }

  @Action(BetActions.GetPlayers)
  getPlayers(state: StateContext<BetStateModel>, action: BetActions.GetPlayers) {
    const currentState = state.getState();

    return this.playerService.getPlayers(action.categoryId).pipe(
      tap(readPlayers => {
        state.patchState({ players: readPlayers });
        state.dispatch([new BetActions.GetBet(currentState.better?.id || 0, currentState.category?.id || 0)]);
      })
    );
  }

  static setWinnerName(state: StateContext<BetStateModel>, playerId: number): void {
    const player = state.getState().players?.find((player => {
      return player.id === playerId;
    }));
    if (player) {
      state.patchState({ winner: player.playerName1 + ' - ' + player.playerName2 });
    } else {
      state.patchState({ winner: '-' });
    }
  }

  static setRunnerUpName(state: StateContext<BetStateModel>, playerId: number): void {
    const player = state.getState().players?.find((player => {
      return player.id === playerId;
    }));
    if (player) {
      state.patchState({ runnerUp: player.playerName1 + ' - ' + player.playerName2 });
    } else {
      state.patchState({ runnerUp: '-' });
    }
  }

  @Action(BetActions.GetBet)
  getBet(state: StateContext<BetStateModel>, action: BetActions.GetBet) {
    const currentState = state.getState();

    return this.betService.getBet(action.betterId, action.categoryId).pipe(
      tap(readBet => {
        state.patchState({ bet: readBet });

        // Mise à jour du nom du vainqueur et du finaliste si les données sont renseignées
        BetState.setWinnerName(state, readBet.winnerId);
        BetState.setRunnerUpName(state, readBet.runnerUpId);
      })
    );
  }

  @Action(BetActions.GetBets)
  getBets(state: StateContext<BetStateModel>, action: BetActions.GetBet) {
    const currentState = state.getState();

    return this.betService.getBets(action.betterId).pipe(
      tap(readBets => {
        state.patchState({ bets: readBets });

        // Recherche du premier pronostic non renseigné
        const nextBetToFill = BetState.searchFirstBetToFill(state);
        if (nextBetToFill.category) {
          state.dispatch([new BetActions.SetCategory(nextBetToFill.category)]);
          if (nextBetToFill.focusOnWinner) {
            UtilsService.focusWinner();
          } else {
            UtilsService.focusRunnerUp();
          }
        }
      })
    );
  }

  static getNextBet(state: StateContext<BetStateModel>, currentBetIndex: number): number {
    let ret = ++currentBetIndex;
    if (ret === state.getState()?.bets?.length) {
      ret = 0;
    }
    return ret;
  }

  static isBetFilled(bet: IBet): boolean {
    return bet.winnerId !== 0 && bet.runnerUpId !== 0 ? true : false;
  }

  static searchFirstBetToFill(state: StateContext<BetStateModel>): INextBetToFill {
    const currentState = state.getState();
    const bet = currentState.bets?.find(bet => { return bet.winnerId === 0 || bet.runnerUpId === 0 });
    if (bet) {
      return {
        category: bet.categoryId,
        focusOnWinner: bet.winnerId === 0 ? true : false
      };
    } else {
      // Si aucun pronostic n'est à remplir, on se place sur le premier pronostic
      return <INextBetToFill>{
        category: (state.getState().contests || [])[0]?.categories[0]?.id,
        focusOnWinner: true
      };
    }
  }

  static searchNextBetToFill(state: StateContext<BetStateModel>, currentBetIndex: number): INextBetToFill {
    const currentState = state.getState();

    let nextBetIndex = this.getNextBet(state, currentBetIndex || 0);
    let bet = (currentState.bets || [])[nextBetIndex] || undefined;
    while(this.isBetFilled(bet) && nextBetIndex !== currentBetIndex) {
      nextBetIndex = this.getNextBet(state, nextBetIndex || 0);
      bet = (currentState.bets || [])[nextBetIndex] || undefined;
    }

    if (nextBetIndex === currentBetIndex) {
      // On a fait le tour, sans trouver de pronostic à saisir
      return <INextBetToFill>{};
    } else {
      return {
        category: bet.categoryId,
        focusOnWinner: bet.winnerId === 0 ? true : false
      }
    }
  }

  static searchBetToFill(state: StateContext<BetStateModel>, category: number, isFocusedOnWinner: boolean): INextBetToFill {
    const currentState = state.getState();

    // On cherche dans le tableau des pronostics à quel index on se trouve
    let currentBetIndex: number | undefined = currentState.bets?.findIndex(bet => { return bet.categoryId === category });

    if (currentBetIndex !== -1) {
      // On vérifie que dans le pronostic sur lequel on est, celui du vainqueur / finaliste est rempli ou non
      if (isFocusedOnWinner === true) {
        if (currentState.bet?.runnerUpId === 0) {
          return {
            category,
            focusOnWinner: false
          };
        } else {
          // Les deux pronostics de cette série sont remplis, on cherche dans les autres séries
          return BetState.searchNextBetToFill(state, currentBetIndex || 0);
        }
      } else {
        if (currentState.bet?.winnerId === 0) {
          return {
            category,
            focusOnWinner: true
          };
        } else {
          // Les deux pronostics de cette série sont remplis, on cherche dans les autres séries
          return BetState.searchNextBetToFill(state, currentBetIndex || 0);
        }
      }
    }

    return <INextBetToFill>{};
  }

  @Action(BetActions.SetWinner)
  setWinner(state: StateContext<BetStateModel>, action: BetActions.SetWinner) {
    const currentState = state.getState();

    return this.betService.setWinner(
      currentState.better?.id || 0,
      currentState.better?.isAdmin || false,
      currentState.contest?.id || 0,
      currentState.category?.id || 0,
      action.playerId).pipe(
      tap(() => {
        const bet = currentState.bet;
        state.patchState({
          bet: {
            betterId: bet?.betterId || 0,
            categoryId: bet?.categoryId || 0,
            winnerId: action.playerId,
            runnerUpId: bet?.runnerUpId || 0
          }
        });
        state.setState(
          patch({
            bets: updateItem<IBet>(
              (b) => b.categoryId === currentState.category?.id,
              patch({
                winnerId: action.playerId
              })
            ),
          })
        );

        // Mise à jour du nom du vainqueur
        BetState.setWinnerName(state, action.playerId);

        // Recherche du prochain pari à saisir
        const nextBetToFill = BetState.searchBetToFill(state, currentState.category?.id || 0, true);
        if (nextBetToFill.category) {
          state.dispatch([new BetActions.SetCategory(nextBetToFill.category)]);
          if (nextBetToFill.focusOnWinner) {
            UtilsService.focusWinner();
          } else {
            UtilsService.focusRunnerUp();
          }
        }
      })
    );
  }

  @Action(BetActions.SetRunnerUp)
  setRunnerUp(state: StateContext<BetStateModel>, action: BetActions.SetRunnerUp) {
    const currentState = state.getState();

    return this.betService.setRunnerUp(
      currentState.better?.id || 0,
      currentState.better?.isAdmin || false,
      currentState.contest?.id || 0,
      currentState.category?.id || 0,
      action.playerId).pipe(
      tap(() => {
        const bet = currentState.bet;
        state.patchState({ bet: {
          betterId: bet?.betterId || 0,
          categoryId: bet?.categoryId || 0,
          winnerId: bet?.winnerId || 0,
          runnerUpId: action.playerId
        }});
        state.setState(
          patch({
            bets: updateItem<IBet>(
              (b) => b.categoryId === currentState.category?.id,
              patch({
                runnerUpId: action.playerId
              })
            ),
          })
        );

        // Mise à jour du nom du finaliste
        BetState.setRunnerUpName(state, action.playerId);

        // Recherche du prochain pari à saisir
        const nextBetToFill = BetState.searchBetToFill(state, currentState.category?.id || 0, false);
        if (nextBetToFill.category) {
          state.dispatch([new BetActions.SetCategory(nextBetToFill.category)]);
          if (nextBetToFill.focusOnWinner) {
            UtilsService.focusWinner();
          }
          else {
            UtilsService.focusRunnerUp();
          }
        }
      })
    );
  }

  @Action(BetActions.GetDuration)
  getDuration(state: StateContext<BetStateModel>, action: BetActions.GetDuration) {
    const currentState = state.getState();

    return this.betService.getDuration(action.betterId).pipe(
      tap(readDuration => {
        state.patchState({ duration: readDuration.duration });
      })
    );
  }

  @Action(BetActions.SetDuration)
  setDuration(state: StateContext<BetStateModel>, action: BetActions.SetDuration) {
    const currentState = state.getState();

    return this.betService.setDuration(action.betterId, currentState.contest?.id || 0, currentState.contest?.day || 0, action.duration).pipe(
      tap(() => {
        state.patchState({ duration: action.duration });
      })
    );
  }
}
