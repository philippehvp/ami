import { Component, inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'gdpr',
  templateUrl: './gdpr.component.html',
  styleUrls: ['./gdpr.component.scss'],
  imports: [MatDialogContent, MatDialogActions, MatButtonModule, MatButton],
})
export class GdprComponent {
  private matDialogRef = inject(MatDialogRef<GdprComponent>);

  public close() {
    this.matDialogRef.close();
  }
}
