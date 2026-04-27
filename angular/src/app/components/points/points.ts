import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { IPoint } from '../../models/point';
import { ISet } from '../../models/set';
import { UtilsService } from '../../services/utils.service';
import { map, Observable, of, Subject, takeUntil } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewPoint } from '../view-point/view-point';

@Component({
  selector: 'point',
  imports: [AsyncPipe],
  templateUrl: './points.html',
  styleUrl: './points.scss',
})
export class Points implements OnInit, OnDestroy {
  @Input()
  set$!: Observable<ISet>;

  private readonly dialog: MatDialog = inject(MatDialog);

  public points$: Observable<IPoint[]>;

  public cells!: IPoint[];

  private destroy$!: Subject<boolean>;

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

  public showPoint(points: IPoint[], pointIndex: number) {
    if (points) {
      const config: MatDialogConfig<{
        points: IPoint[];
        pointIndex: number;
      }> = {
        data: {
          points: points,
          pointIndex,
        },
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
      };
      this.dialog.open(ViewPoint, config).afterClosed().subscribe();
    }
  }

  public displayScore(point: IPoint): string {
    return `${point.pointLeftPair} - ${point.pointRightPair}`;
  }
}
