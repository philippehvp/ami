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

import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { BetState } from './store/state/bet.state';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { BetContestComponent } from './components/bet/bet-contest/bet-contest.component';
import { BetDurationComponent } from './components/bet/bet-duration/bet-duration.component';
import { BetPlayerComponent } from './components/bet/bet-player/bet-player.component';

import { LoginComponent } from './components/login/login.component';
import { InformationComponent } from './components/information/information.component';
import { CreateBetterComponent } from './components/create-better/create-better.component';
import { BetPointComponent } from './components/bet/bet-point/bet-point.component';
import { BetterBetState } from './store/state/better-bet.state';
import { BetterRankingComponent } from './components/better-ranking/better-ranking.component';
import { BetStatComponent } from './components/bet-stat/bet-stat.component';
import { BetStatState } from './store/state/bet-stat.state';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { TitlebarComponent } from './components/titlebar/titlebar.component';
import { RuleComponent } from './components/rule/rule.component';
import { GdprComponent } from './components/gdpr/gdpr.component';
import { BetReviewOfComponent } from './components/bet/bet-review-of/bet-review-of.component';
import { SettingComponent } from './components/setting/setting.component';

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
    BetStatComponent,
    WelcomeComponent,
    TitlebarComponent,
    RuleComponent,
    GdprComponent,
    BetReviewOfComponent,
    SettingComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    NgxsModule.forRoot([BetState, BetterBetState, BetStatState], {}),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownModule,

    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    DragDropModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
