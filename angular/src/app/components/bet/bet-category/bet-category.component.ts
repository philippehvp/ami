import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { ICategory } from 'src/app/models/category';
import { IContest } from 'src/app/models/contest';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'bet-category',
  templateUrl: './bet-category.component.html',
  styleUrls: ['./bet-category.component.scss'],
})
export class BetCategoryComponent {
  @Select(BetState.category)
  category$!: Observable<ICategory>;

  @Select(BetState.contest)
  contest$!: Observable<IContest>;
}
