import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { ICategory } from 'src/app/models/category';
import { IContest } from 'src/app/models/contest';
import { UtilsService } from 'src/app/services/utils.service';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.scss']
})
export class BetComponent {
  @Select(BetState.category)
  category$: Observable<ICategory> | undefined;

  @Select(BetState.contest)
  contest$: Observable<IContest> | undefined;

  public get tab(): number {
    return UtilsService.isFocusedOnWinner() ? 0 : 1;
  }

  public set tab(selectedIndex: number) {
    if (selectedIndex == 0) {
      UtilsService.focusWinner();
    } else {
      UtilsService.focusRunnerUp();
    }
  }

  public get isWinnerPanelFocused(): boolean {
    return UtilsService.isFocusedOnWinner();
  }

  public set isWinnerPanelFocused(isWinnerPanelFocused: boolean) {
    if (isWinnerPanelFocused) {
      UtilsService.focusWinner();
    } else {
      UtilsService.focusRunnerUp();
    }
  }

  constructor() {}
}

