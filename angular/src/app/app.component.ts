import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { BetActions } from './store/action/bet.action';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  private store = inject(Store);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private persistenceService = inject(PersistenceService);
  private betterService = inject(BetterService);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.completedBets)
  completedBets$!: Observable<number>;

  @Select(BetState.bets)
  bets$!: Observable<IBet[]>;

  @ViewChild('sidenav') public sidenav!: MatSidenav;

  constructor() {
    if (CommonService.isProduction) {
      this.router.navigate(['login']);
    } else {
      const better: string = window.localStorage.getItem('better') || '';

      if (better) {
        this.store.dispatch([new BetActions.SetBetter(JSON.parse(better))]);
        this.router.navigate(['bet']);
      } else {
        this.router.navigate(['login']);
      }
    }
  }

  public get currentPage(): string {
    return this.persistenceService.currentPage;
  }

  public ngAfterViewInit(): void {
    this.persistenceService.sidenav = this.sidenav;
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
      if (!CommonService.isProduction) {
        window.localStorage.removeItem('better');
      }
      this.router.navigate(['logout']);
    });
  }

  public toggleSideMenu() {
    this.persistenceService.sidenav.toggle();
  }

  public closeSideMenu() {
    this.persistenceService.sidenav.close();
  }

  public displayTutorial() {
    this.persistenceService.tutorialStep = 1;
    if (this.persistenceService.currentPage !== 'bet') {
      this.router.navigate(['bet']);
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
}
