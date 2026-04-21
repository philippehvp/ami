import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Point } from '../point/point';
import { IMatch } from '../../models/match';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { UmpireState } from '../../store/state/umpire.state';
import { Store } from '@ngxs/store';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'history',
  imports: [AsyncPipe, MatTabsModule, Point],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History implements OnInit, OnDestroy {
  private readonly store: Store = inject(Store);

  public match$: Observable<IMatch>;

  private destroy$!: Subject<boolean>;

  constructor() {
    this.match$ = this.store.select(UmpireState.match);
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();
  }

  public ngOnDestroy() {
    if (this.destroy$) {
      this.destroy$.next(true);
    }
  }
}
