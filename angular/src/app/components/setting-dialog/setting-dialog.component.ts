import { DOCUMENT } from '@angular/common';
import { Component, Renderer2, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PersistenceService } from 'src/app/services/persistence.service';

@Component({
  selector: 'setting-dialog',
  templateUrl: './setting-dialog.component.html',
  styleUrls: ['./setting-dialog.component.scss'],
})
export class SettingDialogComponent {
  private persistenceService = inject(PersistenceService);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private matDialogRef = inject(MatDialogRef<SettingDialogComponent>);

  public get withClubName(): boolean {
    return this.persistenceService.withClubName;
  }

  public set withClubName(withClubName: boolean) {
    this.persistenceService.withClubName = withClubName;
  }

  public toggleWithClubName() {
    this.persistenceService.withClubName =
      !this.persistenceService.withClubName;
  }

  public get isAutoNavigation(): boolean {
    return this.persistenceService.isAutoNavigation;
  }

  public set isAutoNavigation(isAutoNavigation: boolean) {
    this.persistenceService.isAutoNavigation =
      !this.persistenceService.isAutoNavigation;
  }

  public toggleAutoNavigation() {
    this.persistenceService.isAutoNavigation =
      !this.persistenceService.isAutoNavigation;
  }

  public get isPlayerReverse(): boolean {
    return this.persistenceService.isPlayerReverse;
  }

  public set isPlayerReverse(isPlayerReverse: boolean) {
    this.persistenceService.isPlayerReverse = isPlayerReverse;
  }

  public togglePlayerReverse() {
    this.persistenceService.isPlayerReverse =
      !this.persistenceService.isPlayerReverse;
  }

  public get isDarkMode(): boolean {
    return this.persistenceService.isDarkMode;
  }

  public set isDarkMode(isDarkMode: boolean) {
    this.persistenceService.isDarkMode = isDarkMode;
  }

  public toggleDarkMode() {
    this.persistenceService.isDarkMode = !this.persistenceService.isDarkMode;
    const themeClass = this.isDarkMode ? 'dark-mode' : 'light-mode';
    this.renderer.setAttribute(this.document.body, 'class', themeClass);
  }

  public close() {
    this.matDialogRef.close();
  }
}
