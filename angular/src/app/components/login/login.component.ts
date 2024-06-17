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
  private dialog = inject(MatDialog);
  private formBuilder = inject(FormBuilder);
  private betterService = inject(BetterService);
  private store = inject(Store);
  private persistenceService = inject(PersistenceService);
  private betService = inject(BetService);
  private themeService = inject(ThemeService);
  private renderer = inject(Renderer2);
  private route = inject(ActivatedRoute);

  public formGroup!: FormGroup;

  public passwordVisibility: boolean = false;
  public canCreateBetter!: boolean;

  private destroy$!: Subject<boolean>;
  private _isRelog!: boolean;
  private _splashClass: string = 'splash';

  public get disabledLoginButton(): boolean {
    const name: string = this.formGroup?.get(['name'])?.value || '';
    const password: string = this.formGroup?.get(['password'])?.value || '';
    return name === '' || password === '' || password.length < 4;
  }

  public get isRelog(): boolean {
    if (this._isRelog) return this._isRelog;

    return false;
  }

  public get splashClass(): string {
    return this._splashClass;
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

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
            : 'better-ranking';

          if (link === 'better-ranking') {
            if (!CommonService.isProduction) {
              window.localStorage.setItem('better', JSON.stringify(better));
              window.localStorage.setItem(
                'settings',
                JSON.stringify(this.persistenceService.getSettings())
              );
            }
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

  public enter() {
    this._splashClass += ' fadeOut';
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
}
