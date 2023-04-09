import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
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
import { IDuration } from 'src/app/models/duration';
import { IEmpty, IOffline } from 'src/app/models/utils';
import { ConnectionActions } from '../action/connection.action';

export class BetStateModel {
  isOffline!: boolean | undefined;
  better!: IBetter | undefined;
  betters!: IBetter[] | undefined;
  contest!: IContest | undefined;
  contests!: IContest[] | undefined;
  category!: ICategory | undefined;
  players!: IPlayer[] | undefined;
  currentBet!: IBet | undefined;
  bets!: IBet[] | undefined;
  winner!: string | undefined;
  runnerUp!: string | undefined;
  duration!: IDuration | undefined;
  completedBets!: number | undefined;
  allBetsDone!: boolean | undefined;
}

@State<BetStateModel>({
  name: 'bet',
  defaults: {
    isOffline: undefined,
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
    duration: undefined,
    completedBets: undefined,
    allBetsDone: undefined,
  },
})
@Injectable()
export class BetState {
  constructor(
    private betService: BetService,
    private playerService: PlayerService
  ) {}

  @Selector()
  static isOffline(state: BetStateModel) {
    return state.isOffline;
  }

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

  @Selector()
  static completedBets(state: BetStateModel) {
    return state.completedBets;
  }

  @Selector()
  static allBetsDone(state: BetStateModel) {
    return state.allBetsDone;
  }

