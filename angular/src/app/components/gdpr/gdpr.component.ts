import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'gdpr',
  templateUrl: './gdpr.component.html',
  styleUrls: ['./gdpr.component.scss'],
})
export class GdprComponent {
  private matDialogRef = inject(MatDialogRef<GdprComponent>);

  public isCloseButtonDisabled: boolean = false;

  public scrollToEndOfGDPRContent: boolean = false;

  public close() {
    this.matDialogRef.close();
  }

  public onScroll($event: Event) {
    const element = $event.target as HTMLElement;
    if (element.offsetHeight + element.scrollTop >= element.scrollHeight) {
      this.scrollToEndOfGDPRContent = true;
    }
  }
}
