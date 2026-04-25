import { AfterViewInit, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

export interface ILogo {
  icon: string;
  label: string;
  isLightAndDark: boolean;
  class: string;
  link?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, MatToolbarModule],
})
export class AppComponent implements AfterViewInit {
  constructor() {}

  public ngAfterViewInit() {}
}
