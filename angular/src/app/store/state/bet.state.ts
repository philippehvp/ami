import { Injectable, inject } from '@angular/core';
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
import { IEmpty, INotUpdatable, IOffline } from 'src/app/models/utils';
import { ConnectionActions } from '../action/connection.action';
import { BetterService } from 'src/app/services/rest/better.service';
import { PersistenceService } from 'src/app/services/persistence.service';
import { IBetterPoint } from 'src/app/models/better-point';
import { IBetReviewOf } from 'src/app/models/bet-review-of';
import { EMPTY } from 'rxjs';
import { IBetterRanking } from 'src/app/models/better-ranking';
import { BetterRankingService } from 'src/app/services/rest/better-ranking.service';

export class BetStateModel {
  isOffline!: boolean;
  better!: IBetter;
  betters!: IBetter[];
  contest!: IContest;
  contests!: IContest[];
  category!: ICategory;
  players!: IPlayer[];
  bet!: IBet;
  bets!: IBet[];
  betsReviewOf!: IBetReviewOf[];
  duration!: IDuration;
  completedBets!: number;
  isLoadingData!: boolean;
  allBetsDone!: boolean;
  proposeAutoNavigation!: boolean;
  categoryToDisplay!: number;
  betterPoints!: IBetterPoint[];
  bettersRanking!: IBetterRanking[] | undefined;
}

@State<BetStateModel>({
  name: 'bet',
  defaults: {
    isOffline: false,
    better: <IBetter>{},
    betters: [],
    contest: <IContest>{},
    contests: [],
    category: <ICategory>{},
    players: [],
    bet: <IBet>{},
    bets: [],
    betsReviewOf: [],
    duration: <IDuration>{},
    completedBets: 0,
    isLoadingData: false,
    allBetsDone: false,
    proposeAutoNavigation: false,
    categoryToDisplay: -1,
    betterPoints: [],
    bettersRanking: [],
  },
})
@Injectable()
export class BetState {
  private persistenceService = inject(PersistenceService);
  private betService = inject(BetService);
  private betterService = inject(BetterService);
  private playerService = inject(PlayerService);
  private pointService = inject(BetService);
  private rankingService = inject(BetterRankingService);

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
  static bet(state: BetStateModel) {
    return state.bet;
  }

  @Selector()
  static bets(state: BetStateModel) {
    return state.bets;
  }

