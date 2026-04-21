import { IFirstPoint } from '../../models/launch-data';
import { IPoint } from '../../models/point';

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

  export class InitMatch {
    static readonly type = '[Umpire] Init Match';
    constructor(public firstPoint: IFirstPoint) {}
  }

  export class AddPoint {
    static readonly type = '[Umpire] Add Point';
    constructor(public isLeftSide: boolean) {}
  }
}
