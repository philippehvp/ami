import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BetComponent } from './components/bet/bet.component';
import { LoginComponent } from './components/login/login.component';
import { CreateBetterComponent } from './components/create-better/create-better.component';

const routes: Routes = [
  { path: 'bet', component: BetComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-better', component: CreateBetterComponent },
  { path: '**', component: BetComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
