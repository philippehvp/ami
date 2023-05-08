import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from 'src/app/models/information-dialog-type';
import { GdprComponent } from '../gdpr/gdpr.component';
import { Subject, map, takeUntil } from 'rxjs';
import { PersistenceService } from 'src/app/services/persistence.service';

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
  private fb = inject(FormBuilder);
  private betterService = inject(BetterService);
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private persistenceService = inject(PersistenceService);

  public formGroup!: FormGroup;

  public passwordVisibility: boolean = false;
  private destroy$!: Subject<boolean>;

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.route.data
      .pipe(
        takeUntil(this.destroy$),
        map((data) => {
          if (data['withGpdr'] === true) {
            // Ouverture de la boîte de dialogue RGPD
            const config: MatDialogConfig = {
              disableClose: true,
            };
            this.dialog.open(GdprComponent, config);
          }
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }

  public login() {
    const name: string = this.formGroup?.get(['name'])?.value || '';
    const password: string = this.formGroup?.get(['password'])?.value || '';

    if (name.trim() === '' || password.trim() === '') {
      const config: MatDialogConfig<IInformationDialogConfig> = {
        data: {
          title: 'Erreur de saise',
          message: "Le nom et/ou le mot de passe n'a pas été renseigné.",
          dialogType: InformationDialogType.Information,
          labels: ['Fermer'],
        },
      };
      this.dialog.open(InformationComponent, config);
    } else {
      // Demande de connexion au site
      this.betterService.login(name, password).subscribe((better) => {
        if (better) {
          this.store.dispatch([new BetActions.SetBetter(better)]);

          const link: string = better.isTutorialDone ? 'bet' : 'welcome';
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

  public checkPassword($event: any) {
    $event.target.value = ($event.target.value || '').replace(/\D/g, '');
  }

  public toggleVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
  }
}
