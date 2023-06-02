export namespace BetStatActions {
  export class GetBetStat {
    static readonly type = '[Bet Stat] Get Bet Stat';
    constructor(public accessKey: string) {}
  }
}
