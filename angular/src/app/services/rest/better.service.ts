import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IBetter, IBetterRaw } from 'src/app/models/better';
import { CommonService } from '../common.service';
import { IEmpty, IError, IOffline } from 'src/app/models/utils';
import { PersistenceService } from '../persistence.service';

@Injectable({
  providedIn: 'root',
})
export class BetterService {
  private httpClient = inject(HttpClient);
  private persistenceService = inject(PersistenceService);

  public login(name: string, password: string): Observable<IBetter | null> {
    return this.loginRaw(name, password).pipe(
      map((betterRaw: IBetterRaw) => {
        if (betterRaw) {
          this.persistenceService.isClubName = betterRaw.setting.clubName === 1;
          this.persistenceService.isAutoNavigation =
            betterRaw.setting.autoNavigation === 1;
          this.persistenceService.isPlayerReverse =
            betterRaw.setting.playerReverse === 1;
          this.persistenceService.isDarkMode = betterRaw.setting.darkMode === 1;
          this.persistenceService.isPlayerRanking =
            betterRaw.setting.playerRanking === 1;
          this.persistenceService.isFirstnameVisible =
            betterRaw.setting.firstnameVisible === 1;

          return betterRaw
            ? {
                accessKey: betterRaw.accessKey,
                randomKey: betterRaw.randomKey,
                name: betterRaw.name,
                universeFolder: betterRaw.universe_folder,
                avatarFile: betterRaw.avatar_file,
                firstName: betterRaw.firstName,
                isAdmin: betterRaw.isAdmin === 1 ? true : false,
                isTutorialDone: betterRaw.isTutorialDone === 1 ? true : false,
                evaluation: betterRaw.evaluation,
                endBetDate: betterRaw.endBetDate
                  ? new Date(betterRaw.endBetDate)
                  : null,
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
    club: string,
    avatarId: number,
    folder: string,
    avatarFile: string
  ): Observable<IError | IBetter> {
    const url = CommonService.getURL('better/createBetter');
    return this.httpClient
      .post<IBetterRaw | IError>(url, {
        name,
        password,
        firstName,
        contact,
        club,
        avatarId,
        folder,
        avatarFile,
      })
      .pipe(
        map((better: IBetterRaw | IError) => {
          if ('errorMessage' in better) {
            return better;
          } else {
            return <IBetter>{
              accessKey: better.accessKey,
              name: better.name,
              firstName: better.firstName,
              isAdmin: better.isAdmin === 1 ? true : false,
              isTutorialDone: better.isTutorialDone == 1 ? true : false,
              evaluation: better.evaluation,
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
      clubName: this.persistenceService.isClubName ? 1 : 0,
      autoNavigation: this.persistenceService.isAutoNavigation ? 1 : 0,
      playerReverse: this.persistenceService.isPlayerReverse ? 1 : 0,
      darkMode: this.persistenceService.isDarkMode ? 1 : 0,
      playerRanking: this.persistenceService.isPlayerRanking ? 1 : 0,
      firstnameVisible: this.persistenceService.isFirstnameVisible ? 1 : 0,
    });
  }
}
