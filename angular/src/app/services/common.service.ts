import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { IAvatar, IUniverse } from '../models/avatar';
import { IBetter } from '../models/better';

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

  public static getAvatarSource(universe: IUniverse, avatar: IAvatar): string {
    if (universe) {
      if (CommonService.isProduction) {
        return (
          'assets/img/avatar/' + universe.folder + '/' + avatar.file + '.png'
        );
      } else {
        return (
          '../../assets/img/avatar/' +
          universe.folder +
          '/' +
          avatar.file +
          '.png'
        );
      }
    }

    return '';
  }

  public static getAvatarSourceFromBetter(better: IBetter | null): string {
    if (better && better.universeFolder && better.avatarFile) {
      if (CommonService.isProduction) {
        return (
          'assets/img/avatar/' +
          better.universeFolder +
          '/' +
          better.avatarFile +
          '.png'
        );
      } else {
        return (
          '../assets/img/avatar/' +
          better.universeFolder +
          '/' +
          better.avatarFile +
          '.png'
        );
      }
    }

    return '';
  }
}
