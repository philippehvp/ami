import { ICategory } from './category';

export interface IContest {
  id: number;
  shortName: string;
  longName: string;
  startDate: Date;
  endBetDate: Date;
  endAdminDate: Date;
  day: number;
  isUpdatable: boolean;
  categories: ICategory[];
}
