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
}
