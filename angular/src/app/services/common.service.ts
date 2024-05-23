import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  static isProduction: boolean | undefined;

  static getURL(url: string): string {
    if (CommonService.isProduction === undefined) {
      CommonService.isProduction =
        window.location.href.search('localhost') === -1;
    }
    return CommonService.restPrefix() + url + CommonService.restSuffix();
  }

  private static restPrefix(): string {
    return CommonService.isProduction
      ? AppConfig.PRODUCTION_PHP_REST_URL
      : AppConfig.LOCAL_PHP_REST_URL;
  }

  private static restSuffix(): string {
    return AppConfig.PHP_SUFFIX;
  }
}
