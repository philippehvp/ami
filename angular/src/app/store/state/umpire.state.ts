import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { UmpireActions } from '../action/umpire.action';
import { UmpireService } from '../../services/rest/umpire.service';
import { IContest } from '../../models/contest';
import { ICategory } from '../../models/category';
import { IPlayer } from '../../models/player';
import { PlayerService } from '../../services/rest/player.service';

export class UmpireStateModel {
  contest!: IContest;
  contests!: IContest[];
  categories!: ICategory[];
  category!: ICategory;
  players!: IPlayer[];
  player1!: IPlayer;
  player2!: IPlayer;
  categoryToDisplay!: number;
}

@State<UmpireStateModel>({
  name: 'bet',
  defaults: {
    contest: {} as IContest,
    contests: [],
    categories: [],
    category: {} as ICategory,
    players: [],
    player1: {} as IPlayer,
    player2: {} as IPlayer,
    categoryToDisplay: -1,
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
  static player1(state: UmpireStateModel) {
    return state.player1;
  }

  @Selector()
  static player2(state: UmpireStateModel) {
    return state.player2;
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
}
