import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class UtilsService {
    private static _focusedTabIndex: number | undefined;

    // public static get focusedTabIndex(): number {
    //     return UtilsService._focusedTabIndex || 0;
    // }

    // public static set focusedTabIndex(focusedTabIndex: number) {
    //   UtilsService._focusedTabIndex = focusedTabIndex;
    // }

    public static isFocusedOnWinner(): boolean {
      return UtilsService._focusedTabIndex === 0;
    }

    public static focusWinner() {
      UtilsService._focusedTabIndex = 0;
    }

    public static focusRunnerUp() {
      UtilsService._focusedTabIndex = 1;
    }

    constructor() { }
  
    
  }