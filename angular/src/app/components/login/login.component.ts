import { Component, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InformationComponent } from '../information/information.component';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BetterService } from 'src/app/services/rest/better.service';
import { Store } from '@ngxs/store';
import { BetActions } from 'src/app/store/action/bet.action';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from 'src/app/models/information-dialog-type';
import { Subject, map, takeUntil } from 'rxjs';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetService } from 'src/app/services/rest/bet.service';
import { CommonService } from 'src/app/services/common.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ActivatedRoute } from '@angular/router';

export interface ILoginFormGroup {
  name: ValidationErrors;
  password: ValidationErrors;
}

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;

  public passwordVisibility: boolean = false;
  public canCreateBetter!: boolean;

  private destroy$!: Subject<boolean>;
  private _isRelog!: boolean;
  private _isISBShown: boolean = true;

  private _introClass: string = 'intro backgroundAnimation';

  constructor(
    private readonly dialog: MatDialog,
    private readonly formBuilder: FormBuilder,
    private readonly betterService: BetterService,
    private readonly store: Store,
    private readonly persistenceService: PersistenceService,
    private readonly betService: BetService,
    private readonly themeService: ThemeService,
    private readonly renderer: Renderer2,
    private readonly route: ActivatedRoute
  ) {}

  public get disabledLoginButton(): boolean {
    const name: string = this.formGroup?.get(['name'])?.value || '';
    const password: string = this.formGroup?.get(['password'])?.value || '';
    return name === '' || password === '' || password.length < 4;
  }

  public get isRelog(): boolean {
    if (this._isRelog) return this._isRelog;

    return false;
  }

  public get introClass(): string {
    return this._introClass;
  }

  public get isISBShown(): boolean {
    return this._isISBShown;
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    if (!this._isRelog) {
      setTimeout(() => {
        this._isISBShown = false;
      }, 11000);
    }

    this.route.data
      .pipe(
        takeUntil(this.destroy$),
        map((route) => {
          this._isRelog = route && route['isRelog'] === true;
        })
      )
      .subscribe();

    this.themeService.setTheme(
      this.renderer,
      this.persistenceService.themes[0]
    );

    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.betService
      .canCreateBetter()
      .pipe(
        takeUntil(this.destroy$),
        map((canCreateBetter) => {
          this.canCreateBetter = canCreateBetter.canCreateBetter;
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {
    if (this.destroy$) {
      this.destroy$.next(true);
    }
  }

  public login() {
    const name: string = this.formGroup?.get(['name'])?.value || '';
    const password: string = this.formGroup?.get(['password'])?.value || '';

    if (name.trim() !== '' && password.trim() !== '') {
      // Demande de connexion au site
      this.betterService.login(name, password).subscribe((better) => {
        if (better) {
          this.store.dispatch([new BetActions.SetBetter(better)]);

          this.persistenceService.isEvaluationDone = better.evaluation > 0;

          // Si le tutoriel n'est pas encore fait, on l'affiche toujours
          // Si le tutoriel est fait, si on n'a pas encore dépassé la date de fin de pronostic de la journée, alors on affiche la page de pronostic
          // Sinon on affiche le classement de la journée
          const link: string = better.isAdmin
            ? 'bet'
            : !better.isTutorialDone
            ? 'welcome'
            : better.endBetDate && better.endBetDate > new Date()
            ? 'bet'
            : 'better-ranking1';

          if (link === 'better-ranking1') {
            window.localStorage.setItem('better', JSON.stringify(better));
            window.localStorage.setItem(
              'settings',
              JSON.stringify(this.persistenceService.getSettings())
            );
          }

          this.persistenceService.navigate(link);
        } else {
          const config: MatDialogConfig<IInformationDialogConfig> = {
            data: {
              title: 'Compte inconnu',
              message:
                "Le nom n'est pas reconnu et/ou le mot de passe est incorrect.",
              dialogType: InformationDialogType.Information,
              labels: ['Fermer'],
            },
          };
          this.dialog.open(InformationComponent, config);
        }
      });
    }
  }

  public createBetter() {
    this.persistenceService.navigate('create-better');
  }

  public upperCase($event: any) {
    $event.target.value = new String($event.target.value).toUpperCase();
  }

  public checkPassword($event: any) {
    $event.target.value = ($event.target.value || '').replace(/\D/g, '');
  }

  public toggleVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }

  public enter() {
    this._introClass = 'intro introAnimation';
  }
}
