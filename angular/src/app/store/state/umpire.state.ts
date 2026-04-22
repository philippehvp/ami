import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { UmpireActions } from '../action/umpire.action';
import { UmpireService } from '../../services/rest/umpire.service';
import { IContest } from '../../models/contest';
import { ICategory } from '../../models/category';
import { IPlayer } from '../../models/player';
import { PlayerService } from '../../services/rest/player.service';
import { IMatch } from '../../models/match';
import { IPoint, SERVER_SIDE } from '../../models/point';
import { IPlayerPosition } from '../../models/player-position';
import { ISet } from '../../models/set';

export class UmpireStateModel {
  contests!: IContest[];
  categories!: ICategory[];
  players!: IPlayer[];
  match!: IMatch;
  firstSet!: ISet;
  secondSet!: ISet;
  thirdSet!: ISet;
  currentSet!: number;
  currentPoint!: number;

  justPlayedPoint!: IPoint | undefined;
}

@State<UmpireStateModel>({
  name: 'bet',
  defaults: {
    contests: [],
    categories: [],

    players: [],
    match: {
      sets: [{}, {}, {}],
    } as IMatch,
    firstSet: {} as ISet,
    secondSet: {} as ISet,
    thirdSet: {} as ISet,
    currentSet: 0,
    currentPoint: 0,
    justPlayedPoint: undefined,
  },
})
@Injectable()
export class UmpireState {
  private umpireService = inject(UmpireService);
  private playerService = inject(PlayerService);

  @Selector()
  static categories(state: UmpireStateModel) {
    return state.categories;
  }

  @Selector()
  static players(state: UmpireStateModel) {
    return state.players;
  }

