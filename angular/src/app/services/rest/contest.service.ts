import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { CommonService } from '../common.service';
import { IContest } from '../../models/contest';

@Injectable({
  providedIn: 'root',
})
export class ContestService {
  private httpClient = inject(HttpClient);

  public getContests(): Observable<IContest[]> {
    const url = CommonService.getURL('contest/contests');
    return this.httpClient.post<IContest[]>(url, null);
  }
}
