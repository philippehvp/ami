import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'bet-summary',
  templateUrl: './bet-summary.component.html',
  styleUrls: ['./bet-summary.component.scss']
})
export class BetSummaryComponent {
  @Select(BetState.winner)
  winner$: Observable<string> | undefined;

  @Select(BetState.runnerUp)
  runnerUp$: Observable<string> | undefined;

  constructor() {}

}
