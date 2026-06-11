import { Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'confirmation',
  templateUrl: 'confirmation.html',
  imports: [MatListModule, MatButtonModule],
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
