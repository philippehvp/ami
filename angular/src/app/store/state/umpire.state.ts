import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { UmpireActions } from '../action/umpire.action';
import { ContestService } from '../../services/rest/contest.service';
import { IContest } from '../../models/contest';
import { ICategory } from '../../models/category';
import { IPair, PAIR_ALIAS } from '../../models/pair';
import { PairPlayerService } from '../../services/rest/pair-player.service';
import { IPoint, SERVER_SIDE } from '../../models/point';
import { IPlayerPosition } from '../../models/player-position';
import { ISet } from '../../models/set';
import { PlayerOnCourtService } from '../../services/player-on-court.service';
import { IEndOfSet } from '../../models/end-of-set';

const SWITCH_SCORE = 11;
const FIRST_SET_ID = 1;
const SECOND_SET_ID = 2;
const THIRD_SET_ID = 3;

const END_OF_SET_SCORE = 21;
const MAX_END_OF_SET_SCORE = 30;

export class UmpireStateModel {
  contests!: IContest[];
  categories!: ICategory[];
  players!: IPair[];
  firstSet!: ISet;
  secondSet!: ISet;
  thirdSet!: ISet;
  currentSet!: ISet;
  currentPointIndex!: number;

  lastPoint!: IPoint | undefined;
  justPlayedPoint!: IPoint | undefined;

  isEndOfGame!: boolean;
  isEndOfFirstSet!: IEndOfSet | undefined;
  isEndOfSecondSet!: IEndOfSet | undefined;

  firstSetAliasPairWinner: PAIR_ALIAS | undefined;

  setIndexToShow!: number;
}

@State<UmpireStateModel>({
  name: 'bet',
  defaults: {
    contests: [],
    categories: [],

    players: [],
    firstSet: {} as ISet,
    secondSet: {} as ISet,
    thirdSet: {} as ISet,
    currentSet: {} as ISet,
    currentPointIndex: 0,
    lastPoint: undefined,
    justPlayedPoint: undefined,
    isEndOfGame: false,
    isEndOfFirstSet: undefined,
    isEndOfSecondSet: undefined,

    firstSetAliasPairWinner: undefined,

    setIndexToShow: 0,
  },
})
@Injectable()
export class UmpireState {
  private umpireService = inject(ContestService);
  private playerService = inject(PairPlayerService);
  private playerOnCourtService = inject(PlayerOnCourtService);

  @Selector()
  static categories(state: UmpireStateModel) {
    return state.categories;
  }

  @Selector()
  static players(state: UmpireStateModel) {
    return state.players;
  }

  @Selector()
  static firstSet(state: UmpireStateModel) {
    return state.firstSet;
  }

  @Selector()
  static secondSet(state: UmpireStateModel) {
    return state.secondSet;
  }

  @Selector()
  static thirdSet(state: UmpireStateModel) {
    return state.thirdSet;
  }

  @Selector()
  static justPlayedPoint(state: UmpireStateModel) {
    return state.justPlayedPoint;
  }

  @Selector()
  static isEndOfGame(state: UmpireStateModel) {
    return state.isEndOfGame;
  }

  @Selector()
  static isEndOfFirstSet(state: UmpireStateModel) {
    return state.isEndOfFirstSet;
  }

  @Selector()
  static isEndOfSecondSet(state: UmpireStateModel) {
    return state.isEndOfSecondSet;
  }

  @Selector()
  static setIndexToShow(state: UmpireStateModel) {
    return state.setIndexToShow;
  }

  @Action(UmpireActions.GetContests)
  getContests(state: StateContext<UmpireStateModel>) {
    return this.umpireService.getContests().pipe(
      map((readContests: IContest[]) => {
        // Les séries sont un cumul des séries de chaque compétition du jour
        const categories: ICategory[] = [];
        readContests.forEach((contest) => {
          contest.categories.forEach((category) => {
            const categoryWithFullName: ICategory = {
              ...category,
              contestShortName: contest.shortName,
            };
            categories.push(categoryWithFullName);
          });
        });
        state.patchState({
          contests: <IContest[]>readContests,
          categories,
        });
      }),
    );
  }

  @Action(UmpireActions.GetPlayers)
  getPlayers(
    state: StateContext<UmpireStateModel>,
    action: UmpireActions.GetPlayers,
  ) {
    return this.playerService.getPairs(action.categoryId).pipe(
      tap((readPlayers: IPair[]) => {
        state.patchState({
          players: <IPair[]>readPlayers,
        });
      }),
    );
  }

