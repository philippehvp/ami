import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest, map } from 'rxjs';
import { IBet } from 'src/app/models/bet';
import { IBetter } from 'src/app/models/better';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetState } from 'src/app/store/state/bet.state';
import { GdprComponent } from '../gdpr/gdpr.component';
import { BetActions } from 'src/app/store/action/bet.action';
import { ConnectionActions } from 'src/app/store/action/connection.action';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from 'src/app/models/information-dialog-type';
import { InformationComponent } from '../information/information.component';
import { CommonService } from 'src/app/services/common.service';
import { BetterService } from 'src/app/services/rest/better.service';
import { ThemeService } from 'src/app/services/theme.service';

type TData = {
  better: IBetter;
  bets: IBet[];
  completedBets: number;
};

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  private persistenceService = inject(PersistenceService);
  private dialog = inject(MatDialog);
  private store = inject(Store);
  private themeService = inject(ThemeService);
  private renderer = inject(Renderer2);
  private betterService = inject(BetterService);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.completedBets)
  completedBets$!: Observable<number>;

  @Select(BetState.bets)
  bets$!: Observable<IBet[]>;

  public data$!: Observable<TData>;

  public ngOnInit() {
    this.data$ = combineLatest([
      this.better$,
      this.bets$,
      this.completedBets$,
    ]).pipe(
      map(([better, bets, completedBets]) => ({
        better,
        bets,
        completedBets,
      }))
    );
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

  public displayBetStat() {
    this.persistenceService.navigate('bet-stat');
  }

  public openGDPR() {
    // Ouverture de la boîte de dialogue RGPD
    const config: MatDialogConfig = {
      disableClose: true,
    };
    this.dialog.open(GdprComponent, config);
  }

  public setPlayersNames() {
    this.store.dispatch([new BetActions.SetPlayersNames()]);
  }

  public isBettingPhase(endBetDate: Date | null): boolean {
    if (endBetDate) {
      if (typeof endBetDate === 'string') {
        return new Date(endBetDate) > new Date();
      } else {
        return endBetDate > new Date();
      }
    }
    return true;
  }

  public displayTutorial() {
    this.persistenceService.isCompactMode = false;
    this.persistenceService.tutorialStep = 1;
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
            "Tu n'as pas saisi tous les pronostics. Sûr de vouloir quitter WINABAD ?",
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
    this.store.dispatch([new ConnectionActions.Logout()]);

    this.themeService.setTheme(
      this.renderer,
      this.persistenceService.themes[0]
    );

    if (!CommonService.isProduction) {
      window.localStorage.removeItem('better');
      window.localStorage.removeItem('settings');
    }

    this.persistenceService.navigate('relog');
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
            this.store.dispatch([new BetActions.EraseBets()]);
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
            'Es-tu sûr de vouloir supprimer ton compte et donc ta participation à WINABAD ?',
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
}
