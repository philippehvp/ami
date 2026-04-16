import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IBetter } from '../../../models/better';
import { IBetterPoint } from '../../../models/better-point';
import { BetActions } from '../../../store/action/bet.action';
import { BetState } from '../../../store/state/bet.state';
import { AsyncPipe } from '@angular/common';
import { TitlebarComponent } from '../../titlebar/titlebar.component';
import {
  MatCellDef,
  MatHeaderCellDef,
  MatHeaderRowDef,
  MatRowDef,
  MatTable,
} from '@angular/material/table';

@Component({
  selector: 'bet-point',
  templateUrl: './bet-point.component.html',
  styleUrls: ['./bet-point.component.scss'],
  imports: [
    AsyncPipe,
    TitlebarComponent,
    MatTable,
    MatRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
  ],
})
export class BetPointComponent implements OnInit, OnDestroy {
  public betterPoints$!: Observable<IBetterPoint[]>;
  public better$!: Observable<IBetter>;

  public displayedColumns: string[] = ['better', 'points'];

  constructor(private readonly store: Store) {
    this.betterPoints$ = this.store.select(BetState.betterPoints);
    this.better$ = this.store.select(BetState.better);
  }

  public ngOnInit() {
    this.store.dispatch([new BetActions.CalculatePointsAndRanking()]);
  }

  public ngOnDestroy() {}
}
