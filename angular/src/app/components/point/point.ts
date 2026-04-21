import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { IPoint } from '../../models/point';
import { ISet } from '../../models/set';
import { UtilsService } from '../../services/utils.service';
import { Store } from '@ngxs/store';
import { map, Observable, of, Subject, takeUntil } from 'rxjs';
import { IMatch } from '../../models/match';
import { UmpireState } from '../../store/state/umpire.state';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'point',
  imports: [AsyncPipe],
  templateUrl: './point.html',
  styleUrl: './point.scss',
})
export class Point implements OnInit, OnDestroy {
  @Input()
  setId!: number;

  private readonly store: Store = inject(Store);

  public match$: Observable<IMatch>;

  public points$: Observable<IPoint[]>;

  public cells!: IPoint[];

  private destroy$!: Subject<boolean>;

  constructor() {
    this.match$ = this.store.select(UmpireState.match);
    this.points$ = of();
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    // Création des cases pour affichage
    this.cells = [];
    for (let i: number = 0; i < 60; i++) {
      this.cells.push({} as IPoint);
    }

    this.match$
      .pipe(
        takeUntil(this.destroy$),
        map((match) => {
          const set: ISet | undefined = match.sets.find((set) => {
            return set.id === this.setId;
          });

          if (set) {
            this.points$ = of(set.points);
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

  public isSet(obj: unknown): boolean {
    return UtilsService.isNotNullNorUndefined(obj);
  }
}
