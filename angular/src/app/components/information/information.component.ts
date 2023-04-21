import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
})
export class InformationComponent {
  private dialogRef = inject(MatDialogRef<InformationComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; message: string }
  ) {}

  public close() {
    this.dialogRef.close();
  }
}
