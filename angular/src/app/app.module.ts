import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxsModule } from '@ngxs/store';

import { AppComponent } from './app.component';

import { BetComponent } from './components/bet/bet.component';
import { BetterBetComponent } from './components/better-bet/better-bet.component';

import { ToolbarComponent } from './components/toolbar/toolbar.component';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import { MarkdownModule } from 'ngx-markdown';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

import { BetState } from './store/state/bet.state';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { BetContestComponent } from './components/bet/bet-contest/bet-contest.component';
import { BetDurationComponent } from './components/bet/bet-duration/bet-duration.component';
import { BetPlayerComponent } from './components/bet/bet-player/bet-player.component';

import { LoginComponent } from './components/login/login.component';
import { InformationComponent } from './components/information/information.component';
import { CreateBetterComponent } from './components/create-better/create-better.component';
import { BetterPointState as BetterPointState } from './store/state/better-point.state';
import { BetPointComponent } from './components/bet/bet-point/bet-point.component';
import { BetterBetState } from './store/state/better-bet.state';
import { BetterRankingComponent } from './components/better-ranking/better-ranking.component';
import { BetterRankingState } from './store/state/better-ranking.state';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { TitlebarComponent } from './components/titlebar/titlebar.component';
import { RuleComponent } from './components/rule/rule.component';
import { GdprComponent } from './components/gdpr/gdpr.component';

@NgModule({
  declarations: [
    AppComponent,
    BetContestComponent,
    BetComponent,
    BetDurationComponent,
    BetPlayerComponent,
    BetPointComponent,
    BetterBetComponent,
    CreateBetterComponent,
    InformationComponent,
    LoginComponent,
    ToolbarComponent,
    BetterRankingComponent,
    WelcomeComponent,
    TitlebarComponent,
    RuleComponent,
    GdprComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    NgxsModule.forRoot(
      [BetState, BetterPointState, BetterBetState, BetterRankingState],
      {}
    ),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownModule,

    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatSliderModule,
    MatTableModule,
    MatToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
