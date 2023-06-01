import {
  AfterViewInit,
  Component,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { BetActions } from './store/action/bet.action';
import { CommonService } from './services/rest/common.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from './models/information-dialog-type';
import { InformationComponent } from './components/information/information.component';
import { ConnectionActions } from './store/action/connection.action';
import { BetState } from './store/state/bet.state';
import { Observable } from 'rxjs';
import { IBetter } from './models/better';
import { IBet } from './models/bet';
import { PersistenceService } from './services/persistence.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BetterService } from './services/rest/better.service';
import { UtilsService } from './services/utils.service';
import { GdprComponent } from './components/gdpr/gdpr.component';

export interface ILogo {
  icon: string;
  label: string;
  isLightAndDark: boolean;
  class: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private persistenceService = inject(PersistenceService);
  private betterService = inject(BetterService);
  private utilsService = inject(UtilsService);
  private renderer = inject(Renderer2);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.completedBets)
  completedBets$!: Observable<number>;

  @Select(BetState.bets)
  bets$!: Observable<IBet[]>;

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
        this.store.dispatch([new BetActions.SetBetter(JSON.parse(better))]);
        this.persistenceService.navigate('bet');
      } else {
        this.persistenceService.navigate('login');
      }
    }
  }

  public ngAfterViewInit(): void {
    this.persistenceService.sidenav = this.sidenav;
    this.persistenceService.aboutnav = this.aboutnav;
  }

  public logout(
    betsCount: number,
    completedBetsCount: number,
    isAdmin: boolean
  ) {
    // On vérifie que le pronostiqueur ait saisi tous ses pronostics
    if (betsCount !== completedBetsCount && !isAdmin) {
      const config: MatDialogConfig<IInformationDialogConfig> = {
        data: {
          title: 'Pronostics incomplets',
          message:
            "Tu n'as pas saisi tous les pronostics. Sûr de vouloir quitter Winabad ?",
          dialogType: InformationDialogType.YesNo,
          labels: ['Annuler', 'Quitter'],
        },
      };

      this.dialog
        .open(InformationComponent, config)
        .afterClosed()
        .subscribe((action: boolean) => {
          if (action) {
            this.disconnect();
          }
        });
    } else {
      this.disconnect();
    }
  }

  private disconnect() {
    this.store.dispatch([new ConnectionActions.Logout()]).subscribe(() => {
      const isDarkMode = false;
      this.utilsService.setMode(this.renderer, isDarkMode);

      if (!CommonService.isProduction) {
        window.localStorage.removeItem('better');
      }
      this.persistenceService.navigate('login');
    });
  }

  public toggleSideMenu() {
    this.persistenceService.sidenav.toggle();
  }

  public toggleAboutNav() {
    this.persistenceService.aboutnav.toggle();
  }

  public displayTutorial() {
    this.persistenceService.isCompactMode = false;
    this.persistenceService.tutorialStep = 1;
  }

  public eraseBets(better: IBetter | null) {
    if (better) {
      const config: MatDialogConfig<IInformationDialogConfig> = {
        data: {
          title: 'Réinitialisation des pronostics',
          message: 'Es-tu sûr de vouloir réinitialiser tes pronostics ?',
          dialogType: InformationDialogType.YesNo,
          labels: ['Annuler', 'Réinitialiser'],
        },
      };

      this.dialog
        .open(InformationComponent, config)
        .afterClosed()
        .subscribe((action: boolean) => {
          if (action) {
            this.store.dispatch([
              new BetActions.EraseBets(better.accessKey || ''),
            ]);
          }
        });
    }
  }

  public deleteAccount(better: IBetter | null) {
    if (better) {
      const config: MatDialogConfig<IInformationDialogConfig> = {
        data: {
          title: 'Suppression du compte',
          message:
            'Es-tu sûr de vouloir supprimer ton compte et donc ta participation à Winabad ?',
          dialogType: InformationDialogType.YesNo,
          labels: ['Annuler', 'Supprimer'],
        },
      };

      this.dialog
        .open(InformationComponent, config)
        .afterClosed()
        .subscribe((action: boolean) => {
          if (action) {
            this.betterService
              .deleteAccount(better?.accessKey || '')
              .subscribe(() => {
                this.disconnect();
              });
          }
        });
    }
  }

  public navigate(link: string) {
    this.persistenceService.navigate(link);
  }

  public displayBettersBet() {
    this.persistenceService.navigate('better-bet');
  }

  public displayBettersRanking() {
    this.persistenceService.navigate('better-ranking');
  }

  public displayBettersOrderedByName() {
    this.persistenceService.navigate('better-name');
  }

  public logos: ILogo[][] = [
    [
      {
        icon: 'logo-isb',
        label: 'ISB',
        isLightAndDark: true,
        class: 'icon-small',
      },
      {
        icon: 'logo-phocea-light',
        label: 'Phocea Light',
        isLightAndDark: true,
        class: 'icon-large',
      },
      {
        icon: 'logo-balotti',
        label: 'Balotti',
        isLightAndDark: false,
        class: 'icon-small',
      },
    ],
    [
      {
        icon: 'logo-liguesud',
        label: 'Ligue Sud',
        isLightAndDark: false,
        class: 'icon-large',
      },
      {
        icon: 'logo-ffbad',
        label: 'FFBAD',
        isLightAndDark: false,
        class: 'icon-large',
      },
      {
        icon: 'logo-ville-istres',
        label: "Ville d'Istres",
        isLightAndDark: false,
        class: 'icon-large',
      },
    ],
  ];

  public getLogoFile(logo: ILogo): string {
    const prefix = 'assets/img/logos/';
    if (!this.persistenceService.isDarkMode || !logo.isLightAndDark) {
      return prefix + logo.icon + '.png';
    } else {
      return prefix + logo.icon + '_dark.png';
    }
  }

  public openGDPR() {
    // Ouverture de la boîte de dialogue RGPD
    const config: MatDialogConfig = {
      disableClose: true,
    };
    this.dialog.open(GdprComponent, config);
  }
}
