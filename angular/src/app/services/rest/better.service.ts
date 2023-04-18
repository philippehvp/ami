import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IBetter, IBetterRaw } from 'src/app/models/better';
import { CommonService } from './common.service';
import { IEmpty, IError, IOffline } from 'src/app/models/utils';

@Injectable({
  providedIn: 'root',
})
export class BetterService {
  constructor(private httpClient: HttpClient) {}

  public login(account: string, password: string): Observable<IBetter> {
    return this.loginRaw(account, password).pipe(
      map((betterRaw) => {
        return {
          accessKey: betterRaw.accessKey,
          firstName: betterRaw.firstName,
          name: betterRaw.name,
          isAdmin: betterRaw.isAdmin === 1 ? true : false,
          isTutorialDone: betterRaw.isTutorialDone === 1 ? true : false,
        };
      })
    );
  }

  private loginRaw(account: string, password: string): Observable<IBetterRaw> {
    const url = CommonService.getURL('better/better');
    return this.httpClient.post<IBetterRaw>(url, { account, password });
  }

  public createBetter(
    account: string,
    password: string,
    name: string,
    firstName: string,
    contact: string
  ): Observable<IError | IBetter> {
    const url = CommonService.getURL('better/createBetter');
    return this.httpClient.post<IBetter>(url, {
      account,
      password,
      name,
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
}
