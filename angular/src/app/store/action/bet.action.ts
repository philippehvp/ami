import { IBetter } from 'src/app/models/better';

export namespace BetActions {
  export class GetBetters {
    static readonly type = '[Bet] Get Betters';
    constructor() {}
  }

  export class Betters {
    static readonly type = '[Bet] Betters';
    constructor() {}
  }

  export class SetBetter {
    static readonly type = '[Bet] Set Better';
    constructor(public better: IBetter) {}
  }

  export class GetContests {
    static readonly type = '[Bet] Get Contests';
    constructor(public accessKey: string) {}
  }

  export class GetCategories {
    static readonly type = '[Bet] Get Categories';
    constructor(public contestId: number) {}
  }

  export class SetCategory {
    static readonly type = '[Bet] Set Category';
    constructor(public categoryId: number) {}
  }

  export class GetPlayers {
    static readonly type = '[Bet] Get Players';
    constructor(public categoryId: number) {}
  }

  export class SetCurrentBet {
    static readonly type = '[Bet] Set Current Bet';
    constructor(public categoryId: number) {}
  }

  export class GetBets {
    static readonly type = '[Bet] Get Bets';
    constructor(public accessKey: string) {}
  }

  export class GetDuration {
    static readonly type = '[Bet] Get Duration';
    constructor(public accessKey: string) {}
  }

  export class SetDuration {
    static readonly type = '[Bet] Set Duration';
    constructor(public duration: number) {}
  }

  export class SetWinner {
    static readonly type = '[Bet] Set Winner';
    constructor(public playerId: number) {}
  }

  export class SetRunnerUp {
    static readonly type = '[Bet] Set Runner Up';
    constructor(public playerId: number) {}
  }

  export class AllBetsDone {
    static readonly type = '[Bet] All Bets Done';
    constructor() {}
  }
}
