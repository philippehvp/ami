export interface IBetter {
    id: number;
    firstName: string;
    name: string;
    club: string;
    isAdmin: boolean;
}

export interface IBetterRaw {
    id: number;
    firstName: string;
    name: string;
    club: string;
    isAdmin: number;
}