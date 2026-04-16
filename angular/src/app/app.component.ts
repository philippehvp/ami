import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { BetActions } from './store/action/bet.action';
import { BetState } from './store/state/bet.state';
import { Observable } from 'rxjs';
import { IBetter, ISettingRaw } from './models/better';
import { PersistenceService } from './services/persistence.service';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AboutComponent } from './components/about/about.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AsyncPipe } from '@angular/common';

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
    AsyncPipe,
    RouterModule,
    ToolbarComponent,
    AboutComponent,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatToolbarModule,
    SidenavComponent,
  ],
})
export class AppComponent implements AfterViewInit {
  private store = inject(Store);
  private persistenceService = inject(PersistenceService);

  public better$!: Observable<IBetter>;

  @ViewChild('sidenav') public sidenav!: MatSidenav;
  @ViewChild('aboutnav') public aboutnav!: MatSidenav;

  public get isToolbarVisible(): boolean {
    return this.persistenceService.isToolbarVisible;
  }

  constructor() {
    const better: string = window.localStorage.getItem('better') || '';
    const settings: string = window.localStorage.getItem('settings') || '';

    this.better$ = this.store.select(BetState.better);

    if (better) {
      const betterRestored: IBetter = JSON.parse(better);
      this.store.dispatch([new BetActions.SetBetter(betterRestored)]);

      if (settings) {
        const settingsRaw: ISettingRaw = JSON.parse(settings);
        this.persistenceService.restoreSettings(settingsRaw);
      }

      this.persistenceService.isEvaluationDone = betterRestored.evaluation > 0;

      if (betterRestored.endBetDate) {
        // Les données restaurées par cookies remontent des champs en chaîne de caractères
        if (new Date(betterRestored.endBetDate) < new Date()) {
          this.persistenceService.navigate('better-ranking1');
        } else {
          this.persistenceService.navigate('bet');
        }
      }
    } else {
      this.persistenceService.navigate('login');
    }
  }

  public ngAfterViewInit() {
    this.persistenceService.sidenav = this.sidenav;
    this.persistenceService.aboutnav = this.aboutnav;
  }

  public toggleSideMenu() {
    if (this.persistenceService.sidenav) {
      this.persistenceService.sidenav.toggle();
    }
  }

  public toggleAboutNav() {
    if (this.persistenceService.aboutnav) {
      this.persistenceService.aboutnav.toggle();
    }
  }
}
