import { Component, inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from '../../models/information-dialog-type';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
  ],
})
export class InformationComponent {
  public data: IInformationDialogConfig = inject(MAT_DIALOG_DATA);
  private matDialogRef = inject(MatDialogRef<InformationComponent>);

  public get isInformationType(): boolean {
    return this.data.dialogType === InformationDialogType.Information;
  }

  public get firstButtonLabel(): string {
    if (this.data.labels && this.data.labels.length) return this.data.labels[0];

    return '';
  }

  public get secondButtonLabel(): string {
    if (this.data.labels && this.data.labels.length > 1)
      return this.data.labels[1];

    return '';
  }

  public validate() {
    this.matDialogRef.close(true);
  }
}
