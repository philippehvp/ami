import { IBetter } from "src/app/models/better";

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
    constructor(public betterId: number) {}
  }

  export class GetContests {
    static readonly type = '[Bet] Get Contests';
    constructor(public betterId: number) {}
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

  export class GetBet {
    static readonly type = '[Bet] Get Bet';
    constructor(public betterId: number, public categoryId: number) {}
  }

  export class GetBets {
    static readonly type = '[Bet] Get Bets';
    constructor(public betterId: number) {}
  }

  export class GetDuration {
    static readonly type = '[Bet] Get Duration';
    constructor(public betterId: number) {}
  }

  export class SetDuration {
    static readonly type = '[Bet] Set Duration';
    constructor(public betterId: number, public duration: number) {}
  }

  export class SetWinner {
    static readonly type = '[Bet] Set Winner';
    constructor(public playerId: number) {}
  }

  export class SetRunnerUp {
    static readonly type = '[Bet] Set Runner Up';
    constructor(public playerId: number) {}
  }
}
