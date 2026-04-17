import {
  ChangeDetectionStrategy,
  Component,
  model,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { InformationComponent } from '../information/information.component';
import { BetterService } from '../../services/rest/better.service';
import { IError } from '../../models/utils';
import { IBetter } from '../../models/better';
import { BetActions } from '../../store/action/bet.action';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from '../../models/information-dialog-type';
import { PersistenceService } from '../../services/persistence.service';
import { GdprComponent } from '../gdpr/gdpr.component';
import { MatLabel } from '@angular/material/form-field';

import { MatIconModule } from '@angular/material/icon';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface ICreateBetterFormGroup {
  name: ValidationErrors;
  password: ValidationErrors;
  firstName: ValidationErrors;
}

@Component({
  selector: 'create-better',
  templateUrl: './create-better.component.html',
  styleUrls: ['./create-better.component.scss'],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCheckbox,
    MatCheckboxModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateBetterComponent implements OnInit {
  public formGroup!: FormGroup;

  public passwordVisibility: boolean = false;
  public hasMajority = model(false);
  public hasGDPRAccepted = model(false);

  constructor(
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder,
    private readonly betterService: BetterService,
    private readonly store: Store,
    private readonly persistenceService: PersistenceService,
  ) {}

  public get createBetterDisabled(): boolean {
    const name: string = this.formGroup?.get(['name'])?.value || '';
    const firstName: string = this.formGroup?.get(['firstName'])?.value || '';
    const password: string = this.formGroup?.get(['password'])?.value || '';
    const contact: string = this.formGroup?.get(['contact'])?.value || '';
    return (
      name === '' ||
      firstName === '' ||
      password === '' ||
      password.length < 4 ||
      contact === '' ||
      this.hasMajority() === false ||
      this.hasGDPRAccepted() === false
    );
  }

  public ngOnInit() {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      firstName: ['', Validators.required],
      password: ['', Validators.required],
      contact: ['', Validators.required],
      club: [''],
      hasMajority: [false, Validators.required],
      hasGDPRAccepted: [false, Validators.required],
    });
  }

  public createBetter() {
    const name: string = this.formGroup?.get(['name'])?.value || '';
    const firstName: string = this.formGroup?.get(['firstName'])?.value || '';
    const password: string = this.formGroup?.get(['password'])?.value || '';
    const contact: string = this.formGroup?.get(['contact'])?.value || '';
    const club: string = this.formGroup?.get(['club'])?.value || '';

    if (
      name.trim() === '' ||
      password.trim() === '' ||
      firstName.trim() === '' ||
      contact.trim() === '' ||
      this.hasMajority() === false ||
      this.hasGDPRAccepted() === false
    ) {
      const config: MatDialogConfig<IInformationDialogConfig> = {
        data: {
          title: 'Erreur de saise',
          message:
            "Un ou plusieurs des champs obligatoires n'a/n'ont pas été renseigné(s).",
          dialogType: InformationDialogType.Information,
          labels: ['Fermer'],
        },
      };
      this.dialog.open(InformationComponent, config);
    } else {
      // Création du pronostiqueur
      this.betterService
        .createBetter(name, password, firstName, contact, club)
        .subscribe((better: IBetter | IError) => {
          if ('errorMessage' in better) {
            const config: MatDialogConfig<IInformationDialogConfig> = {
              data: {
                title: 'Erreur de création du compte',
                message: better.errorMessage,
                dialogType: InformationDialogType.Information,
                labels: ['Fermer'],
              },
            };
            this.dialog.open(InformationComponent, config);
          } else {
            this.store.dispatch([new BetActions.SetBetter(better)]);

            this.persistenceService.navigate('welcome');
          }
        });
    }
  }

  public back() {
    this.persistenceService.navigate('login');
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

  public openGDPR() {
    // Ouverture de la boîte de dialogue RGPD
    const config: MatDialogConfig = {
      disableClose: true,
    };
    this.dialog.open(GdprComponent, config);
  }
}
