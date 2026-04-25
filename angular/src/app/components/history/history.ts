import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Points } from '../points/points';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { UmpireState } from '../../store/state/umpire.state';
import { Store } from '@ngxs/store';
import { AsyncPipe } from '@angular/common';
import { ISet } from '../../models/set';

@Component({
  selector: 'history',
  imports: [AsyncPipe, MatTabsModule, Points],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History implements OnInit, OnDestroy {
  private readonly store: Store = inject(Store);

  public firstSet$: Observable<ISet>;
  public secondSet$: Observable<ISet>;
  public thirdSet$: Observable<ISet>;
  public setIndexToShow$: Observable<number>;
  public selectedIndex: number = 0;

  private destroy$!: Subject<boolean>;

  constructor() {
    this.firstSet$ = this.store.select(UmpireState.firstSet);
    this.secondSet$ = this.store.select(UmpireState.secondSet);
    this.thirdSet$ = this.store.select(UmpireState.thirdSet);
    this.setIndexToShow$ = this.store.select(UmpireState.setIndexToShow);
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    this.setIndexToShow$
      .pipe(
        takeUntil(this.destroy$),
        map((setIndexToShow) => {
          if (setIndexToShow === 1 || setIndexToShow === 2) {
            this.selectedIndex = setIndexToShow;
          }
        }),
      )
      .subscribe();
  }

  public ngOnDestroy() {
    if (this.destroy$) {
      this.destroy$.next(true);
    }
  }

  public isSetHasPoint(set: ISet): boolean {
    return set.points && set.points.length > 0;
  }
}
