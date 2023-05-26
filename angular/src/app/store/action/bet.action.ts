import { IBetter } from 'src/app/models/better';

export namespace BetActions {
  export class SetBetter {
    static readonly type = '[Bet] Set Better';
    constructor(public better: IBetter) {}
  }

  export class SetTutorialDone {
    static readonly type = '[Bet] Set Tutorial Done';
    constructor() {}
  }

  export class SetEvaluation {
    static readonly type = '[Bet] Set Evaluation';
    constructor(public evaluationLevel: number) {}
  }

  export class GetContests {
    static readonly type = '[Bet] Get Contests';
    constructor(public accessKey: string) {}
  }

  export class SetCategory {
    static readonly type = '[Bet] Set Category';
    constructor(public categoryId: number) {}
  }

  export class GotoNextCategory {
    static readonly type = '[Bet] Goto Next Category';
    constructor() {}
  }

  export class GetPlayers {
    static readonly type = '[Bet] Get Players';
    constructor(public accessKey: string, public categoryId: number) {}
  }

  export class SetBet {
    static readonly type = '[Bet] Set Bet';
    constructor(public categoryId: number) {}
  }

  export class GetBets {
    static readonly type = '[Bet] Get Bets';
    constructor(public accessKey: string) {}
  }

  export class GetBetsReview {
    static readonly type = '[Bet] Get Bets Review';
    constructor() {}
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

  export class CalculatePointsAndRanking {
    static readonly type = '[Bet] Calculate Points And Ranking';
    constructor() {}
  }

  export class GetBetterPoint {
    static readonly type = '[Bet] Get Better Point';
    constructor(public accessKey: string, public categoryId: number) {}
  }

  export class GetBetterBet {
    static readonly type = '[Bet] Get Better Bet';
    constructor(public accessKey: string) {}
  }

  export class IsNotUpdatable {
    static readonly type = '[Bet] Is Not Updatable';
    constructor() {}
  }

  export class IsLoadingData {
    static readonly type = '[Bet] Is Loading Data';
    constructor(public isLoadingData: boolean) {}
  }

  export class UnsetAllBetsDone {
    static readonly type = '[Bet] Unset All Bets Done';
    constructor() {}
  }

  export class ProposeAutoNavigation {
    static readonly type = '[Bet] Propose Auto Navigation';
    constructor() {}
  }
}
