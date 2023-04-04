import { ICategory } from "./category";

export interface IContest {
    id: number;
    shortName: string;
    longName: string;
    startDate: Date;
    endDate: Date;
    day: number;
    categories: ICategory[];
}
