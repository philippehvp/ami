import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { IBetter } from 'src/app/models/better';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @Select(BetState.better)
  better$: Observable<IBetter> | undefined;

  constructor() {

  }

  public ngOnInit() {
  }

  public ngOnDestroy(): void {
  }

}
