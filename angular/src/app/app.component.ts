import { AfterViewInit, Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Selection } from './components/selection/selection';

import { Observable } from 'rxjs';
import { ISet } from './models/set';
import { Store } from '@ngxs/store';
import { UmpireState } from './store/state/umpire.state';
import { Live } from './components/live/live';
import { Points } from './components/points/points';
import { MatTabsModule } from '@angular/material/tabs';
import { MatchService } from './services/match.service';
import { Footer } from './components/footer/footer';

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
  imports: [
    RouterModule,
    MatToolbarModule,
    MatTabsModule,
    Selection,
    Live,
    Points,
    Footer,
  ],
})
export class AppComponent implements AfterViewInit {
  private readonly store: Store = inject(Store);
  private readonly matchService: MatchService = inject(MatchService);

  public firstSet$: Observable<ISet>;
  public secondSet$: Observable<ISet>;
  public thirdSet$: Observable<ISet>;

  constructor() {
    this.firstSet$ = this.store.select(UmpireState.firstSet);
    this.secondSet$ = this.store.select(UmpireState.secondSet);
    this.thirdSet$ = this.store.select(UmpireState.thirdSet);
  }

  public get isMatchLaunched(): boolean {
    return this.matchService.isMatchLaunched;
  }

  public ngAfterViewInit() {}
}
