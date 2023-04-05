import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IBetter, IBetterRaw } from 'src/app/models/better';
import { CommonService } from './common.service';
import { IContest } from 'src/app/models/contest';
import { map } from 'rxjs/internal/operators/map';
import { ICategory } from 'src/app/models/category';
import { IBet } from 'src/app/models/bet';
import { IDuration } from 'src/app/models/duration';



@Injectable({
  providedIn: 'root'
})
export class BetService {
  constructor(private httpClient: HttpClient) { }

  public getBetters(): Observable<IBetter[]> {
    return this.getBettersRaw().pipe(
      map(bettersRaw => {
        return bettersRaw.map(betterRaw => {
          return {
            id: betterRaw.id,
            firstName: betterRaw.firstName,
            name: betterRaw.name,
            club: betterRaw.club,
            isAdmin: betterRaw.isAdmin === 1 ? true : false
          };
        });
      })
    );
  }

  private getBettersRaw(): Observable<IBetterRaw[]> {
    const url = CommonService.getURL('better/betters');
    return this.httpClient.get<IBetterRaw[]>(url);
  }

  public getContests(betterId: number): Observable<IContest[]> {
    const url = CommonService.getURL('contest/contests');
    const params: HttpParams = new HttpParams()
      .set('better', betterId);
    return this.httpClient.get<IContest[]>(url, { params });
  }

  public getCategories(contestId: number): Observable<ICategory[]> {
    const url = CommonService.getURL('category/categories');
    const params: HttpParams = new HttpParams()
      .set('contest', contestId);
    return this.httpClient.get<ICategory[]>(url, { params });
  }

  public getBet(betterId: number, categoryId: number): Observable<IBet> {
    const url = CommonService.getURL('bet/bet');
    const params: HttpParams = new HttpParams()
      .set('better', betterId)
      .set('category', categoryId);
    return this.httpClient.get<IBet>(url, { params });
  }

  public getBets(betterId: number): Observable<IBet[]> {
    const url = CommonService.getURL('bet/bets');
    const params: HttpParams = new HttpParams()
      .set('better', betterId)
    return this.httpClient.get<IBet[]>(url, { params });
  }

  public getDuration(betterId: number): Observable<IDuration> {
    const url = CommonService.getURL('bet/duration');
    const params: HttpParams = new HttpParams()
      .set('better', betterId);
    return this.httpClient.get<IDuration>(url, { params });
  }

  public setDuration(betterId: number, isAdmin: boolean, contestId: number, day: number, duration: number): Observable<void> {
    const url = CommonService.getURL('bet/updateDuration');
    return this.httpClient.put<void>(url, { better: betterId, isAdmin, contest: contestId, day, duration });
  }

  public setWinner(betterId: number, isAdmin: boolean, contestId: number, categoryId: number, playerId: number): Observable<void> {
    const url = CommonService.getURL('bet/updateWinner');
    return this.httpClient.put<void>(url, { better: betterId, isAdmin, contest: contestId, category: categoryId, player: playerId });
  }

  public setRunnerUp(betterId: number, isAdmin: boolean, contestId: number, categoryId: number, playerId: number): Observable<void> {
    const url = CommonService.getURL('bet/updateRunnerUp');
    return this.httpClient.put<void>(url, { better: betterId, isAdmin, contest: contestId, category: categoryId, player: playerId });
  }
}
