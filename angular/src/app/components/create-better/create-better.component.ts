import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { InformationComponent } from '../information/information.component';
import { BetterService } from 'src/app/services/rest/better.service';
import { IError } from 'src/app/models/utils';
import { IBetter } from 'src/app/models/better';
import { BetActions } from 'src/app/store/action/bet.action';

export interface ICreateBetterFormGroup {
  account: ValidationErrors;
  password: ValidationErrors;
  name: ValidationErrors;
  firstName: ValidationErrors;
}

@Component({
  selector: 'create-better',
  templateUrl: './create-better.component.html',
  styleUrls: ['./create-better.component.scss'],
})
export class CreateBetterComponent implements OnInit {
  public formGroup!: FormGroup;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private betterService: BetterService,
    private store: Store,
    private router: Router
  ) {}

  public ngOnInit() {
    this.formGroup = this.fb.group({
      account: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      firstName: ['', Validators.required],
      contact: ['', Validators.required],
    });
  }

  public createBetter() {
    const account: string = this.formGroup?.get(['account'])?.value || '';
    const password: string = this.formGroup?.get(['password'])?.value || '';
    const name: string = this.formGroup?.get(['name'])?.value || '';
    const firstName: string = this.formGroup?.get(['firstName'])?.value || '';
    const contact: string = this.formGroup?.get(['contact'])?.value || '';

    if (
      account.trim() === '' ||
      password.trim() === '' ||
      name.trim() === '' ||
      firstName.trim() === '' ||
      contact.trim() === ''
    ) {
      const config: MatDialogConfig = {
        data: {
          title: 'Erreur de saise',
          message:
            "Un ou plusieurs des champs obligatoires n'a/n'ont pas été renseigné(s)",
        },
      };
      this.dialog.open(InformationComponent, config);
    } else {
      // Création du pronostiqueur
      this.betterService
        .createBetter(account, password, name, firstName, contact)
        .subscribe((ret: IBetter | IError) => {
          if ('errorMessage' in ret) {
            const config: MatDialogConfig = {
              data: {
                title: 'Erreur de création du compte',
                message: ret.errorMessage,
              },
            };
            this.dialog.open(InformationComponent, config);
          } else {
            this.store.dispatch([new BetActions.SetBetter(ret)]);
            this.router.navigate(['bet']);
          }
        });
    }
  }

  public back() {
    this.router.navigate(['login']);
  }
}
