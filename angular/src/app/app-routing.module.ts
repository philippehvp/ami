import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BetComponent } from './components/bet/bet.component';
import { LoginComponent } from './components/login/login.component';
import { CreateBetterComponent } from './components/create-better/create-better.component';
import { BetPointComponent } from './components/bet/bet-point/bet-point.component';
import { BetterBetComponent as BetterBetComponent } from './components/better-bet/better-bet.component';
import { BetterRankingComponent } from './components/better-ranking/better-ranking.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  { path: 'bet', component: BetComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-better', component: CreateBetterComponent },
  { path: 'tutorial', component: WelcomeComponent },
  { path: 'better-point', component: BetPointComponent },
  { path: 'better-bet', component: BetterBetComponent },
  {
    path: 'better-ranking',
    component: BetterRankingComponent,
    data: { byRanking: 1 },
  },
  {
    path: 'better-name',
    component: BetterRankingComponent,
    data: { byRanking: 0 },
  },
  { path: '**', component: BetComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false, useHash: true }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