  @Action(UmpireActions.InitMatch)
  initMatch(
    state: StateContext<UmpireStateModel>,
    action: UmpireActions.InitMatch,
  ) {
    // Création du premier point depuis les informations de lancement du match
    const point: IPoint = {
      pointLeftPair: 0,
      pointRightPair: 0,
      playerPositionLeftPair: action.firstPoint.playerPositionLeftPair,
      playerPositionRightPair: action.firstPoint.playerPositionRightPair,
      serverSide: action.firstPoint.serverSide,
    } as IPoint;

    state.patchState({
      firstSet: {
        setId: FIRST_SET_ID,
        points: [point],
      },
      secondSet: undefined,
      thirdSet: undefined,
      currentPointIndex: 0,
      lastPoint: point,
      justPlayedPoint: point,
      isEndOfGame: false,
      isEndOfFirstSet: undefined,
    });

    state.patchState({ currentSet: state.getState().firstSet });
  }

  @Action(UmpireActions.InitSet)
  initSet(
    state: StateContext<UmpireStateModel>,
    action: UmpireActions.InitSet,
  ) {
    const currentState = state.getState();

    // Création du premier point depuis les informations de lancement du set
    const point: IPoint = {
      pointLeftPair: 0,
      pointRightPair: 0,
      playerPositionLeftPair: action.firstPoint.playerPositionLeftPair,
      playerPositionRightPair: action.firstPoint.playerPositionRightPair,
      serverSide: action.firstPoint.serverSide,
    } as IPoint;

    if (currentState.currentSet.setId === FIRST_SET_ID) {
      state.patchState({
        secondSet: {
          setId: SECOND_SET_ID,
          points: [point],
        },
        setIndexToShow: 1,
      });
      state.patchState({
        currentSet: state.getState().secondSet,
      });
    } else {
      state.patchState({
        thirdSet: {
          setId: THIRD_SET_ID,
          points: [point],
        },
        setIndexToShow: 2,
      });
      state.patchState({
        currentSet: state.getState().thirdSet,
      });
    }

    state.patchState({
      currentPointIndex: 0,
      lastPoint: point,
      justPlayedPoint: point,
    });
  }

  @Action(UmpireActions.AddPoint)
  addPoint(
    state: StateContext<UmpireStateModel>,
    action: UmpireActions.AddPoint,
  ) {
    const currentState = state.getState();
    const currentSet = currentState.currentSet;
    const currentPointIndex = currentState.currentPointIndex;
    const lastPoint = currentState.lastPoint;

    if (lastPoint) {
      const justPlayedPoint: IPoint = this.getNextPoint(
        currentSet,
        lastPoint,
        action.isPointWinnerOnLeftSide,
      );

      if (currentSet !== null) {
        currentSet.points.push(justPlayedPoint);

        switch (currentSet.setId) {
          case FIRST_SET_ID:
            state.patchState({
              firstSet: {
                setId: FIRST_SET_ID,
                points: currentSet.points,
              },
            });
            break;
          case SECOND_SET_ID:
            state.patchState({
              secondSet: { setId: SECOND_SET_ID, points: currentSet.points },
            });
            break;
          case THIRD_SET_ID:
            state.patchState({
              thirdSet: { setId: THIRD_SET_ID, points: currentSet.points },
            });
            break;
        }

        state.patchState({
          currentPointIndex: currentPointIndex + 1,
          currentSet,
          justPlayedPoint,
          lastPoint: justPlayedPoint,
        });

        // On regarde si c'est la fin du set
        if (this.isEndOfSet(justPlayedPoint)) {
          switch (currentSet.setId) {
            case FIRST_SET_ID:
              state.patchState({
                isEndOfFirstSet: {
                  isPointWinnerOnLeftSide: action.isPointWinnerOnLeftSide,
                },
                firstSetAliasPairWinner: this.getFirstSetPairAliasWinner(
                  action.isPointWinnerOnLeftSide,
                ),
              });
              break;
            case SECOND_SET_ID:
              // La détection de la fin du match prime sur la détection de la fin du deuxième set
              if (this.isEndOfMatch(state, action.isPointWinnerOnLeftSide)) {
                console.log('Fin du match suite à la victoire 2 à 0');
              } else {
                state.patchState({
                  isEndOfSecondSet: {
                    isPointWinnerOnLeftSide: action.isPointWinnerOnLeftSide,
                  },
                });
              }
              break;
            case THIRD_SET_ID:
              break;
          }
        }
      }
    }
  }

