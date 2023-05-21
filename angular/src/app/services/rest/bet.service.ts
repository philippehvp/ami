import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IBetter, IBetterRaw } from 'src/app/models/better';
import { CommonService } from './common.service';
import { IContest } from 'src/app/models/contest';
import { map } from 'rxjs/internal/operators/map';
import { IBet } from 'src/app/models/bet';
import { IDuration, IDurationRaw } from 'src/app/models/duration';
import { IEmpty, INotUpdatable, IOffline } from 'src/app/models/utils';
import { IBetterBet } from 'src/app/models/better-bet';
import { IBetReview, IBetReviewRaw } from 'src/app/models/review';

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
            isAdmin: betterRaw.isAdmin === 1 ? true : false,
            isTutorialDone: betterRaw.isTutorialDone === 1 ? true : false,
            evaluation: betterRaw.evaluation,
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
    return this.httpClient.post<IBet[]>(url, { accessKey }).pipe(
      map((bets) => {
        return bets.map(
          (bet) =>
            <IBet>{
              betterAccessKey: bet.betterAccessKey,
              categoryId: bet.categoryId,
              winnerId: bet.winnerId,
              runnerUpId: bet.runnerUpId,
              isComplete: bet.winnerId && bet.runnerUpId ? true : false,
            }
        );
      })
    );
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
          isDurationModified:
            (<IDurationRaw>durationRaw).isDurationModified === 1 ? true : false,
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
  ): Observable<IEmpty | IOffline | INotUpdatable> {
    const url = CommonService.getURL('bet/updateDuration');
    return this.httpClient.put<IEmpty | IOffline | INotUpdatable>(url, {
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
  ): Observable<IEmpty | IOffline | INotUpdatable> {
    const url = CommonService.getURL('bet/updateWinner');
    return this.httpClient.put<IEmpty | IOffline | INotUpdatable>(url, {
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
  ): Observable<IEmpty | IOffline | INotUpdatable> {
    const url = CommonService.getURL('bet/updateRunnerUp');
    return this.httpClient.put<IEmpty | IOffline | INotUpdatable>(url, {
      accessKey: accessKey,
      contest: contestId,
      category: categoryId,
      player: playerId,
    });
  }

  public calculatepointsAndRanking(
    accessKey: string
  ): Observable<IEmpty | IOffline | INotUpdatable> {
    const url = CommonService.getURL('bet/calculatePointsAndRanking');
    return this.httpClient.put<IEmpty | IOffline | INotUpdatable>(url, {
      accessKey: accessKey,
    });
  }

  public getBetterBet(accessKey: string): Observable<IBetterBet | IOffline> {
    const url = CommonService.getURL('bet/bettersBets');
    return this.httpClient.post<IBetterBet | IOffline>(url, { accessKey });
  }

  public getBetsReview(accessKey: string): Observable<IBetReview[] | IOffline> {
    return this.getBetsReviewRaw(accessKey).pipe(
      map((betsReviewRaw) => {
        return betsReviewRaw.map((betReviewRaw) => {
          return {
            contestId: betReviewRaw.contest_id,
            categoryId: betReviewRaw.category_id,
            categoryShortName: betReviewRaw.categoryShortName,
            winnerPlayerName1: betReviewRaw.winner_playerName1,
            winnerPlayerName2: betReviewRaw.winner_playerName2,
            runnerUpPlayerName1: betReviewRaw.runnerUp_playerName1,
            runnerUpPlayerName2: betReviewRaw.runnerUp_playerName2,
          };
        });
      })
    );
  }

  public getBetsReviewRaw(accessKey: string): Observable<IBetReviewRaw[]> {
    const url = CommonService.getURL('bet/review');
    return this.httpClient.post<IBetReviewRaw[]>(url, { accessKey });
  }
}
