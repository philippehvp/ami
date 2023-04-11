import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxsModule } from '@ngxs/store';

import { AppComponent } from './app.component';

import { BetComponent } from './components/bet/bet.component';
import { BetterComponent } from './components/better/better.component';

import { RankingComponent } from './components/ranking/ranking.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { BetState } from './store/state/bet.state';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { BetCategoryComponent } from './components/bet/bet-category/bet-category.component';
import { BetContestComponent } from './components/bet/bet-contest/bet-contest.component';
import { BetDurationComponent } from './components/bet/bet-duration/bet-duration.component';
import { BetPlayerComponent } from './components/bet/bet-player/bet-player.component';

import { BetService } from './services/rest/bet.service';
import { CommonService } from './services/rest/common.service';
import { PlayerService } from './services/rest/player.service';
import { UtilsService } from './services/utils.service';
import { OfflineComponent } from './components/offline/offline.component';
import { LoginComponent } from './components/login/login.component';
import { InformationComponent } from './components/information/information.component';
import { CreateBetterComponent } from './components/create-better/create-better.component';
import { BetterPointState as BetterPointState } from './store/state/better-point.state';
import { BetPointComponent } from './components/bet/bet-point/bet-point.component';

@NgModule({
  declarations: [
    AppComponent,
    BetCategoryComponent,
    BetContestComponent,
    BetComponent,
    BetDurationComponent,
    BetPlayerComponent,
    BetPointComponent,
    BetterComponent,
    CreateBetterComponent,
    InformationComponent,
    LoginComponent,
    OfflineComponent,
    RankingComponent,
    ToolbarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

    NgxsModule.forRoot([BetState, BetterPointState], {}),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
  ],
  providers: [BetService, CommonService, PlayerService, UtilsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
