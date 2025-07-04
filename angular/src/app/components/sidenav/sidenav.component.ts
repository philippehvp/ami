import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
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
  public better$!: Observable<IBetter>;
  public completedBets$!: Observable<number>;
  public bets$!: Observable<IBet[]>;

  public data$!: Observable<TData>;

  constructor(
    private readonly store: Store,
    private readonly persistenceService: PersistenceService,
    private readonly dialog: MatDialog,
    private readonly themeService: ThemeService,
    private readonly renderer: Renderer2,
    private readonly betterService: BetterService
  ) {
    this.better$ = this.store.select(BetState.better);
    this.completedBets$ = this.store.select(BetState.completedBets);
    this.bets$ = this.store.select(BetState.bets);
  }

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

  public displayBettersRanking1() {
    this.persistenceService.navigate('better-ranking1');
  }

  public displayBettersRanking2() {
    this.persistenceService.navigate('better-ranking2');
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

    window.localStorage.removeItem('better');
    window.localStorage.removeItem('settings');

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