  @Selector()
  static betsReviewOf(state: BetStateModel) {
    return state.betsReviewOf;
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
  static isLoadingData(state: BetStateModel) {
    return state.isLoadingData;
  }

  @Selector()
  static allBetsDone(state: BetStateModel) {
    return state.allBetsDone;
  }

  @Selector()
  static proposeAutoNavigation(state: BetStateModel) {
    return state.proposeAutoNavigation;
  }

  @Selector()
  static betterPoints(state: BetStateModel) {
    return state.betterPoints;
  }

  @Selector()
  static bettersRanking(state: BetStateModel) {
    return state.bettersRanking;
  }

  @Action(BetActions.GetBetterRanking)
  getBetterRanking(
    state: StateContext<BetStateModel>,
    action: BetActions.GetBetterRanking
  ) {
    return this.rankingService
      .getBettersRanking(state.getState().better.accessKey, action.byRanking)
      .pipe(
        tap((readBettersRanking: IBetterRanking[] | IOffline) => {
          if (readBettersRanking && 'isOffline' in readBettersRanking) {
            state.dispatch([new ConnectionActions.IsOffline()]);
          } else {
            state.patchState({
              bettersRanking: <IBetterRanking[]>readBettersRanking,
            });
          }
        })
      );
  }
  @Action(BetActions.SetBetter)
  setBetter(state: StateContext<BetStateModel>, action: BetActions.SetBetter) {
    if (action.better) {
      state.patchState({ isOffline: false, better: action.better });

      this.playerService.emptyPlayers();

      // Lecture des concours auxquels est inscrit le participant, des pronostics et du pronostic de durée
      state.dispatch([new BetActions.GetContests(action.better.accessKey)]);
    } else {
      return;
    }
  }

  @Action(BetActions.SetTutorialDone)
  setTutorialDone(state: StateContext<BetStateModel>) {
    return this.betterService
      .setIsTutorialDone(state.getState().better?.accessKey || '')
      .pipe(
        tap((ret: IEmpty | IOffline) => {
          if (ret && 'isOffline' in ret) {
            // Hors connexion
            state.dispatch([new ConnectionActions.IsOffline()]);
          }
        })
      );
  }

  @Action(BetActions.SetEvaluation)
  updateEvaluation(
    state: StateContext<BetStateModel>,
    action: BetActions.SetEvaluation
  ) {
    const better = state.getState().better;
    state.patchState({
      better: { ...better, evaluation: action.evaluationLevel },
    });
    return this.betterService
      .setEvaluation(
        state.getState().better?.accessKey || '',
        action.evaluationLevel
      )
      .pipe(
        tap((ret: IEmpty | IOffline) => {
          if (ret && 'isOffline' in ret) {
            // Hors connexion
            state.dispatch([new ConnectionActions.IsOffline()]);
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

            state.dispatch([new BetActions.GetBets()]);
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

    if (currentState.category?.id !== action.categoryId) {
      return currentState.contests?.map((contest) => {
        contest.categories?.map((category) => {
          if (category.id === action.categoryId) {
            state.patchState({ category, contest });

            state.dispatch([
              new BetActions.IsLoadingData(true),
              new BetActions.GetPlayers(category.id),
              new BetActions.SetBet(action.categoryId),
            ]);
          }
        });
      });
    } else {
      return;
    }
  }

  @Action(BetActions.GetPlayers)
  getPlayers(
    state: StateContext<BetStateModel>,
    action: BetActions.GetPlayers
  ) {
    const currentState = state.getState();

    state.patchState({ isLoadingData: true });

    return this.playerService
      .getPlayers(currentState.better.accessKey, action.categoryId)
      .pipe(
        tap((readPlayers: IPlayer[] | IOffline) => {
          if ('isOffline' in readPlayers) {
            state.dispatch([new ConnectionActions.IsOffline()]);
          } else {
            state.patchState({
              players: <IPlayer[]>readPlayers,
              isLoadingData: false,
            });
          }
        })
      );
  }

  @Action(BetActions.SetBet)
  setBet(state: StateContext<BetStateModel>, action: BetActions.SetBet) {
    const currentState = state.getState();

    const bet = currentState.bets?.find((bet) => {
      return bet.categoryId === action.categoryId;
    });

    if (bet) {
      state.patchState({ bet: bet });
    }
  }

  @Action(BetActions.GetBets)
  getBets(state: StateContext<BetStateModel>) {
    const currentState = state.getState();

    return this.betService.getBets(currentState.better.accessKey).pipe(
      tap((readBets: IBet[] | IOffline) => {
        if ('isOffline' in readBets) {
          state.dispatch([new ConnectionActions.IsOffline()]);
        } else {
          state.patchState({
            isOffline: false,
            bets: <IBet[]>readBets,
          });

          this.calculateCompletedBetsOnLoad(state);

          // Recherche du premier pronostic non renseigné
          const categoryId = this.searchFirstBetToFill(state);
          if (categoryId !== -1) {
            state.dispatch([
              new BetActions.GetDuration(),
              new BetActions.SetCategory(categoryId),
              new BetActions.SetBet(categoryId),
            ]);
          }
        }
      })
    );
  }

  @Action(BetActions.GetBetsReviewOf)
  getBetsReviewOf(
    state: StateContext<BetStateModel>,
    action: BetActions.GetBetsReviewOf
  ) {
    const currentState = state.getState();

    // Dans le cas où un utilisateur décide de regarder deux fois d'affilée les pronostics d'un pronostiqueur,
    // il est nécessaire entre les deux de remettre à zéro les pronostics consultés
    // En effet, si ce sont deux fois les mêmes, on ne déclenche pas de mise à jour de l'affichage
    if (action.randomKey) {
      return this.betService
        .getBetsReviewOf(currentState.better?.accessKey || '', action.randomKey)
        .pipe(
          tap((readBetsReviewOf: IBetReviewOf[] | IOffline) => {
            if ('isOffline' in readBetsReviewOf) {
              state.dispatch([new ConnectionActions.IsOffline()]);
            } else {
              state.patchState({
                isOffline: false,
                betsReviewOf: <IBetReviewOf[]>readBetsReviewOf,
              });
            }
          })
        );
    } else {
      state.patchState({
        isOffline: false,
        betsReviewOf: [],
      });

      return EMPTY;
    }
  }

  private calculateCompletedBetsOnLoad(state: StateContext<BetStateModel>) {
    const currentState = state.getState();

    // On compte le nombre de pronostics correctement renseignés
    const completedBets = currentState.bets?.filter((bet) => {
      return bet.winnerId !== 0 && bet.runnerUpId !== 0;
    });

    state.patchState({
      completedBets: completedBets?.length || 0,
    });
  }

  private calculateCompletedBetsOnUpdate(state: StateContext<BetStateModel>) {
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
      state.patchState({
        allBetsDone: true,
      });
    }

    state.patchState({
      completedBets: completedBets?.length || 0,
    });

    if (
      !this.persistenceService.isAutoNavigation &&
      oldCompletedBetsCount === 0 &&
      completedBetsCount === 1 &&
      state.getState().better.isAdmin === false
    ) {
      state.patchState({ proposeAutoNavigation: true });
    } else {
      state.patchState({ proposeAutoNavigation: false });
    }
  }

  private getNextBet(
    state: StateContext<BetStateModel>,
    currentBetIndex: number
  ): number {
    let ret = ++currentBetIndex;
    if (ret === state.getState()?.bets?.length) {
      ret = 0;
    }
    return ret;
  }

  private searchFirstBetToFill(state: StateContext<BetStateModel>): number {
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

  private searchNextBetToFill(
    state: StateContext<BetStateModel>,
    currentBetIndex: number
  ): number {
    const currentState = state.getState();

    let nextBetIndex = this.getNextBet(state, currentBetIndex || 0);
    let bet = currentState.bets![nextBetIndex]!;
    while (bet.isComplete && nextBetIndex !== currentBetIndex) {
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

  private searchBetToFill(
    state: StateContext<BetStateModel>,
    category: number
  ): number {
    const currentState = state.getState();

    if (currentState.better?.isAdmin) {
      return -1;
    }

    // On cherche dans le tableau des pronostics à quel index on se trouve
    let currentBetIndex: number = currentState.bets?.findIndex((bet) => {
      return bet.categoryId === category;
    })!;

    if (currentBetIndex !== -1) {
      // On vérifie que les deux pronostics (vainqueur et finaliste) soient remplis
      if (
        currentState.bet?.winnerId === 0 ||
        currentState.bet?.runnerUpId === 0
      ) {
        // L'un des deux pronostics n'est pas renseigné, on reste donc sur cette série
        return -1;
      } else {
        // Les deux pronostics de cette série sont remplis, on cherche dans les autres séries
        return this.searchNextBetToFill(state, currentBetIndex || 0);
      }
    }

    return -1;
  }

  private handleError(
    state: StateContext<BetStateModel>,
    ret: IOffline | INotUpdatable
  ) {
    if ('isOffline' in ret) {
      state.dispatch([new ConnectionActions.IsOffline()]);
    } else if ('isNotUpdatable' in ret) {
      state.dispatch([new BetActions.IsNotUpdatable()]);
    }
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
        tap((ret: IEmpty | IOffline | INotUpdatable) => {
          if (ret && ('isOffline' in ret || 'isNotUpdatable' in ret)) {
            this.handleError(state, ret);
          } else {
            const bet = currentState.bet;

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
                      isComplete:
                        !bet?.runnerUpId || bet?.runnerUpId === action.playerId
                          ? false
                          : true,
                    })
                  ),
                  bet: {
                    ...bet,
                    winnerId: action.playerId,
                    runnerUpId:
                      bet?.runnerUpId === action.playerId ? 0 : bet?.runnerUpId,
                    isComplete:
                      !bet?.runnerUpId || bet?.runnerUpId === action.playerId
                        ? false
                        : true,
                  },
                })
              );

              this.calculateCompletedBetsOnUpdate(state);

              // Recherche du prochain pari à saisir si l'option est activée
              if (this.persistenceService.isAutoNavigation) {
                const categoryId = this.searchBetToFill(
                  state,
                  currentState.category?.id || 0
                );
                if (categoryId !== -1) {
                  state.dispatch([new BetActions.SetCategory(categoryId)]);
                }
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
        tap((ret: IEmpty | IOffline | INotUpdatable) => {
          if (ret && ('isOffline' in ret || 'isNotUpdatable' in ret)) {
            this.handleError(state, ret);
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
                      isComplete:
                        !bet?.winnerId || bet?.winnerId === action.playerId
                          ? false
                          : true,
                    })
                  ),
                  bet: {
                    ...bet,
                    runnerUpId: action.playerId,
                    winnerId:
                      bet?.winnerId === action.playerId ? 0 : bet?.winnerId,
                    isComplete:
                      !bet?.winnerId || bet?.winnerId === action.playerId
                        ? false
                        : true,
                  },
                })
              );

              this.calculateCompletedBetsOnUpdate(state);

              // Recherche du prochain pari à saisir si l'option est activée
              if (this.persistenceService.isAutoNavigation) {
                const categoryId = this.searchBetToFill(
                  state,
                  currentState.category?.id || 0
                );
                if (categoryId !== -1) {
                  state.dispatch([new BetActions.SetCategory(categoryId)]);
                }
              }
            }
          }
        })
      );
  }

  @Action(BetActions.GetDuration)
  getDuration(state: StateContext<BetStateModel>) {
    const currentState = state.getState();

    return this.betService.getDuration(currentState.better.accessKey).pipe(
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
        tap((ret: IEmpty | IOffline | INotUpdatable) => {
          if (ret && ('isOffline' in ret || 'isNotUpdatable' in ret)) {
            this.handleError(state, ret);
          } else {
            const duration: IDuration = {
              duration: action.duration,
              isDurationUpdatable:
                currentState.duration?.isDurationUpdatable || true,
              isDurationModified: true,
            };
            state.patchState({ isOffline: false, duration: duration });
          }
        })
      );
  }

  @Action(BetActions.CalculatePointsAndRanking)
  calculatepointsAndRanking(state: StateContext<BetStateModel>) {
    return this.betService
      .calculatepointsAndRanking(state.getState().better?.accessKey || '')
      .subscribe(() => {
        state.dispatch([
          new BetActions.GetBetterPoint(this.persistenceService.categoryId),
        ]);
      });
  }

  @Action(BetActions.GetBetterPoint)
  getBetterPoint(
    state: StateContext<BetStateModel>,
    action: BetActions.GetBetterPoint
  ) {
    return this.pointService
      .getBettersPoints(state.getState().better.accessKey, action.categoryId)
      .pipe(
        tap((readBetterPoints: IBetterPoint[] | IOffline) => {
          if (readBetterPoints && 'isOffline' in readBetterPoints) {
            state.dispatch([new ConnectionActions.IsOffline()]);
          } else {
            state.patchState({
              categoryToDisplay: action.categoryId,
              betterPoints: <IBetterPoint[]>readBetterPoints,
            });
          }
        })
      );
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
      bet: undefined,
      bets: undefined,
      duration: undefined,
      completedBets: undefined,
      allBetsDone: false,
      betsReviewOf: undefined,
      isLoadingData: false,
      isOffline: false,
      proposeAutoNavigation: false,
      categoryToDisplay: -1,
      betterPoints: undefined,
    });

    this.persistenceService.init();
  }

  @Action(BetActions.IsLoadingData)
  isLoadingData(
    state: StateContext<BetStateModel>,
    action: BetActions.IsLoadingData
  ) {
    state.patchState({ isLoadingData: action.isLoadingData });
  }

  @Action(BetActions.GotoNextCategoryIfCurrentIsComplete)
  gotoNextCategoryIfCurrentIsComplete(state: StateContext<BetStateModel>) {
    const currentCategoryIndex = state.getState().bets?.findIndex((bet) => {
      return bet.categoryId === state.getState().bet.categoryId;
    });

    if (currentCategoryIndex !== -1 && state.getState().bet.isComplete) {
      const nextBetCategoryId = this.searchNextBetToFill(
        state,
        currentCategoryIndex || 0
      );

      if (nextBetCategoryId !== -1) {
        state.dispatch([new BetActions.SetCategory(nextBetCategoryId)]);
      }
    }
  }

  @Action(BetActions.UnsetAllBetsDone)
  unsetAllBetsDone(state: StateContext<BetStateModel>) {
    state.patchState({ allBetsDone: undefined });
  }

  @Action(BetActions.EraseBets)
  eraseBets(state: StateContext<BetStateModel>) {
    this.betService
      .eraseBets(state.getState().better.accessKey)
      .pipe(
        map(() => {
          state.getState().bets.map((bet) => {
            state.setState(
              patch({
                bets: updateItem<IBet>(
                  (b) => b.categoryId === bet.categoryId,
                  patch({
                    winnerId: 0,
                    runnerUpId: 0,
                    isComplete: false,
                  })
                ),
              })
            );
          });

          if (
            state.getState().bet.categoryId ===
            state.getState().bets[0].categoryId
          ) {
            // Si on est déjà sur la première série, on doit la rafraîchir sinon l'interface n'est pas mise à zéro
            state.patchState({
              bet: {
                categoryId: state.getState().bets[0].categoryId,
                winnerId: 0,
                runnerUpId: 0,
                isComplete: false,
              },
            });
          }

          state.patchState({ completedBets: 0 });

          state.dispatch([
            new BetActions.SetCategory(state.getState().bets[0].categoryId),
          ]);
        })
      )
      .subscribe();
  }

  @Action(BetActions.SetPlayersNames)
  setPlayersNames(state: StateContext<BetStateModel>) {
    return this.playerService
      .setPlayersNames(state.getState().better.accessKey)
      .pipe(
        tap((ret: IOffline | IEmpty) => {
          if (ret && 'isOffline' in ret) {
            state.dispatch([new ConnectionActions.IsOffline()]);
          }
        })
      );
  }
}
