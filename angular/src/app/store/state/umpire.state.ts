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

export class UmpireStateModel {
  contest!: IContest;
  contests!: IContest[];
  categories!: ICategory[];
  category!: ICategory;
  players!: IPlayer[];
  match!: IMatch;
  currentSet!: number;
  currentPoint!: number;
  justPlayedPoint!: IPoint | undefined;
}

@State<UmpireStateModel>({
  name: 'bet',
  defaults: {
    contest: {} as IContest,
    contests: [],
    categories: [],
    category: {} as ICategory,
    players: [],
    match: {
      sets: [
        {
          id: 1,
          points: [],
        },
        {
          id: 2,
          points: [],
        },
        {
          id: 3,
          points: [],
        },
      ],
    } as IMatch,
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
  static contest(state: UmpireStateModel) {
    return state.contest;
  }

  @Selector()
  static contests(state: UmpireStateModel) {
    return state.contests;
  }

  @Selector()
  static category(state: UmpireStateModel) {
    return state.category;
  }

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

  @Action(UmpireActions.SetCategory)
  setCategory(
    state: StateContext<UmpireStateModel>,
    action: UmpireActions.SetCategory,
  ) {
    const currentState = state.getState();

    if (currentState.category?.id !== action.categoryId) {
      return currentState.contests?.map((contest) => {
        contest.categories?.map((category) => {
          if (category.id === action.categoryId) {
            state.patchState({ category, contest });
          }
        });
      });
    } else {
      return;
    }
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

    const match: IMatch = {
      sets: [
        {
          id: 1,
          points: [point],
        },
        {
          id: 2,
          points: [],
        },
        {
          id: 3,
          points: [],
        },
      ],
    };

    state.patchState({
      match,
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
    const currentMatch = currentState.match;
    const currentSet = currentState.currentSet;
    const currentPoint = currentState.currentPoint;

    const lastPoint: IPoint =
      currentMatch.sets[currentSet].points[currentPoint];

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

    currentMatch.sets[currentSet].points[currentPoint + 1] = justPlayedPoint;

    state.patchState({
      match: currentMatch,
      currentPoint: currentPoint + 1,
      justPlayedPoint: justPlayedPoint,
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
