import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InformationDialogComponent } from '../information-dialog/information-dialog.component';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BetterService } from 'src/app/services/rest/better.service';
import { Store } from '@ngxs/store';
import { BetActions } from 'src/app/store/action/bet.action';
import { Router } from '@angular/router';

export interface ILoginFormGroup {
  account: ValidationErrors;
  password: ValidationErrors;
}

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
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
    });

    window.localStorage.removeItem('better');
  }

  public login() {
    const account: string = this.formGroup?.get(['account'])?.value || '';
    const password: string = this.formGroup?.get(['password'])?.value || '';

    if (account.trim() === '' || password.trim() === '') {
      const config: MatDialogConfig = {
        data: {
          title: 'Erreur de saise',
          message:
            "Le login de connexion et/ou le mot de passe n'a pas été renseigné",
        },
      };
      this.dialog.open(InformationDialogComponent, config);
    } else {
      // Demande de connexion au site
      this.betterService.login(account, password).subscribe((better) => {
        if (better) {
          this.store.dispatch([new BetActions.SetBetter(better)]);
          this.router.navigate(['bet']);
        } else {
          const config: MatDialogConfig = {
            data: {
              title: 'Compte inconnu',
              message:
                "Le login de connexion n'est pas reconnu et/ou le mot de passe est incorrect",
            },
          };
          this.dialog.open(InformationDialogComponent, config);
        }
      });
    }
  }

  public createBetter() {
    this.router.navigate(['create-better']);
  }
}
