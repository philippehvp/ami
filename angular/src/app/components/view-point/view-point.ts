import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { IPoint } from '../../models/point';
import { Court } from '../court/court';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngxs/store';
import { UmpireActions } from '../../store/action/umpire.action';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'view-point',
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    Court,
    MatIconModule,
  ],
  templateUrl: './view-point.html',
  styleUrl: './view-point.scss',
})
export class ViewPoint {
  private readonly store: Store = inject(Store);

  public currentShowedPoint!: IPoint;
  public currentShowedPointIndex!: number;

  public data: { points: IPoint[]; pointIndex: number } =
    inject(MAT_DIALOG_DATA);

  private matDialogRef = inject(MatDialogRef);

  public goBackToPoint() {
    this.store.dispatch(
      new UmpireActions.GoBackToPoint(this.currentShowedPointIndex),
    );
    this.matDialogRef.close();
  }

  public showNextPoint() {
    if (this.currentShowedPointIndex < this.data.points.length - 1) {
      this.currentShowedPoint =
        this.data.points[++this.currentShowedPointIndex];
    }
  }

  public showPreviousPoint() {
    if (this.currentShowedPointIndex > 0) {
      this.currentShowedPoint =
        this.data.points[--this.currentShowedPointIndex];
    }
  }

  constructor() {
    this.currentShowedPointIndex = this.data.pointIndex;
    this.currentShowedPoint = this.data.points[this.currentShowedPointIndex];

    this.matDialogRef.updateSize('auto', 'auto');
  }
}
