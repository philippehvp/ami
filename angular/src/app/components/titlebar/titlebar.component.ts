import { Location } from '@angular/common';
import { Component, Input, inject } from '@angular/core';

@Component({
  selector: 'titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss'],
})
export class TitlebarComponent {
  private location = inject(Location);

  @Input()
  title!: string;

  public back() {
    this.location.back();
  }
}
