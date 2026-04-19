export namespace UmpireActions {
  export class GetContests {
    static readonly type = '[Umpire] Get Contests';
    constructor() {}
  }

  export class SetContest {
    static readonly type = '[Umpire] Set Contest';
    constructor(public contestId: number) {}
  }

  export class GetCategories {
    static readonly type = '[Umpire] Get Categories';
    constructor(public contestId: number) {}
  }

  export class SetCategory {
    static readonly type = '[Bet] Set Category';
    constructor(public categoryId: number) {}
  }

  export class GetPlayers {
    static readonly type = '[Umpire] Get Players';
    constructor(public categoryId: number) {}
  }
}
