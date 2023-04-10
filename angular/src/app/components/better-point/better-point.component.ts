import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IBetterPoint } from 'src/app/models/point';
import { PointState } from 'src/app/store/state/point.state';

@Component({
  selector: 'better-point',
  templateUrl: './better-point.component.html',
  styleUrls: ['./better-point.component.scss'],
})
export class BetterPointComponent {
  @Select(PointState.betterPoints)
  betterPoints$!: Observable<IBetterPoint[]>;

  public displayedColumns: string[];

  constructor(private dialogRef: MatDialogRef<BetterPointComponent>) {
    this.displayedColumns = ['better', 'points'];
  }

  public cancel() {
    this.dialogRef.close();
  }
}
