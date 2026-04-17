import { Component, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import { IBet } from '../../models/bet';
import { IBetter } from '../../models/better';
import { PersistenceService } from '../../services/persistence.service';
import { BetState } from '../../store/state/bet.state';
import { GdprComponent } from '../gdpr/gdpr.component';
import { BetActions } from '../../store/action/bet.action';
import { ConnectionActions } from '../../store/action/connection.action';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from '../../models/information-dialog-type';
import { InformationComponent } from '../information/information.component';
import { BetterService } from '../../services/rest/better.service';
import { ThemeService } from '../../services/theme.service';
import { AsyncPipe } from '@angular/common';

type TData = {
  better: IBetter;
  bets: IBet[];
  completedBets: number;
};

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  imports: [AsyncPipe],
})
export class SidenavComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly persistenceService = inject(PersistenceService);
  private readonly dialog = inject(MatDialog);
  private readonly themeService = inject(ThemeService);
  private readonly renderer = inject(Renderer2);
  private readonly betterService = inject(BetterService);

  public better$!: Observable<IBetter>;
  public completedBets$!: Observable<number>;
  public bets$!: Observable<IBet[]>;

  private destroy$!: Subject<boolean>;

  public data$!: Observable<TData>;

  constructor() {
    this.better$ = this.store.select(BetState.better);
    this.completedBets$ = this.store.select(BetState.completedBets);
    this.bets$ = this.store.select(BetState.bets);
  }

  public get isTutorialAvailable(): boolean {
    return this.persistenceService.isTutorialAvailable;
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    this.data$ = combineLatest([
      this.better$,
      this.bets$,
      this.completedBets$,
    ]).pipe(
      takeUntil(this.destroy$),
      map(([better, bets, completedBets]) => ({
        better,
        bets,
        completedBets,
      })),
    );
  }

  public ngOnDestroy() {
    if (this.destroy$) {
      this.destroy$.next(true);
    }
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
    // On lance le tutoriel uniquement si on est sur la page de pronostic
    if (this.persistenceService.isTutorialAvailable) {
      this.persistenceService.isCompactMode = false;
      this.persistenceService.tutorialStep = 1;
    }
  }

  public logout(
    betsCount: number,
    completedBetsCount: number,
    isAdmin: boolean,
  ) {
    // On vérifie que le pronostiqueur ait saisi tous ses pronostics
    if (betsCount !== completedBetsCount && !isAdmin) {
      const config: MatDialogConfig<IInformationDialogConfig> = {
        data: {
          title: 'Pronostics incomplets',
          message:
            "Tous les pronostics n'ont pas été saisis. Sûr de vouloir quitter WINABAD ?",
          dialogType: InformationDialogType.YesNo,
          labels: ['Rester', 'Quitter'],
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
      this.persistenceService.themes[0],
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
