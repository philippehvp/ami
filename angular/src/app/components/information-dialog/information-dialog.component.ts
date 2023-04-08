import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss'],
})
export class InformationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; message: string },
    private dialogRef: MatDialogRef<InformationDialogComponent>
  ) {}

  public cancel() {
    this.dialogRef.close();
  }
}
