import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBetter } from 'src/app/models/better';
import { CommonService } from './common.service';
import { IError } from 'src/app/models/utils';
import { IBetterBet } from 'src/app/models/better-bet';

@Injectable({
  providedIn: 'root',
})
export class BetterService {
  constructor(private httpClient: HttpClient) {}

  public login(account: string, password: string): Observable<IBetter> {
    const url = CommonService.getURL('better/better');
    return this.httpClient.post<IBetter>(url, { account, password });
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
}
