export interface IBetterRanking {
  completedCategories: number;
  countOfCategories: number;
  rankings: IRanking[];
}

export interface IRanking {
  name: string;
  firstName: string;
  randomKey: string;
  points: number;
  ranking: number;
  duration: number;
}
