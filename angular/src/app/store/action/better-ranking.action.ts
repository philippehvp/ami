export namespace BetterRankingActions {
  export class GetBetterRanking {
    static readonly type = '[Better Ranking] Get Better Ranking';
    constructor(public accessKey: string) {}
  }
}
