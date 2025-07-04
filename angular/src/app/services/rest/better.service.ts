import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import {
  IBetter,
  IBetterRaw,
  ISetting,
  ISettingRaw,
} from 'src/app/models/better';
import { CommonService } from '../common.service';
import { IEmpty, IError, IOffline } from 'src/app/models/utils';
import { PersistenceService } from '../persistence.service';
import { ConnectionActions } from 'src/app/store/action/connection.action';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root',
})
export class BetterService {
  private httpClient = inject(HttpClient);
  private persistenceService = inject(PersistenceService);
  private store = inject(Store);

  public login(name: string, password: string): Observable<IBetter | null> {
    return this.loginRaw(name, password).pipe(
      map((betterRaw: IBetterRaw) => {
        if (betterRaw) {
          const settingRaw: ISettingRaw = {
            clubName: betterRaw.setting.clubName,
            autoNavigation: betterRaw.setting.autoNavigation,
            playerReverse: betterRaw.setting.playerReverse,
            theme: betterRaw.setting.theme,
            playerRanking: betterRaw.setting.playerRanking,
            firstnameVisible: betterRaw.setting.firstnameVisible,
          };
          this.persistenceService.restoreSettings(settingRaw);

          return betterRaw
            ? {
                accessKey: betterRaw.accessKey,
                randomKey: betterRaw.randomKey,
                name: betterRaw.name,
                club: betterRaw.club,
                firstName: betterRaw.firstName,
                isAdmin: betterRaw.isAdmin === 1 ? true : false,
                isTutorialDone: betterRaw.isTutorialDone === 1 ? true : false,
                evaluation: betterRaw.evaluation,
                endBetDate: betterRaw.endBetDate
                  ? new Date(betterRaw.endBetDate)
                  : null,
                isDay1BetOver: betterRaw.isDay1BetOver === 1,
                isDay2BetOver: betterRaw.isDay2BetOver === 1,
              }
            : null;
        } else {
          return null;
        }
      })
    );
  }

  private loginRaw(name: string, password: string): Observable<IBetterRaw> {
    const url = CommonService.getURL('better/better');
    return this.httpClient.post<IBetterRaw>(url, { name, password });
  }

  public createBetter(
    name: string,
    password: string,
    firstName: string,
    contact: string,
    club: string
  ): Observable<IError | IBetter> {
    const url = CommonService.getURL('better/createBetter');
    return this.httpClient
      .post<IBetterRaw | IError>(url, {
        name,
        password,
        firstName,
        contact,
        club,
      })
      .pipe(
        map((betterRaw: IBetterRaw | IError) => {
          if ('errorMessage' in betterRaw) {
            return betterRaw;
          } else {
            return <IBetter>{
              accessKey: betterRaw.accessKey,
              randomKey: betterRaw.randomKey,
              name: betterRaw.name,
              firstName: betterRaw.firstName,
              club: club,
              isAdmin: betterRaw.isAdmin === 1 ? true : false,
              isTutorialDone: betterRaw.isTutorialDone == 1 ? true : false,
              evaluation: betterRaw.evaluation,
            };
          }
        })
      );
  }

  public setIsTutorialDone(accessKey: string): Observable<IEmpty | IOffline> {
    const url = CommonService.getURL('better/updateIsTutorialDone');
    return this.httpClient.post<IEmpty>(url, {
      accessKey,
    });
  }

  public setEvaluation(
    accessKey: string,
    evaluation: number
  ): Observable<IEmpty | IOffline> {
    const url = CommonService.getURL('better/updateEvaluation');
    return this.httpClient
      .post<IEmpty | IOffline>(url, {
        accessKey,
        evaluation,
      })
      .pipe(
        tap((evaluation) => {
          if (evaluation && 'isOffline' in evaluation) {
            this.store.dispatch([new ConnectionActions.IsOffline()]);
          }
        })
      );
  }

  public deleteAccount(accessKey: string): Observable<IEmpty | IOffline> {
    const url = CommonService.getURL('better/deleteBetter');
    return this.httpClient
      .post<IEmpty | IOffline>(url, {
        accessKey,
      })
      .pipe(
        tap((account) => {
          if (account && 'isOffline' in account) {
            this.store.dispatch([new ConnectionActions.IsOffline()]);
          }
        })
      );
  }

  public updateSetting(
    better: IBetter,
    settings: ISetting
  ): Observable<IEmpty | IOffline | ISetting> {
    const url = CommonService.getURL('better/updateSetting');
    return this.httpClient.post<IEmpty | IOffline>(url, {
      accessKey: better.accessKey,
      clubName: settings.isClubName ? 1 : 0,
      autoNavigation: settings.isAutoNavigation ? 1 : 0,
      playerReverse: settings.isPlayerReverse ? 1 : 0,
      theme: settings.theme,
      playerRanking: settings.isPlayerRanking ? 1 : 0,
      firstnameVisible: settings.isFirstnameVisible ? 1 : 0,
    });
  }
}
