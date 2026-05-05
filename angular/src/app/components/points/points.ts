import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { IPoint } from '../../models/point';
import { ISet } from '../../models/set';
import { UtilsService } from '../../services/utils.service';
import { filter, map, Observable, of, Subject, takeUntil } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import { CourtLeftRight } from '../court-left-right/court-left-right';
import { Store } from '@ngxs/store';
import { MatButtonModule } from '@angular/material/button';
import { UmpireActions } from '../../store/action/umpire.action';

import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { Confirmation } from '../confirmation/confirmation';

@Component({
  selector: 'points',
  imports: [AsyncPipe, CourtLeftRight, MatButtonModule, MatBottomSheetModule],
  templateUrl: './points.html',
  styleUrl: './points.scss',
})
export class Points implements OnInit, OnDestroy {
  private readonly store: Store = inject(Store);

  @Input()
  set$!: Observable<ISet>;

  public points$: Observable<IPoint[]>;

  public pointToShow: IPoint | undefined = undefined;
  public pointIndex: number | undefined = undefined;

  public cells!: IPoint[];

  private destroy$!: Subject<boolean>;

  private goBackToConfirmation = inject(MatBottomSheet);

  constructor() {
    this.points$ = of();
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    // Création des cases pour affichage
    this.cells = [];
    for (let i: number = 0; i < 60; i++) {
      this.cells.push({} as IPoint);
    }

    this.set$
      .pipe(
        takeUntil(this.destroy$),
        filter((set) => !!set),
        map((set) => {
          this.points$ = of(set.points);
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

  public showPoint(set: ISet, points: IPoint[], pointIndex: number) {
    // On considère que l'on veut revenir à ce point si on clique à nouveau dessus
    if (this.pointIndex === pointIndex) {
      this.goBackToConfirmation
        .open(Confirmation)
        .afterDismissed()
        .subscribe((isGoBackConfirmation: boolean) => {
          if (isGoBackConfirmation) {
            this.goBackToPoint(set);
          }
        });
    } else {
      if (points && pointIndex < points.length) {
        this.pointToShow = points[pointIndex];
        this.pointIndex = pointIndex;
      }
    }
  }

  public displayScore(point: IPoint): string {
    return `${point.pointLeftPair} - ${point.pointRightPair}`;
  }

  public cellHasPoint(points: IPoint[], index: number): boolean {
    return index < points.length;
  }

  public goBackToPoint(set: ISet) {
    this.store.dispatch(
      new UmpireActions.GoBackToPoint(set.setId, this.pointIndex),
    );
  }
}
