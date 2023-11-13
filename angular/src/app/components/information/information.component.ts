import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from 'src/app/models/information-dialog-type';

@Component({
  selector: 'information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
})
export class InformationComponent {
  public data: IInformationDialogConfig = inject(MAT_DIALOG_DATA);
  private matDialogRef = inject(MatDialogRef<InformationComponent>);

  public get isInformationType(): boolean {
    return this.data.dialogType === InformationDialogType.Information;
  }

  public get firstButtonLabel(): string {
    return this.data.labels[0];
  }

  public get secondButtonLabel(): string {
    return this.data.labels[1];
  }

  public close() {
    this.matDialogRef.close();
  }

  public validate() {
    this.matDialogRef.close(true);
  }

  public cancel() {
    this.matDialogRef.close(false);
  }
}
