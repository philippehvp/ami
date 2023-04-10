export namespace RankingActions {
  export class CategoryToDisplay {
    static readonly type = '[Point] Category To Display';
    constructor(public categoryId: number) {}
  }
}
