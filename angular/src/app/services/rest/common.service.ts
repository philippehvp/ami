import { environment } from '../../environments/environement';
import { AppConfig } from '../../app.config';

export class CommonService {
  static getURL(url: string): string {
    return (
      CommonService.restPrefix() +
      url +
      CommonService.restSuffix()
    );
  }

  private static restPrefix(): string {
    return environment.production
    ? AppConfig.PRODUCTION_PHP_REST_URL
    : AppConfig.LOCAL_PHP_REST_URL;
  }

  private static restSuffix(): string {
    return AppConfig.PHP_SUFFIX;
  }
}
