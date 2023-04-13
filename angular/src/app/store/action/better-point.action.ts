export namespace BetterPointActions {
  export class GetBetterPoint {
    static readonly type = '[Better Point] Get Better Point';
    constructor(public accessKey: string, public categoryId: number) {}
  }
}
