import { Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-gdpr',
  templateUrl: './gdpr.component.html',
  styleUrls: ['./gdpr.component.scss'],
})
export class GdprComponent {
  private bottomSheetRef = inject(MatBottomSheetRef<GdprComponent>);

  public close() {
    this.bottomSheetRef.dismiss();
  }
}
