import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-gdpr',
  templateUrl: './gdpr.component.html',
  styleUrls: ['./gdpr.component.scss'],
})
export class GdprComponent {
  private matDialogRef = inject(MatDialogRef<GdprComponent>);

  public isCloseButtonDisabled: boolean = false;

  public close() {
    this.matDialogRef.close();
  }
}
