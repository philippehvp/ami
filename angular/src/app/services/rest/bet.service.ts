import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IBetter, IBetterRaw } from 'src/app/models/better';
import { CommonService } from './common.service';
import { IContest } from 'src/app/models/contest';
import { map } from 'rxjs/internal/operators/map';
import { IBet } from 'src/app/models/bet';
import { IDuration, IDurationRaw } from 'src/app/models/duration';
import { IEmpty, IOffline } from 'src/app/models/utils';

@Injectable({
  providedIn: 'root',
})
export class BetService {
  constructor(private httpClient: HttpClient) {}

  public getBetters(): Observable<IBetter[] | IOffline> {
    return this.getBettersRaw().pipe(
      map((bettersRaw) => {
        return bettersRaw.map((betterRaw) => {
          return {
            accessKey: betterRaw.accessKey,
            firstName: betterRaw.firstName,
            name: betterRaw.name,
            club: betterRaw.club,
            isAdmin: betterRaw.isAdmin === 1 ? true : false,
          };
        });
      })
    );
  }

  private getBettersRaw(): Observable<IBetterRaw[]> {
    const url = CommonService.getURL('better/betters');
    return this.httpClient.get<IBetterRaw[]>(url);
  }

  public getContests(accessKey: string): Observable<IContest[] | IOffline> {
    const url = CommonService.getURL('contest/contests');
    return this.httpClient.post<IContest[]>(url, { accessKey });
  }

  public getBets(accessKey: string): Observable<IBet[] | IOffline> {
    const url = CommonService.getURL('bet/bets');
    return this.httpClient.post<IBet[]>(url, { accessKey });
  }

  public getDuration(accessKey: string): Observable<IDuration | IOffline> {
    return this.getDurationRaw(accessKey).pipe(
      map((durationRaw: IDurationRaw | IOffline) => {
        return {
          duration: (<IDurationRaw>durationRaw).duration,
          isDurationUpdatable:
            (<IDurationRaw>durationRaw).isDurationUpdatable === 1
              ? true
              : false,
        };
      })
    );
  }

  private getDurationRaw(
    accessKey: string
  ): Observable<IDurationRaw | IOffline> {
    const url = CommonService.getURL('bet/duration');
    return this.httpClient.post<IDurationRaw>(url, { accessKey });
  }

  public setDuration(
    accessKey: string,
    contestId: number,
    day: number,
    duration: number
  ): Observable<IEmpty | IOffline> {
    const url = CommonService.getURL('bet/updateDuration');
    return this.httpClient.put<IEmpty>(url, {
      accessKey: accessKey,
      contest: contestId,
      day,
      duration,
    });
  }

  public setWinner(
    accessKey: string,
    contestId: number,
    categoryId: number,
    playerId: number
  ): Observable<IEmpty | IOffline> {
    const url = CommonService.getURL('bet/updateWinner');
    return this.httpClient.put<IEmpty>(url, {
      accessKey: accessKey,
      contest: contestId,
      category: categoryId,
      player: playerId,
    });
  }

  public setRunnerUp(
    accessKey: string,
    contestId: number,
    categoryId: number,
    playerId: number
  ): Observable<IEmpty | IOffline> {
    const url = CommonService.getURL('bet/updateRunnerUp');
    return this.httpClient.put<IEmpty>(url, {
      accessKey: accessKey,
      contest: contestId,
      category: categoryId,
      player: playerId,
    });
  }
}
