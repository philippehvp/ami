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
    currentBet: IBet | undefined;
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
    currentBet: undefined,
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
  static currentBet(state: BetStateModel) {
    return state.currentBet;
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

  @Selector()
  static duration(state: BetStateModel) {
    return state.duration;
  }

  @Action(BetActions.SetBetter)
  setBetter(state: StateContext<BetStateModel>, action: BetActions.SetBetter) {
    // Recherche du participant ayant l'identifiant passé en paramètre
    const better = state.getState().betters?.find((better => { return better.id === action.betterId }));
    if(better) {
        state.patchState({better: better});
    
        // Lecture des concours auxquels est inscrit le participant, des pronostics et du pronostic de durée
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
          state.dispatch([new BetActions.SetBetter(readBetters[0].id)]);
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
          
          state.dispatch([
            new BetActions.GetPlayers(category.id),
            new BetActions.SetCurrentBet(action.categoryId)
          ]);
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
      })
    );
  }

  @Action(BetActions.SetCurrentBet)
  setCurrentBet(state: StateContext<BetStateModel>, action: BetActions.SetCurrentBet) {
    const currentState = state.getState();

    const currentBet = currentState.bets?.find(bet => {
      return bet.categoryId === action.categoryId;
    });

    if(currentBet) {
      state.patchState({ currentBet: currentBet });
    }
  }

  @Action(BetActions.GetBets)
  getBets(state: StateContext<BetStateModel>, action: BetActions.GetBets) {
    const currentState = state.getState();

    return this.betService.getBets(action.betterId).pipe(
      tap(readBets => {
        state.patchState({ bets: readBets });

        // Recherche du premier pronostic non renseigné
        const nextBetToFill = BetState.searchFirstBetToFill(state);
        if (nextBetToFill.category) {
          state.dispatch([
            new BetActions.SetCategory(nextBetToFill.category),
            new BetActions.SetCurrentBet(nextBetToFill.category)
          ]);

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
    return (bet.winnerId !== 0 && bet.winnerId !== null &&
      bet.runnerUpId !== 0 && bet.runnerUpId !== null) ? true : false;
  }

  static searchFirstBetToFill(state: StateContext<BetStateModel>): INextBetToFill {
    const currentState = state.getState();

    const bet = currentState.bets?.find(bet => {
      return bet.winnerId === 0 || bet.runnerUpId === 0 || bet.winnerId === null || bet.runnerUpId === null
    });
    if (bet) {
      return {
        category: bet.categoryId,
        focusOnWinner: bet.winnerId === 0 ? true : false
      };
    } else {
      // Si aucun pronostic n'est à remplir, on se place sur le premier pronostic
      return <INextBetToFill>{
        category: (currentState.contests || [])[0]?.categories[0]?.id || 0,
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
        if (currentState.currentBet?.runnerUpId === 0) {
          return {
            category,
            focusOnWinner: false
          };
        } else {
          // Les deux pronostics de cette série sont remplis, on cherche dans les autres séries
          return BetState.searchNextBetToFill(state, currentBetIndex || 0);
        }
      } else {
        if (currentState.currentBet?.winnerId === 0) {
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
        const bet = currentState.bets?.find(bet => {
          return bet.categoryId === currentState.category?.id;
        });

        if (bet) {
          state.setState(
            patch({
              bets: updateItem<IBet>(
                (b) => b.categoryId === currentState.category?.id,
                patch({
                  winnerId: action.playerId,
                  runnerUpId: bet?.runnerUpId === action.playerId ? 0 : bet?.runnerUpId
                })
              ),
              currentBet: {
                ...bet,
                winnerId: action.playerId,
                  runnerUpId: bet?.runnerUpId === action.playerId ? 0 : bet?.runnerUpId
              }
            })
          );

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
          const bet = currentState.bets?.find(bet => {
            return bet.categoryId === currentState.category?.id;
          });

          if (bet) {
            state.setState(
              patch({
                bets: updateItem<IBet>(
                  (b) => b.categoryId === currentState.category?.id,
                  patch({
                    runnerUpId: action.playerId,
                    winnerId: bet?.winnerId === action.playerId ? 0 : bet?.winnerId
                  })
                ),
                currentBet: {
                  ...bet,
                  runnerUpId: action.playerId,
                    winnerId: bet?.winnerId === action.playerId ? 0 : bet?.winnerId
                }
              })
            );
    
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
          }
        }
      )
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

    return this.betService.setDuration(currentState.better?.id || 0, currentState.better?.isAdmin || false, currentState.contest?.id || 0, currentState.contest?.day || 0, action.duration).pipe(
      tap(() => {
        state.patchState({ duration: action.duration });
      })
    );
  }
}