  @Selector()
  static match(state: UmpireStateModel) {
    return state.match;
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
    return this.playerService.getPlayers(action.categoryId).pipe(
      tap((readPlayers: IPlayer[]) => {
        state.patchState({
          players: <IPlayer[]>readPlayers,
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
      pointTeamLeft: 0,
      pointTeamRight: 0,
      playerPositionLeftTeam: action.firstPoint.playerPositionLeftTeam,
      playerPositionRightTeam: action.firstPoint.playerPositionRightTeam,
      serverSide: action.firstPoint.serverSide,
    } as IPoint;

    const firstSet: ISet = {
      points: [point],
    };

    const secondSet: ISet = { points: [] };
    const thirdSet: ISet = { points: [] };

    const match: IMatch = {
      sets: [firstSet, secondSet, thirdSet],
    };

    state.patchState({
      match,
      firstSet,
      secondSet,
      thirdSet,
      currentSet: 0,
      currentPoint: 0,
      justPlayedPoint: point,
    });
  }

  @Action(UmpireActions.AddPoint)
  addPoint(
    state: StateContext<UmpireStateModel>,
    action: UmpireActions.AddPoint,
  ) {
    const currentState = state.getState();
    const match = currentState.match;
    const currentSet = currentState.currentSet;
    const currentPoint = currentState.currentPoint;

    const lastPoint: IPoint = match.sets[currentSet].points[currentPoint];

    let justPlayedPoint: IPoint = {} as IPoint;

    if (action.isLeftSide) {
      // Equipe qui a marqué est à gauche
      // Si c'était déjà l'équipe de gauche qui avait le service
      if (lastPoint.serverSide === SERVER_SIDE.LEFT) {
        // On inverse les joueurs
        justPlayedPoint.playerPositionLeftTeam = this.revertPlayerPosition(
          lastPoint.playerPositionLeftTeam,
        );
        justPlayedPoint.playerPositionRightTeam =
          lastPoint.playerPositionRightTeam;
        justPlayedPoint.pointTeamLeft = lastPoint.pointTeamLeft + 1;
        justPlayedPoint.pointTeamRight = lastPoint.pointTeamRight;
        justPlayedPoint.serverSide = lastPoint.serverSide;
      } else {
        // C'est l'équipe de droite qui avait le service
        justPlayedPoint.playerPositionLeftTeam =
          lastPoint.playerPositionLeftTeam;
        justPlayedPoint.playerPositionRightTeam =
          lastPoint.playerPositionRightTeam;
        justPlayedPoint.pointTeamLeft = lastPoint.pointTeamLeft + 1;
        justPlayedPoint.pointTeamRight = lastPoint.pointTeamRight;
        justPlayedPoint.serverSide = SERVER_SIDE.LEFT;
      }
    } else {
      // Equipe qui a marqué est à droite
      // Si c'était déjà l'équipe de droite qui avait le service
      if (lastPoint.serverSide === SERVER_SIDE.RIGHT) {
        // On inverse les joueurs
        justPlayedPoint.playerPositionRightTeam = this.revertPlayerPosition(
          lastPoint.playerPositionRightTeam,
        );
        justPlayedPoint.playerPositionLeftTeam =
          lastPoint.playerPositionLeftTeam;
        justPlayedPoint.pointTeamRight = lastPoint.pointTeamRight + 1;
        justPlayedPoint.pointTeamLeft = lastPoint.pointTeamLeft;
        justPlayedPoint.serverSide = lastPoint.serverSide;
      } else {
        // C'est l'équipe de gauche qui avait le service
        justPlayedPoint.playerPositionRightTeam =
          lastPoint.playerPositionRightTeam;
        justPlayedPoint.playerPositionLeftTeam =
          lastPoint.playerPositionLeftTeam;
        justPlayedPoint.pointTeamRight = lastPoint.pointTeamRight + 1;
        justPlayedPoint.pointTeamLeft = lastPoint.pointTeamLeft;
        justPlayedPoint.serverSide = SERVER_SIDE.RIGHT;
      }
    }

    let setToUpdate: ISet = match.sets[currentSet];
    setToUpdate.points.push(justPlayedPoint);

    switch (currentSet) {
      case 0:
        state.patchState({
          firstSet: {
            points: setToUpdate.points,
          },
        });
        break;
      case 1:
        state.patchState({ secondSet: { points: setToUpdate.points } });
        break;
      case 2:
        state.patchState({ thirdSet: { points: setToUpdate.points } });
        break;
    }

    state.patchState({
      match,
      currentPoint: currentPoint + 1,
      justPlayedPoint,
    });
  }

  @Action(UmpireActions.GoBackToPoint)
  goBackToPoint(
    state: StateContext<UmpireStateModel>,
    action: UmpireActions.GoBackToPoint,
  ) {
    const currentState = state.getState();
    const match = currentState.match;
    const currentSet = currentState.currentSet;
    const justPlayedPoint = match.sets[currentSet].points[action.pointIndex];

    // Remise à zéro des points du set qui se trouvent après le point dont l'index est passé en paramètre
    // Remise à zéro des points du ou des sets suivants si c'est le cas

    switch (currentSet) {
      case 0:
        state.patchState({
          firstSet: {
            points: currentState.firstSet.points.slice(
              0,
              action.pointIndex + 1,
            ),
          },
          secondSet: { points: [] },
          thirdSet: { points: [] },
        });
        break;
      case 1:
        state.patchState({
          secondSet: {
            points: currentState.secondSet.points.slice(
              0,
              action.pointIndex + 1,
            ),
          },
          thirdSet: { points: [] },
        });
        break;
      case 2:
        state.patchState({
          thirdSet: {
            points: currentState.thirdSet.points.slice(
              0,
              action.pointIndex + 1,
            ),
          },
        });
        break;
    }

    state.patchState({
      match: {
        sets: [
          state.getState().firstSet,
          state.getState().secondSet,
          state.getState().thirdSet,
        ],
      },
      justPlayedPoint,
      currentPoint: action.pointIndex,
    });
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

  private checkEndOfMatch(state: StateContext<UmpireStateModel>): boolean {
    return false;
  }

  private checkEndOfSet(state: StateContext<UmpireStateModel>): boolean {
    return false;
  }
}
