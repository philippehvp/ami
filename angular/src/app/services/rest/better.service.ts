import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IBetter, IBetterRaw } from 'src/app/models/better';
import { CommonService } from './common.service';
import { IEmpty, IError, IOffline } from 'src/app/models/utils';

@Injectable({
  providedIn: 'root',
})
export class BetterService {
  private httpClient = inject(HttpClient);

  public login(name: string, password: string): Observable<IBetter | null> {
    return this.loginRaw(name, password).pipe(
      map((betterRaw: IBetterRaw) => {
        return betterRaw
          ? {
              accessKey: betterRaw.accessKey,
              name: betterRaw.name,
              firstName: betterRaw.firstName,
              isAdmin: betterRaw.isAdmin === 1 ? true : false,
              isTutorialDone: betterRaw.isTutorialDone === 1 ? true : false,
              evaluation: betterRaw.evaluation,
              setting: {
                withClubName: betterRaw.setting.clubName === 1 ? true : false,
                isAutoNavigation:
                  betterRaw.setting.autoNavigation === 1 ? true : false,
                isPlayerReverse:
                  betterRaw.setting.playerReverse === 1 ? true : false,
                isDarkMode: betterRaw.setting.darkMode === 1 ? true : false,
              },
            }
          : null;
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
    contact: string
  ): Observable<IError | IBetter> {
    const url = CommonService.getURL('better/createBetter');
    return this.httpClient.post<IBetter>(url, {
      name,
      password,
      firstName,
      contact,
    });
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
    return this.httpClient.post<IEmpty>(url, {
      accessKey,
      evaluation,
    });
  }

  public deleteAccount(accessKey: string): Observable<IEmpty | IOffline> {
    const url = CommonService.getURL('better/deleteBetter');
    return this.httpClient.post<IEmpty>(url, {
      accessKey,
    });
  }

  public updateSetting(better: IBetter): Observable<IEmpty | IOffline> {
    const url = CommonService.getURL('better/updateSetting');
    return this.httpClient.post<IEmpty>(url, {
      accessKey: better.accessKey,
      clubName: better.setting.withClubName ? 1 : 0,
      autoNavigation: better.setting.isAutoNavigation ? 1 : 0,
      playerReverse: better.setting.isPlayerReverse ? 1 : 0,
      darkMode: better.setting.isDarkMode ? 1 : 0,
    });
  }
}
