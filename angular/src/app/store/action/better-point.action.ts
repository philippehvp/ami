export namespace BetterPointActions {
  export class CategoryToDisplay {
    static readonly type = '[Better Point] Category To Display';
    constructor(public categoryId: number) {}
  }
}
