import { Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: 'confirmation.html',
  imports: [MatListModule],
})
export class Confirmation {
  private _bottomSheetRef =
    inject<MatBottomSheetRef<Confirmation>>(MatBottomSheetRef);

  public cancel() {
    this._bottomSheetRef.dismiss(false);
  }

  public validate() {
    this._bottomSheetRef.dismiss(true);
  }
}