  @Action(BetActions.SetBetter)
  setBetter(state: StateContext<BetStateModel>, action: BetActions.SetBetter) {
    if (action.better) {
      state.patchState({ isOffline: false, better: action.better });

      window.localStorage.setItem('better', JSON.stringify(action.better));

      // Lecture des concours auxquels est inscrit le participant, des pronostics et du pronostic de durée
      state.dispatch([
        new BetActions.GetContests(action.better.accessKey),
        new BetActions.GetBets(action.better.accessKey),
        new BetActions.GetDuration(action.better.accessKey),
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
      tap((readBetters: IBetter[] | IOffline) => {
        if ('isOffline' in readBetters) {
          // Hors connexion
          state.dispatch([new ConnectionActions.IsOffline()]);
        } else {
          state.patchState({
            isOffline: false,
            betters: <IBetter[]>readBetters,
          });
        }
      })
    );
  }

  @Action(BetActions.GetContests)
  getContests(
    state: StateContext<BetStateModel>,
    action: BetActions.GetContests
  ) {
    return this.betService.getContests(action.accessKey).pipe(
      map((readContests: IContest[] | IOffline) => {
        if ('isOffline' in readContests) {
          // Hors connexion
          state.dispatch([new ConnectionActions.IsOffline()]);
        } else {
          state.patchState({
            isOffline: false,
            contests: <IContest[]>readContests,
          });

          // Vérification de la possibilité de mettre à jour les pronostics
          const now = new Date();
          state.getState().contests?.map((contest) => {
            const startDate = new Date(contest.startDate);
            const endBetDate = new Date(contest.endBetDate);
            const isAdmin = state.getState().better?.isAdmin;
            const isUpdatable = startDate <= now && endBetDate >= now;

            state.setState(
              patch({
                contests: updateItem<IContest>(
                  (c) => c.id === contest.id,
                  patch({
                    isUpdatable: isAdmin ? true : isUpdatable,
                  })
                ),
              })
            );
          });
        }
      })
    );
  }

  @Action(BetActions.SetCategory)
  setCategory(
    state: StateContext<BetStateModel>,
    action: BetActions.SetCategory
  ) {
    const currentState = state.getState();

    return currentState.contests?.map((contest) => {
      contest.categories?.map((category) => {
        if (category.id === action.categoryId) {
          state.patchState({ category, contest });

          state.dispatch([
            new BetActions.GetPlayers(category.id),
            new BetActions.SetCurrentBet(action.categoryId),
          ]);
        }
      });
    });
  }

  @Action(BetActions.GetPlayers)
  getPlayers(
    state: StateContext<BetStateModel>,
    action: BetActions.GetPlayers
  ) {
    const currentState = state.getState();

    return this.playerService.getPlayers(action.categoryId).pipe(
      tap((readPlayers) => {
        state.patchState({ players: readPlayers });
      })
    );
  }

  @Action(BetActions.SetCurrentBet)
  setCurrentBet(
    state: StateContext<BetStateModel>,
    action: BetActions.SetCurrentBet
  ) {
    const currentState = state.getState();

    const currentBet = currentState.bets?.find((bet) => {
      return bet.categoryId === action.categoryId;
    });

    if (currentBet) {
      state.patchState({ currentBet: currentBet });
    }
  }

  @Action(BetActions.GetBets)
  getBets(state: StateContext<BetStateModel>, action: BetActions.GetBets) {
    const currentState = state.getState();

    return this.betService.getBets(action.accessKey).pipe(
      tap((readBets: IBet[] | IOffline) => {
        if ('isOffline' in readBets) {
          state.dispatch([new ConnectionActions.IsOffline()]);
        } else {
          state.patchState({
            isOffline: false,
            bets: <IBet[]>readBets,
          });

          BetState.calculateCompletedBetsOnLoad(state);

          // Recherche du premier pronostic non renseigné
          const categoryId = BetState.searchFirstBetToFill(state);
          if (categoryId !== -1) {
            state.dispatch([
              new BetActions.SetCategory(categoryId),
              new BetActions.SetCurrentBet(categoryId),
            ]);
          }
        }
      })
    );
  }

  static calculateCompletedBetsOnLoad(state: StateContext<BetStateModel>) {
    const currentState = state.getState();

    // On compte le nombre de pronostics correctement renseignés
    const completedBets = currentState.bets?.filter((bet) => {
      return bet.winnerId !== 0 && bet.runnerUpId !== 0;
    });

    state.patchState({
      completedBets: completedBets?.length || 0,
    });
  }

  static calculateCompletedBetsOnUpdate(state: StateContext<BetStateModel>) {
    // On compte le nombre de pronostics correctement renseignés
    const completedBets = state.getState().bets?.filter((bet) => {
      return bet.winnerId !== 0 && bet.runnerUpId !== 0;
    });

    // Si le nombre de pronostics saisis est égal au nombre de pronostics total (tout a été pronostiqué)
    // et que le nombre précédent de pronostics saisis était inférieur, alors on vient tout juste de saisir
    // tous les pronostics ==> on le signale au pronostiqueur
    const completedBetsCount = completedBets?.length || 0;
    const totalBetsCount = state.getState().bets?.length || 0;
    const oldCompletedBetsCount = state.getState().completedBets || 0;

    if (
      completedBetsCount === totalBetsCount &&
      oldCompletedBetsCount < completedBetsCount
    ) {
      state.dispatch([new BetActions.AllBetsDone()]);
    }

    state.patchState({
      completedBets: completedBets?.length || 0,
    });
  }

  static getNextBet(
    state: StateContext<BetStateModel>,
    currentBetIndex: number
  ): number {
    let ret = ++currentBetIndex;
    if (ret === state.getState()?.bets?.length) {
      ret = 0;
    }
    return ret;
  }

  static isBetFilled(bet: IBet): boolean {
    return bet.winnerId !== 0 &&
      bet.winnerId !== null &&
      bet.runnerUpId !== 0 &&
      bet.runnerUpId !== null
      ? true
      : false;
  }

  static searchFirstBetToFill(state: StateContext<BetStateModel>): number {
    const currentState = state.getState();

    const bet = currentState.bets?.find((bet) => {
      return (
        bet.winnerId === 0 ||
        bet.runnerUpId === 0 ||
        bet.winnerId === null ||
        bet.runnerUpId === null
      );
    });

    if (bet) {
      return bet.categoryId;
    } else {
      // Si aucun pronostic n'est à remplir, on se place sur le premier pronostic
      const contests = currentState.contests;
      if (contests && contests.length) {
        return contests[0].categories[0].id;
      } else {
        return -1;
      }
    }
  }

  static searchNextBetToFill(
    state: StateContext<BetStateModel>,
    currentBetIndex: number
  ): number {
    const currentState = state.getState();

    let nextBetIndex = this.getNextBet(state, currentBetIndex || 0);
    let bet = currentState.bets![nextBetIndex]!;
    while (this.isBetFilled(bet) && nextBetIndex !== currentBetIndex) {
      nextBetIndex = this.getNextBet(state, nextBetIndex || 0);
      bet = (currentState.bets || [])[nextBetIndex];
    }

    if (nextBetIndex === currentBetIndex) {
      // On a fait le tour, sans trouver de pronostic à saisir
      return -1;
    } else {
      return bet.categoryId;
    }
  }

  static searchBetToFill(
    state: StateContext<BetStateModel>,
    category: number
  ): number {
    const currentState = state.getState();

    // On cherche dans le tableau des pronostics à quel index on se trouve
    let currentBetIndex: number = currentState.bets?.findIndex((bet) => {
      return bet.categoryId === category;
    })!;

    if (currentBetIndex !== -1) {
      // On vérifie que les deux pronostics (vainqueur et finaliste) soient remplis
      if (
        currentState.currentBet?.winnerId === 0 ||
        currentState.currentBet?.runnerUpId === 0
      ) {
        // L'un des deux pronostics n'est pas renseigné, on reste donc sur cette série
        return -1;
      } else {
        // Les deux pronostics de cette série sont remplis, on cherche dans les autres séries
        return BetState.searchNextBetToFill(state, currentBetIndex || 0);
      }
    }

    return -1;
  }

  @Action(BetActions.SetWinner)
  setWinner(state: StateContext<BetStateModel>, action: BetActions.SetWinner) {
    const currentState = state.getState();

    return this.betService
      .setWinner(
        currentState.better?.accessKey || '',
        currentState.contest?.id || 0,
        currentState.category?.id || 0,
        action.playerId
      )
      .pipe(
        tap((ret: IEmpty | IOffline) => {
          if (ret && 'isOffline' in ret) {
            state.dispatch([new ConnectionActions.IsOffline()]);
          } else {
            const bet = currentState.bets?.find((bet) => {
              return bet.categoryId === currentState.category?.id;
            });

            if (bet) {
              state.setState(
                patch({
                  isOffline: false,
                  bets: updateItem<IBet>(
                    (b) => b.categoryId === currentState.category?.id,
                    patch({
                      winnerId: action.playerId,
                      runnerUpId:
                        bet?.runnerUpId === action.playerId
                          ? 0
                          : bet?.runnerUpId,
                    })
                  ),
                  currentBet: {
                    ...bet,
                    winnerId: action.playerId,
                    runnerUpId:
                      bet?.runnerUpId === action.playerId ? 0 : bet?.runnerUpId,
                  },
                })
              );

              BetState.calculateCompletedBetsOnUpdate(state);

              // Recherche du prochain pari à saisir
              const categoryId = BetState.searchBetToFill(
                state,
                currentState.category?.id || 0
              );
              if (categoryId !== -1) {
                state.dispatch([new BetActions.SetCategory(categoryId)]);
              }
            }
          }
        })
      );
  }

  @Action(BetActions.SetRunnerUp)
  setRunnerUp(
    state: StateContext<BetStateModel>,
    action: BetActions.SetRunnerUp
  ) {
    const currentState = state.getState();

    return this.betService
      .setRunnerUp(
        currentState.better?.accessKey || '',
        currentState.contest?.id || 0,
        currentState.category?.id || 0,
        action.playerId
      )
      .pipe(
        tap((ret: IEmpty | IOffline) => {
          if (ret && 'isOffline' in ret) {
            state.dispatch([new ConnectionActions.IsOffline()]);
          } else {
            const bet = currentState.bets?.find((bet) => {
              return bet.categoryId === currentState.category?.id;
            });

            if (bet) {
              state.setState(
                patch({
                  isOffline: false,
                  bets: updateItem<IBet>(
                    (b) => b.categoryId === currentState.category?.id,
                    patch({
                      runnerUpId: action.playerId,
                      winnerId:
                        bet?.winnerId === action.playerId ? 0 : bet?.winnerId,
                    })
                  ),
                  currentBet: {
                    ...bet,
                    runnerUpId: action.playerId,
                    winnerId:
                      bet?.winnerId === action.playerId ? 0 : bet?.winnerId,
                  },
                })
              );

              BetState.calculateCompletedBetsOnUpdate(state);

              // Recherche du prochain pari à saisir
              const categoryId = BetState.searchBetToFill(
                state,
                currentState.category?.id || 0
              );
              if (categoryId !== -1) {
                state.dispatch([new BetActions.SetCategory(categoryId)]);
              }
            }
          }
        })
      );
  }

  @Action(BetActions.GetDuration)
  getDuration(
    state: StateContext<BetStateModel>,
    action: BetActions.GetDuration
  ) {
    const currentState = state.getState();

    return this.betService.getDuration(action.accessKey).pipe(
      tap((readDuration: IDuration | IOffline) => {
        if ('isOffline' in readDuration) {
          state.dispatch([new ConnectionActions.IsOffline()]);
        } else {
          state.patchState({
            isOffline: false,
            duration: <IDuration>readDuration,
          });
        }
      })
    );
  }

  @Action(BetActions.SetDuration)
  setDuration(
    state: StateContext<BetStateModel>,
    action: BetActions.SetDuration
  ) {
    const currentState = state.getState();

    return this.betService
      .setDuration(
        currentState.better?.accessKey || '0',
        currentState.contest?.id || 0,
        currentState.contest?.day || 0,
        action.duration
      )
      .pipe(
        tap((ret: IEmpty | IOffline) => {
          if ('isOffline' in ret) {
            state.dispatch([new ConnectionActions.IsOffline()]);
          } else {
            const duration: IDuration = {
              duration: action.duration,
              isDurationUpdatable:
                currentState.duration?.isDurationUpdatable || true,
            };
            state.patchState({ isOffline: false, duration: duration });
          }
        })
      );
  }

  @Action(BetActions.AllBetsDone)
  allBetsDone(state: StateContext<BetStateModel>) {
    state.patchState({
      allBetsDone: true,
    });
  }

  @Action(ConnectionActions.IsOffline)
  isOffline(state: StateContext<BetStateModel>) {
    state.patchState({
      isOffline: true,
    });
  }

  @Action(ConnectionActions.Logout)
  logout(state: StateContext<BetStateModel>) {
    state.patchState({
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
      duration: undefined,
      completedBets: undefined,
      allBetsDone: undefined,
    });
  }
}
