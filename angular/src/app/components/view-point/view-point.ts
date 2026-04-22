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

@Component({
  selector: 'app-view-point',
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    Court,
  ],
  templateUrl: './view-point.html',
  styleUrl: './view-point.scss',
})
export class ViewPoint {
  private readonly store: Store = inject(Store);

  public data: { justPlayedPoint: IPoint; pointIndex: number } =
    inject(MAT_DIALOG_DATA);

  private matDialogRef = inject(MatDialogRef);

  public goBackToPoint() {
    this.store.dispatch(new UmpireActions.GoBackToPoint(this.data.pointIndex));
    this.matDialogRef.close();
  }
}