  @Action(UmpireActions.GoBackToPoint)
  goBackToPoint(
    state: StateContext<UmpireStateModel>,
    action: UmpireActions.GoBackToPoint,
  ) {
    const currentState = state.getState();
    const currentSet = currentState.currentSet;
    const pointToGoBack = this.getPointFromCurrentSet(state, action.pointIndex);

    if (pointToGoBack) {
      // Remise à zéro des points du set qui se trouvent après le point dont l'index est passé en paramètre
      // Remise à zéro des points du ou des sets suivants si c'est le cas

      currentSet.points = currentSet.points.slice(0, action.pointIndex + 1);

      switch (currentSet.setId) {
        case FIRST_SET_ID:
          state.patchState({
            firstSet: {
              setId: FIRST_SET_ID,
              points: currentSet.points,
            },
            secondSet: undefined,
            thirdSet: undefined,
            isEndOfFirstSet: undefined,
          });
          break;
        case SECOND_SET_ID:
          state.patchState({
            secondSet: {
              setId: SECOND_SET_ID,
              points: currentSet.points,
            },
            thirdSet: undefined,
            isEndOfSecondSet: undefined,
          });
          break;
        case THIRD_SET_ID:
          state.patchState({
            thirdSet: {
              setId: THIRD_SET_ID,
              points: currentSet.points,
            },
          });
          break;
      }

      state.patchState({
        currentSet,
        currentPointIndex: action.pointIndex,
        justPlayedPoint: pointToGoBack,
        lastPoint: pointToGoBack,
      });
    }
  }

  private getNextPoint(
    currentSet: ISet,
    lastPoint: IPoint,
    isLeftSide: boolean,
  ): IPoint {
    // Détection de la permutation des équipes dans le dernier set
    if (
      currentSet.setId === THIRD_SET_ID &&
      (lastPoint.pointLeftPair === SWITCH_SCORE - 1 ||
        lastPoint.pointRightPair === SWITCH_SCORE - 1)
    ) {
      return this.getNextPointSwitchLastSet(lastPoint, isLeftSide);
    }

    let justPlayedPoint: IPoint = {} as IPoint;
    if (isLeftSide) {
      // Equipe qui a marqué est à gauche
      // Si c'était déjà l'équipe de gauche qui avait le service
      if (lastPoint.serverSide === SERVER_SIDE.LEFT) {
        // On inverse les joueurs
        justPlayedPoint.playerPositionLeftPair = this.revertPlayerPosition(
          lastPoint.playerPositionLeftPair,
        );
        justPlayedPoint.playerPositionRightPair =
          lastPoint.playerPositionRightPair;
        justPlayedPoint.pointLeftPair = lastPoint.pointLeftPair + 1;
        justPlayedPoint.pointRightPair = lastPoint.pointRightPair;
        justPlayedPoint.serverSide = lastPoint.serverSide;
      } else {
        // C'est l'équipe de droite qui avait le service
        justPlayedPoint.playerPositionLeftPair =
          lastPoint.playerPositionLeftPair;
        justPlayedPoint.playerPositionRightPair =
          lastPoint.playerPositionRightPair;
        justPlayedPoint.pointLeftPair = lastPoint.pointLeftPair + 1;
        justPlayedPoint.pointRightPair = lastPoint.pointRightPair;
        justPlayedPoint.serverSide = SERVER_SIDE.LEFT;
      }
    } else {
      // Equipe qui a marqué est à droite
      // Si c'était déjà l'équipe de droite qui avait le service
      if (lastPoint.serverSide === SERVER_SIDE.RIGHT) {
        // On inverse les joueurs
        justPlayedPoint.playerPositionRightPair = this.revertPlayerPosition(
          lastPoint.playerPositionRightPair,
        );
        justPlayedPoint.playerPositionLeftPair =
          lastPoint.playerPositionLeftPair;
        justPlayedPoint.pointRightPair = lastPoint.pointRightPair + 1;
        justPlayedPoint.pointLeftPair = lastPoint.pointLeftPair;
        justPlayedPoint.serverSide = lastPoint.serverSide;
      } else {
        // C'est l'équipe de gauche qui avait le service
        justPlayedPoint.playerPositionRightPair =
          lastPoint.playerPositionRightPair;
        justPlayedPoint.playerPositionLeftPair =
          lastPoint.playerPositionLeftPair;
        justPlayedPoint.pointRightPair = lastPoint.pointRightPair + 1;
        justPlayedPoint.pointLeftPair = lastPoint.pointLeftPair;
        justPlayedPoint.serverSide = SERVER_SIDE.RIGHT;
      }
    }

    return justPlayedPoint;
  }

  private getPointFromCurrentSet(
    state: StateContext<UmpireStateModel>,
    pointIndex: number,
  ): IPoint {
    return state.getState().currentSet.points[pointIndex];
  }

