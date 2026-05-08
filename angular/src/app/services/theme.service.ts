import { Injectable, signal } from '@angular/core';

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark'
}

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'ami-theme';
  
  // Signal for reactive theme state
  private readonly _currentTheme = signal<Theme>(this.getStoredTheme());
  
  // Public readonly signal for components to subscribe to
  public readonly currentTheme = this._currentTheme.asReadonly();
  
  constructor() {
    // Apply the stored theme on initialization
    this.applyTheme(this._currentTheme());
  }
  
  /**
   * Toggle between light and dark themes
   * Updates the theme signal and persists the change
   */
  public toggleTheme(): void {
    const newTheme = this._currentTheme() === ThemeMode.LIGHT 
      ? ThemeMode.DARK 
      : ThemeMode.LIGHT;
    
    this.setTheme(newTheme);
  }
  
  /**
   * Set a specific theme
   * Updates the theme signal, applies CSS classes, and persists to localStorage
   * 
   * @param theme - The theme to set ('light' or 'dark')
   */
  public setTheme(theme: Theme): void {
    this._currentTheme.set(theme);
    this.applyTheme(theme);
    this.saveTheme(theme);
  }
  
  /**
   * Get the current theme value
   * 
   * @returns The current theme ('light' or 'dark')
   */
  public getCurrentTheme(): Theme {
    return this._currentTheme();
  }
  
  /**
   * Check if dark mode is currently active
   * 
   * @returns True if dark mode is active
   */
  public isDarkMode(): boolean {
    return this._currentTheme() === ThemeMode.DARK;
  }
  
  /**
   * Apply theme CSS classes to the document body
   * Adds or removes 'dark-theme' class from body element
   * 
   * @param theme - The theme to apply
   */
  private applyTheme(theme: Theme): void {
    const body = document.body;
    
    if (theme === ThemeMode.DARK) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }
  
  /**
   * Save theme preference to localStorage
   * Persists user's theme choice across browser sessions
   * 
   * @param theme - The theme to save
   */
  private saveTheme(theme: Theme): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }
  
  /**
   * Retrieve theme preference from localStorage
   * Falls back to light theme if no preference is stored
   * 
   * @returns The stored theme or 'light' as default
   */
  private getStoredTheme(): Theme {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored === ThemeMode.DARK ? ThemeMode.DARK : ThemeMode.LIGHT;
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
      return ThemeMode.LIGHT;
    }
  }
}
