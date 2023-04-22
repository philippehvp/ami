import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from 'src/app/models/information-type';

@Component({
  selector: 'information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
})
export class InformationComponent {
  private dialogRef = inject(MatDialogRef<InformationComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: IInformationDialogConfig
  ) {}

  public get isInformationType(): boolean {
    return this.data.dialogType === InformationDialogType.Information;
  }

  public close() {
    this.dialogRef.close();
  }

  public validate() {
    this.dialogRef.close(true);
  }

  public cancel() {
    this.dialogRef.close(false);
  }
}
