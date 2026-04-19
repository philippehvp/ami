import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { CommonService } from '../common.service';
import { IContest } from '../../models/contest';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class UmpireService {
  private httpClient = inject(HttpClient);

  public getContests(): Observable<IContest[]> {
    const url = CommonService.getURL('contest/contests');
    return this.httpClient.post<IContest[]>(url, null);
  }
}