  private getNextPointSwitchLastSet(
    lastPoint: IPoint,
    isLeftSide: boolean,
  ): IPoint {
    if (isLeftSide) {
      // Equipe à gauche vient de marquer et va avoir le nombre de points de la pause
      const newPlayerPositionLeftPair: IPlayerPosition = {
        playerLeft: lastPoint.playerPositionRightPair.playerLeft,
        playerRight: lastPoint.playerPositionRightPair.playerRight,
      };

      const newPlayerPositionRightPair: IPlayerPosition = {
        playerLeft: lastPoint.playerPositionLeftPair.playerRight,
        playerRight: lastPoint.playerPositionLeftPair.playerLeft,
      };

      const newScoreLeftPair = lastPoint.pointRightPair;
      const newScoreRightPair = lastPoint.pointLeftPair + 1;

      return {
        playerPositionLeftPair: newPlayerPositionLeftPair,
        playerPositionRightPair: newPlayerPositionRightPair,
        pointLeftPair: newScoreLeftPair,
        pointRightPair: newScoreRightPair,
        serverSide: SERVER_SIDE.LEFT,
      } as IPoint;
    } else {
      // Equipe à droite vient de marquer et va avoir le nombre de points de la pause
      const newPlayerPositionLeftPair: IPlayerPosition = {
        playerLeft: lastPoint.playerPositionRightPair.playerRight,
        playerRight: lastPoint.playerPositionRightPair.playerLeft,
      };

      const newPlayerPositionRightPair: IPlayerPosition = {
        playerLeft: lastPoint.playerPositionLeftPair.playerLeft,
        playerRight: lastPoint.playerPositionLeftPair.playerRight,
      };

      const newScoreLeftPair = lastPoint.pointRightPair + 1;
      const newScoreRightPair = lastPoint.pointLeftPair;

      return {
        playerPositionLeftPair: newPlayerPositionLeftPair,
        playerPositionRightPair: newPlayerPositionRightPair,
        pointLeftPair: newScoreLeftPair,
        pointRightPair: newScoreRightPair,
        serverSide: SERVER_SIDE.LEFT,
      } as IPoint;
    }
  }

  private revertPlayerPosition(
    playerPosition: IPlayerPosition,
  ): IPlayerPosition {
    const newPlayerOnLeft = playerPosition.playerRight;
    const newPlayerOnRight = playerPosition.playerLeft;

    return {
      playerLeft: newPlayerOnLeft,
      playerRight: newPlayerOnRight,
    };
  }

  private isEndOfMatch(
    state: StateContext<UmpireStateModel>,
    isPointWinnerOnLeftSide: boolean,
  ): boolean {
    // Uniquement appelée à la fin du deuxième set
    if (
      state.getState().firstSetAliasPairWinner ===
      this.getSecondSetPairAliasWinner(isPointWinnerOnLeftSide)
    ) {
      return true;
    }

    return false;
  }

  private isEndOfSet(justPlayedPoint: IPoint): boolean {
    if (justPlayedPoint.serverSide === SERVER_SIDE.LEFT) {
      // Equipe à gauche qui vient de marquer
      if (
        justPlayedPoint.pointLeftPair === MAX_END_OF_SET_SCORE ||
        (justPlayedPoint.pointLeftPair >= END_OF_SET_SCORE &&
          justPlayedPoint.pointLeftPair - justPlayedPoint.pointRightPair >= 2)
      ) {
        return true;
      }

      return false;
    } else {
      // Equipe à droite qui vient de marquer
      if (
        justPlayedPoint.pointRightPair === MAX_END_OF_SET_SCORE ||
        (justPlayedPoint.pointRightPair >= END_OF_SET_SCORE &&
          justPlayedPoint.pointRightPair - justPlayedPoint.pointLeftPair >= 2)
      ) {
        return true;
      }

      return false;
    }
  }

  private getFirstSetPairAliasWinner(
    isPointWinnerOnLeftSide: boolean,
  ): PAIR_ALIAS {
    if (isPointWinnerOnLeftSide) {
      return this.playerOnCourtService.getFirstSetLeftPair() ===
        PAIR_ALIAS.ONE_TWO
        ? PAIR_ALIAS.ONE_TWO
        : PAIR_ALIAS.THREE_FOUR;
    } else {
      return this.playerOnCourtService.getFirstSetRightPair() ===
        PAIR_ALIAS.ONE_TWO
        ? PAIR_ALIAS.ONE_TWO
        : PAIR_ALIAS.THREE_FOUR;
    }
  }

  private getSecondSetPairAliasWinner(
    isPointWinnerOnLeftSide: boolean,
  ): PAIR_ALIAS {
    if (isPointWinnerOnLeftSide) {
      return this.playerOnCourtService.getSecondSetLeftPair() ===
        PAIR_ALIAS.ONE_TWO
        ? PAIR_ALIAS.ONE_TWO
        : PAIR_ALIAS.THREE_FOUR;
    } else {
      return this.playerOnCourtService.getSecondSetRightPair() ===
        PAIR_ALIAS.ONE_TWO
        ? PAIR_ALIAS.ONE_TWO
        : PAIR_ALIAS.THREE_FOUR;
    }
  }
}
