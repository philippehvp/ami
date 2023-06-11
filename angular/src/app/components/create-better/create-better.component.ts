import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { InformationComponent } from '../information/information.component';
import { BetterService } from 'src/app/services/rest/better.service';
import { IError } from 'src/app/models/utils';
import { IBetter } from 'src/app/models/better';
import { BetActions } from 'src/app/store/action/bet.action';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from 'src/app/models/information-dialog-type';
import { PersistenceService } from 'src/app/services/persistence.service';
import { GdprComponent } from '../gdpr/gdpr.component';

export interface ICreateBetterFormGroup {
  name: ValidationErrors;
  password: ValidationErrors;
  firstName: ValidationErrors;
}

@Component({
  selector: 'create-better',
  templateUrl: './create-better.component.html',
  styleUrls: ['./create-better.component.scss'],
})
export class CreateBetterComponent implements OnInit {
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private betterService = inject(BetterService);
  private store = inject(Store);
  private persistenceService = inject(PersistenceService);

  public formGroup!: FormGroup;

  public passwordVisibility: boolean = false;
  public hasMajority: boolean = false;
  public hasGDPRAccepted: boolean = false;

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
      this.hasMajority === false ||
      this.hasGDPRAccepted === false
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
      this.hasMajority === false ||
      this.hasGDPRAccepted === false
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
        .subscribe((ret: IBetter | IError) => {
          if ('errorMessage' in ret) {
            const config: MatDialogConfig<IInformationDialogConfig> = {
              data: {
                title: 'Erreur de création du compte',
                message: ret.errorMessage,
                dialogType: InformationDialogType.Information,
                labels: ['Fermer'],
              },
            };
            this.dialog.open(InformationComponent, config);
          } else {
            this.store.dispatch([new BetActions.SetBetter(ret)]);
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
