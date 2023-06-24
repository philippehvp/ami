import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { BetActions } from './store/action/bet.action';
import { CommonService } from './services/common.service';
import { BetState } from './store/state/bet.state';
import { Observable } from 'rxjs';
import { IBetter } from './models/better';
import { PersistenceService } from './services/persistence.service';
import { MatSidenav } from '@angular/material/sidenav';

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
})
export class AppComponent implements AfterViewInit {
  private store = inject(Store);
  private persistenceService = inject(PersistenceService);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @ViewChild('sidenav') public sidenav!: MatSidenav;
  @ViewChild('aboutnav') public aboutnav!: MatSidenav;

  public get isToolbarVisible(): boolean {
    return this.persistenceService.isToolbarVisible;
  }

  constructor() {
    if (CommonService.isProduction) {
      this.persistenceService.navigate('login');
    } else {
      const better: string = window.localStorage.getItem('better') || '';

      if (better) {
        const betterRestored: IBetter = JSON.parse(better);
        this.store.dispatch([new BetActions.SetBetter(betterRestored)]);

        this.persistenceService.isEvaluationDone =
          betterRestored.evaluation > 0;
        if (betterRestored.endBetDate) {
          // Les données restaurées par cookies remontent des champs en chaîne de caractères
          if (new Date(betterRestored.endBetDate) < new Date()) {
            this.persistenceService.navigate('better-ranking');
          } else {
            this.persistenceService.navigate('bet');
          }
        }
      } else {
        this.persistenceService.navigate('login');
      }
    }
  }

  public ngAfterViewInit(): void {
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
